app.controller('bookmarksCtr', ['$scope', '$state', '$stateParams', '$filter', '$window', '$timeout', 'bookmarkService', 'pubSubService', function($scope, $state, $stateParams, $filter, $window, $timeout, bookmarkService, pubSubService) {
    console.log("Hello bookmarksCtr...", $stateParams);
    $scope.bookmarks = []; // 书签数据
    $scope.showSearch = false; // 搜索对话框
    $scope.bookmarkNormalHover = false;
    $scope.bookmarkEditHover = false;
    $scope.showStyle = 'navigate'; // 显示风格'navigate', 'card', 'table'
    $scope.edit = false;
    $scope.totalPages = 0;
    $scope.currentPage = 1;
    $scope.inputPage = '';
    $scope.changeCurrentPage = function(currentPage) {
        currentPage = parseInt(currentPage) || 0;
        console.log(currentPage);
        if (currentPage <= $scope.totalPages && currentPage >= 1) {
            $scope.currentPage = currentPage;
            $scope.inputPage = '';
        }
    }

    var params = {
        showStyle: $scope.showStyle,
    }
    getBookmarks(params);

    $scope.jumpToUrl = function(url, id) {
        if (!$scope.edit) {
            $window.open(url, '_blank');
            bookmarkService.clickBookmark({
                id: id
            });
        }
    }
    $scope.toggleMode = function() {
        $scope.edit = !$scope.edit
    };

    $scope.delBookmark = function(bookmarkId) {
        var params = {
            id: bookmarkId
        }
        bookmarkService.delBookmark(params)
            .then((data) => $("#" + bookmarkId).remove())
            .catch((err) => {
                console.log('delBookmark err ', err)
            });
    }
    $scope.editBookmark = function(bookmarkId) {
        pubSubService.publish('bookmarksCtr.editBookmark', {
            'bookmarkId': bookmarkId
        });
    }

    $scope.detailBookmark = function(bookmarkId) {

    }

    pubSubService.subscribe('MenuCtr.searchDetail', $scope, function(event, params) {
        $scope.showSearch = (params && params.showSearch)
    });
    pubSubService.subscribe('MenuCtr.updateShowStyle', $scope, function(event, params) {
        $scope.showStyle = (params && params.showStyle);
        getBookmarks(params);
    });


    pubSubService.subscribe('MenuCtr.searchBookmarks', $scope, function(event, params) {
        console.log('subscribe MenuCtr.searchBookmarks', params);
        getBookmarks(params);
    });

    pubSubService.subscribe('EditCtr.inserBookmarsSuccess', $scope, function(event, params) {
        params.showStyle = $scope.showStyle;
        console.log('subscribe EditCtr.inserBookmarsSuccess', params);
        getBookmarks(params);
    });

    function getBookmarks(params) {
        bookmarkService.getBookmarks(params)
            .then((data) => {
                $scope.bookmarks = data;
                $scope.totalPages = parseInt(Math.random() * 1000);
                $scope.currentPage = (parseInt(Math.random() * 1000) % $scope.totalPages) + 1;
                pubSubService.publish('Common.menuActive', {
                    login: true,
                    index: 0
                });
            })
            .catch((err) => console.log('getBookmarks err', err));
    }

    $scope.$on('viewContentLoaded', function(elementRenderFinishedEvent) {
        $('.ui.dropdown').dropdown();
    });

}]);
