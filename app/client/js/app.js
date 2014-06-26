
var quaverApp = angular.module('quaver', ["noteStoreServices",  'ui.bootstrap']);

//
// See http://stackoverflow.com/questions/14833326/how-to-set-focus-in-angularjs
//
quaverApp.directive('focusOn', function() {
    return function(scope, elem, attr) {
        scope.$on('focusOn', function(e, name) {
            if(name === attr.focusOn) {
                elem[0].focus();
            }
        });
    };
});

quaverApp.factory('focus', function ($rootScope, $timeout) {
    return function(name) {
        $timeout(function (){
            $rootScope.$broadcast('focusOn', name);
        });
    }
});

/**
 * Top-level application controller.
 */
quaverApp.controller('QuaverCtrl', ["$scope", "NoteStore", function ($scope, NoteStore) {


    $scope.newNote = function() {
        NoteStore.newNote()
            .then(function(note) {
                console.log(note);
            });

    }

    $scope.showDevTools = function() {
        remote.getCurrentWindow().toggleDevTools();
    }

    $scope.reload = function() {
        remote.getCurrentWindow().reload();
    }

}]);