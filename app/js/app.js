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
            .when('/profile', {
                templateUrl: 'partials/user/edit-profile.html',
                controller: 'EditProfileController'
            })
            .otherwise({
                redirectTo: '/'
            })
    })
    .value('loggedUser', {
        id: null,
        username: null,
        name: null,
        email: null,
        profileImageData: null,
        gender: null,
        coverImageData: null
    })
    .constant('baseUrl', 'http://softuni-social-network.azurewebsites.net/api/');