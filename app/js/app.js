'use strict';

var socialNetworkApp = angular
    .module('socialNetworkApp', ['ngResource', 'ngRoute', 'ngStorage'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'partials/guest/guest.html'
            })
            .when('/home', {
                templateUrl: 'partials/home/news-feed.html'
            })
    })
    .constant('baseUrl', 'http://softuni-social-network.azurewebsites.net/api/');