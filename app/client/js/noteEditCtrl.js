var textile = require("./vendor/bower/textile-js/lib/textile.js");
var remote = require('remote');
var ipc = require('ipc');


quaverApp.controller('NoteEditCtrl', ["$scope", "NoteStore", "$sce", "focus", function ($scope, NoteStore, $sce, focus) {


    var editor = CKEDITOR.replace("editor", {
        toolbar: [

            { name: 'basicstyles', items: ['Format', 'Styles', 'Bold', 'Italic', 'Underline', 'Strike' ] },
            { name: 'lists', items: [ 'NumberedList', 'BulletedList', 'Indent', 'Outdent' ] },
            { name: 'form', items: [ 'Checkbox', 'Textarea', 'Table' ] },
            { name: 'links', items: [ 'Link', 'Image' ] },
            { name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] }
        ]
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


    editor.on('change', function () {
        noteChanged();
    });


}]);