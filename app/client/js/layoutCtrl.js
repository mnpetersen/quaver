quaverApp.controller('LayoutCtrl', ["$scope", "focus", function ($scope, $sce) {


    var leftTabs = [
        {
            id: "notesList",
            idx:1,
            text: "Notes",
            icon : "fa-list-alt",
            include : "_noteList.html"
        },
        {
            id:"tagsList",
            idx:2,
            text:"Tags",
            icon : "fa-tags",
            include : "_tabList.html"
        },
        {
            id:"trashlist",
            idx:3,
            text:"Trash",
            icon : "fa-trash-o",
            include : "_tabList.html"
        }
    ];


    $scope.leftTabs = _.sortBy(leftTabs,function(t) {return (-t.idx)});

    $scope.leftBarExpanded =true;
    $scope.rightBarExpanded = false;
    $scope.selectedLeftTab = leftTabs[0];

    function toggleLeft() {
        $scope.leftBarExpanded = !$scope.leftBarExpanded;
    }

    $scope.leftTabSelected =function(tab) {
        if ($scope.selectedLeftTab == tab) {
            toggleLeft();
        } else {
            $scope.leftBarExpanded = true;
        }
        $scope.selectedLeftTab  = tab;
    }

    $scope.isSelectedLeft = function(tab) {
        return ($scope.selectedLeftTab == tab);
    }

    $scope.isLeftBarExpanded = function() {
        return $scope.leftBarExpanded;
    }
}]);

