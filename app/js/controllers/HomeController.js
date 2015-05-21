'use strict';

socialNetworkApp.controller('HomeController',
    ['$scope', 'postData', 'credentials', 'defaultProfileImageData', function ($scope, postData, credentials, defaultProfileImageData) {
        var _defaultStartPostId = 0,
            _defaultPageSize = 5;
        $scope.isLogged = credentials.checkForSessionToken();
        $scope.defaultProfileImageData = defaultProfileImageData;

        if($scope.isLogged) {
            postData.getNewsFeed(_defaultStartPostId, _defaultPageSize)
                .$promise
                .then(function (data) {
                    $scope.newsFeed = data;
                }, function (error) {

                })
        }
}]);
