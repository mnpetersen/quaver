var textile = require("./vendor/bower/textile-js/lib/textile.js");
var remote = require('remote');
var ipc = require('ipc');


quaverApp.controller('NoteEditCtrl', ["$scope", "NoteStore", "$sce", "focus", function ($scope, NoteStore, $sce, focus) {

    "use strict";

    var editor = CKEDITOR.replace("editor", {
        toolbar: [

            { name: 'basicstyles', items: ['Format', 'Styles', 'Bold', 'Italic', 'Underline', 'Strike' ] },
            { name: 'lists', items: [ 'NumberedList', 'BulletedList', 'Indent', 'Outdent' ] },
            { name: 'form', items: [ 'Checkbox', 'Textarea', 'Table' ] },
            { name: 'links', items: [ 'Link', 'Image' ] },
            { name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] }
        ]
    });

    //used to get keysrtroke based shortcuts
    var shortcuts = [
        {   rexp: /\*/,
            fn: function () {
                editor.execCommand('bulletedlist');
            }},
        {
            rexp: /\d*\./,
            fn: function () {
                editor.execCommand('numberedlist');
            }
        }
    ];


    editor.on('key', function (evt) {

        //32 == ''
        if (evt.data.keyCode === 32) {
            var range = editor.getSelection().getRanges()[0],
                node = range.startContainer;

            if (node.type === CKEDITOR.NODE_TEXT && range.startOffset) {
                var text = node.getText().substring(0, range.startOffset);
                shortcuts.every(function(sc) {
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

    $scope.edit = function () {
        $scope.editMode = true;
        focus("noteContents");
    }

    var noteSelected = function (note) {

        $scope.selectedNote = note;
        $scope.selectedNote.edit = {
            title: note.title()
        }
        editor.setData(note.markup());
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

    $scope.deleteCurrentNote = function() {
        if ($scope.selectedNote == null) {
            return;
        }
        return NoteStore.deleteNote($scope.selectedNote);
    }


    editor.on('change', function () {
        noteChanged();
    });


}]);