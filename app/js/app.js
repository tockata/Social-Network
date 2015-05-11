'use strict';

var socialNetworkApp = angular
    .module('socialNetworkApp', ['ngResource', 'ngRoute'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'partials/guest/guest.html'
            })
            .when('/login', {
                templateUrl: 'partials/guest/login.html',
                controller: ''
            })
            .when('/register', {
                templateUrl: 'partials/guest/register.html',
                controller: ''
            })
    });