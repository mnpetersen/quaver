var quverApp = angular.module('quaver', ["noteStoreServices"]);

quverApp.controller('MainPageCtrl', ["$scope", "NoteStore", function ($scope, NoteStore) {

    $scope.notes = [];
    $scope.tags = [];

    $scope.selectedNote = null;
    $scope.selectedTag = null;

    NoteStore.allNotes().then(function(allNotes) {
       $scope.notes = allNotes;
    });

    NoteStore.allTags().then(function(allTags){
        $scope.tags = allTags;
    })

    $scope.noteSelected = function(note) {
        $scope.selectedNote = note;
    }

    $scope.tagSelected = function(tag) {
        $scope.selectedTag = tag;
    }

}]);