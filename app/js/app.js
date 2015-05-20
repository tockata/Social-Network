'use strict';

var socialNetworkApp = angular
    .module('socialNetworkApp', ['ngResource', 'ngRoute', 'ngStorage', 'toaster', 'naif.base64'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'partials/home.html'
            })
            .when('/logout', {
                templateUrl: 'partials/user/logout.html',
                controller: 'LogoutController'
            })
            .when('/profile', {
                templateUrl: 'partials/user/edit-profile.html',
                controller: 'EditProfileController'
            })
            .otherwise({
                redirectTo: '/'
            })
    })
    .constant('baseUrl', 'http://softuni-social-network.azurewebsites.net/api/');