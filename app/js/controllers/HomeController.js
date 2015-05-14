'use strict';

socialNetworkApp.controller('HomeController',
    ['$scope', '$location', 'userData', 'credentials', function ($scope, $location, userData, credentials) {
        $scope.isLogged = credentials.isLogged();
    }]);
