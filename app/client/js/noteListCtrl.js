quaverApp.controller('NoteListCtrl', ["$scope", "NoteStore", "$sce", "focus", "$rootScope", function ($scope, NoteStore, $sce, focus, $rootScope) {


    $scope.notes = [];
    $scope.tags = [];
    $scope.selectedNote = null;
    $scope.notebooks = [];
    $scope.selectedNotebook = null;

    refresh();

    function refresh() {
        NoteStore.allNotes().then(function (allNotes) {
            $scope.notes = allNotes;
        });
        NoteStore.notebooks().then(function (notebooks) {
            $scope.notebooks = notebooks;
        });
    }

    NoteStore.on('new-note', function (note) {
        refresh().then(function () {
            $scope.noteSelected(note);
        });
    });

    NoteStore.on('save-note', function (note) {
        refresh().then(function callback() {
            $scope.noteSelected(note);
        });
    });

    NoteStore.on('delete-note', function (note) {
        if ($scope.selectedNote === note) {
            $scope.noteSelected(null);
        }
        refresh();
    });


    $scope.noteSelected = function (note) {
        if ($scope.selectedNote === note) {
            return;
        }
        $scope.selectedNote = note;
        $rootScope.$broadcast("note-selected", note);
    }

    $scope.renderHtml = function (note) {
        return $sce.trustAsHtml(note.markup().replace(/(<([^>]+)>)/ig, ""));
    };

    $scope.newNote = function () {
        var note = NoteStore.newNote().then(function (note) {
            refresh();
            $scope.noteSelected(note);
        });
    }


}])
;
