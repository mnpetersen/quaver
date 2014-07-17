var remote = require('remote');


quaverApp.controller('NoteEditCtrl', ["$scope", "NoteStore", "$sce", "focus", function ($scope, NoteStore, $sce, focus) {

    "use strict";

    CKEDITOR.disableAutoInline = true;
    var editor = CKEDITOR.inline(document.getElementById("editor"), {
        extraPlugins: 'sharedspace',

        sharedSpaces: {
            top: 'editorToolbar'
        },
        toolbar: [
            {name: 'basicstyles', items: ['Format', 'Styles', 'Bold', 'Italic', 'Underline', 'Strike' ]},
            {name: 'lists', items: [ 'NumberedList', 'BulletedList', 'Indent', 'Outdent' ]},
            {name: 'form', items: [ 'Checkbox', 'Textarea', 'Table' ]},
            {name: 'links', items: [ 'Link', 'Image' ]}
        ]

    });


    //used to get keysrtroke based shortcuts
    var shortcuts = [
        {
            rexp: /\*/,
            fn: function () {
                editor.execCommand('bulletedlist');
            }
        },
        {
            rexp: /\d*\./,
            fn: function () {
                editor.execCommand('numberedlist');
            }
        }
    ];

    editor.on('focus', function () {
        editor.setReadOnly(false);
        $scope.$apply("toolbarVisible = true");
    });

    editor.on('blur', function () {
        console.log("blur");
        $scope.$apply("toolbarVisible = false");
    });


    editor.on('key', function (evt) {

        //32 == ''
        if (evt.data.keyCode === 32) {
            var range = editor.getSelection().getRanges()[0],
                node = range.startContainer;

            if (node.type === CKEDITOR.NODE_TEXT && range.startOffset) {
                var text = node.getText().substring(0, range.startOffset);
                shortcuts.every(function (sc) {
                    if (sc.rexp.test(text)) {
                        node.setText(node.getText().substring(range.startOffset));
                        sc.fn();
                        return false;
                    }
                    return true;
                });


            }

        }

    });


    $scope.selectedNote = null;
    $scope.selectedNoteRendered = null;
    $scope.toolbarVisible = false;

    $scope.edit = function () {
        $scope.editMode = true;
        focus("noteContents");
    }

    var noteSelected = function (note) {

        $scope.selectedNote = note;
        $scope.selectedNote.edit = {
            title: note.title()
        }

        //stop this change from triggering a save of the new data.
        disableSave();
//        editor.setData(note.markup());
        document.getElementById("editor").innerHTML = note.markup();
        document.getElementById("editor").contentEditable = true;

    }

    var saveData = true;

    function disableSave() {
        saveData = false;
    }

    function enableSave() {
        saveData = true;
    }

    $scope.$on("note-selected", function (e, note) {
        noteSelected(note);
    });

    $scope.tagSelected = function (tag) {
        $scope.selectedTag = tag;
    }

    var noteChanged = _.throttle(function () {
        if ($scope.selectedNote === null) {
            return;
        }
        $scope.selectedNote.title($scope.selectedNote.edit.title);
        $scope.selectedNote.markup(editor.getData());
        NoteStore.saveNote($scope.selectedNote);
    }, 500);

    $scope.noteChanged = noteChanged;

    $scope.deleteCurrentNote = function () {
        if ($scope.selectedNote == null) {
            return;
        }
        return NoteStore.deleteNote($scope.selectedNote);
    }


    editor.on('change', function () {
        if (saveData) {
            noteChanged();
        } else {
            enableSave();
        }
    });


}])
;