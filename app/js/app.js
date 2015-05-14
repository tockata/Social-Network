'use strict';

var socialNetworkApp = angular
    .module('socialNetworkApp', ['ngResource', 'ngRoute', 'ngStorage', 'toaster'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'partials/home.html'
            })
            .when('/logout', {
                templateUrl: 'partials/user/logout.html',
                controller: 'LogoutController'
            })
            .otherwise({
                redirectTo: '/'
            })
    })
    .value('user', {
        username: '',
        name: ''
    })
    .constant('baseUrl', 'http://softuni-social-network.azurewebsites.net/api/');