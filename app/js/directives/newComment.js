'use strict';

socialNetworkApp.directive('newComment', function () {
    return {
        templateUrl: 'partials/directives/new-comment.html',
        restrict: 'A',
        controller: 'NewCommentController'
    }
});
