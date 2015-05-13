'use strict';

socialNetworkApp.controller('LoginController',
    ['$scope', '$route', 'userData', 'credentials', function ($scope, $route, userData, credentials) {
        $scope.rememberMe = false;
        $scope.login = login;

        function login(user, loginForm) {
            userData.login(user)
                .$promise
                .then(function (data) {
                    $scope.user = {};
                    if ($scope.rememberMe) {
                        $scope.$storage = credentials.saveInLocalStorage(data.access_token, data.token_type);
                    } else {
                        $scope.$storage = credentials.saveInSessionStorage(data.access_token, data.token_type);
                    }

                    $scope.loginForm.$setPristine();
                    $route.reload();
                }, function (error) {
                    console.log(error.statusText);
                })
        }
}]);
