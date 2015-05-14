'use strict';

socialNetworkApp.controller('RegisterController',
    ['$scope', '$route', '$timeout', 'userData', 'credentials', 'toaster', function ($scope, $route, $timeout, userData, credentials, toaster) {
        $scope.register = register;

        function register(user, registerForm) {
            userData.register(user)
                .$promise
                .then(function (data) {
                    $scope.user = {};
                    credentials.saveInSessionStorage(data.access_token, data.token_type);
                    $scope.registerForm.$setPristine();
                    toaster.pop('success', 'Register successful!');
                    reloadRoute(2000);
                }, function (error) {
                    toaster.pop('error', 'Registration error!');
                })
        }

        function reloadRoute(time) {
            $timeout(function () {
                $route.reload();
            }, time);
        }
    }
]);