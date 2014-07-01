quaverApp.controller('NoteListCtrl', ["$scope", "NoteStore", "$sce", "focus", "$rootScope", function ($scope, NoteStore, $sce, focus, $rootScope) {


    $scope.notes = [];
    $scope.tags = [];
    $scope.selectedNote = null;

    refresh();
    function refresh() {
        return NoteStore.allNotes().then(function (allNotes) {
            $scope.notes = allNotes;
        });
    }

    NoteStore.on('new-note', function (note) {
        refresh().then(function () {
            $scope.noteSelected(note);
        });
    })

    NoteStore.on('save-note', function (note) {
        refresh().then(function callback() {
            $scope.noteSelected(note);
        });
    });

    NoteStore.on('delete-note', function (note) {
        refresh().then(function () {
            $scope.noteSelected(null);
        });
    });


    $scope.noteSelected = function (note) {
        $scope.selectedNote = note;
        $rootScope.$broadcast("note-selected", note);
    }

    $scope.renderHtml = function (note) {

        return $sce.trustAsHtml(note.markup());
    };

    $scope.newNote = function () {
        var note = NoteStore.newNote().then(function (note) {
            refresh();
            $scope.noteSelected(note);
            $scope.edit();
        });
    }


}]);
