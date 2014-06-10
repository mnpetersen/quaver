var quverApp = angular.module('quaver', ["noteStoreServices",'ui.bootstrap']);
var textile = require("./bower_components/textile-js/lib/textile.js");
quverApp.controller('MainPageCtrl', ["$scope", "NoteStore", "$sce", function ($scope, NoteStore,$sce) {

    $scope.notes = [];
    $scope.tags = [];

    $scope.selectedNote = null;
    $scope.selectedNoteRendered = null;
    $scope.selectedTag = null;

    refresh();
    function refresh() {
        NoteStore.allNotes().then(function (allNotes) {
            $scope.notes = allNotes;
        });

        NoteStore.allTags().then(function (allTags) {
            $scope.tags = allTags;

        });
    }

    $scope.newNote = function() {

        var note = NoteStore.newNote();
        refresh();
        $scope.noteSelected(note);
    }

    $scope.noteSelected = function(note) {
        editMode = false;
        $scope.selectedNote = note;
        var html = textile(note.markdown);
        $scope.selectedNoteRendered =  $sce.trustAsHtml(html);
    }

    $scope.tagSelected = function(tag) {
        $scope.selectedTag = tag;
    }

    $scope.noteContentsChanged = function() {
        var html = textile(note.markdown);
        $scope.selectedNoteRendered = $sce.trustAsHtml(html);
    }

}]);