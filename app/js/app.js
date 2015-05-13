'use strict';

var socialNetworkApp = angular
    .module('socialNetworkApp', ['ngResource', 'ngRoute', 'ngStorage'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'partials/home.html'
            })
            .otherwise({
                redirectTo: '/'
            })
    })
    .constant('baseUrl', 'http://softuni-social-network.azurewebsites.net/api/');