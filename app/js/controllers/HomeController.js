'use strict';

socialNetworkApp.controller('HomeController',
    ['$scope', 'postData', 'credentials', 'toaster', 'defaultProfileImageData', function ($scope, postData, credentials, toaster, defaultProfileImageData) {
        var _defaultStartPostId = 0,
            _defaultPageSize = 5;
        $scope.isLogged = credentials.checkForSessionToken();
        $scope.defaultProfileImageData = defaultProfileImageData;
        $scope.showAllComments = showAllComments;

        if($scope.isLogged) {
            postData.getNewsFeed(_defaultStartPostId, _defaultPageSize)
                .$promise
                .then(function (data) {
                    $scope.newsFeed = data;
                }, function (error) {

                });
        }

        function showAllComments(postId) {
            $scope.postAllComments = {
                postId: postId,
                comments: []
            };
            postData.getPostComments(postId)
                .$promise
                .then(function (data) {
                    $scope.postAllComments.comments = data;
                }, function (error) {
                    toaster.pop('error', 'Error!', error.data.message);
                })
        }
}]);
