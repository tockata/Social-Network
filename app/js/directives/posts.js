'use strict';

socialNetworkApp.directive('posts', function () {
    return {
        templateUrl: 'partials/directives/posts.html',
        restrict: 'A',
        controller: 'UserWallController'
    }
});
