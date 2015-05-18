'use strict';

socialNetworkApp.controller('HomeController',
    ['$scope', '$location', 'userData', 'credentials', function ($scope, $location, userData, credentials) {
        $scope.isLogged = credentials.isLogged();
        $scope.user = {};

        if($scope.isLogged) {
            userData.getLoggedUserData()
                .$promise
                .then(function (data) {
                    saveUserData(data);
                }, function (error) {
                    credentials.deleteCredentials();
                });
        } else {
            $scope.user = {};
        }

        function saveUserData(data) {
            $scope.user.id = data.id;
            $scope.user.username = data.username;
            $scope.user.name = data.name;
            $scope.user.email = data.email;
            $scope.user.profileImageData = data.profileImageData;
            $scope.user.gender = data.gender;
            $scope.user.coverImageData = data.coverImageData;
        }
    }]);
