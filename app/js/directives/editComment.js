'use strict';

socialNetworkApp.directive('editComment', function () {
    return {
        templateUrl: 'partials/directives/edit-comment.html',
        restrict: 'A',
        controller: 'EditCommentController'
    }
});