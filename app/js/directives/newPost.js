'use strict';

socialNetworkApp.directive('newPost', function () {
    return {
        templateUrl: 'partials/directives/new-post.html',
        restrict: 'A',
        controller: 'WallController'
    }
});