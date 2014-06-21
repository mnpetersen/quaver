var textile = require("./vendor/bower_components/textile-js/lib/textile.js");
var remote = require('remote');
var ipc = require('ipc');

quaverApp.controller('NoteEditCtrl', ["$scope", "NoteStore", "$sce", "focus", function ($scope, NoteStore, $sce,focus) {

    $scope.editMode = false;
    $scope.selectedNote = null;
    $scope.selectedNoteRendered = null;

    $scope.edit = function() {
        $scope.editMode = true;
        focus("noteContents");
    }

    var noteSelected = function (note) {
        $scope.editMode = false;
        $scope.selectedNote = note;
        var html = textile(note.markup());
        $scope.selectedNote.rendered = $sce.trustAsHtml(html);
        $scope.selectedNote.edit = {
            title : note.title(),
            markup : note.markup()
        }
    }

    $scope.$on("note-selected", function(e,note){
       noteSelected(note);
    });

    $scope.tagSelected = function (tag) {
        $scope.selectedTag = tag;
    }

    $scope.noteContentsChanged = _.throttle(function () {
        var html = textile($scope.selectedNote.edit.markup);
        $scope.selectedNote.rendered = $sce.trustAsHtml(html);
        $scope.selectedNote.title($scope.selectedNote.edit.title);
        $scope.selectedNote.markup($scope.selectedNote.edit.markup);
        NoteStore.saveNote($scope.selectedNote).then(refresh);
    }, 500);

}]);