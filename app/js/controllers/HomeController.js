'use strict';

socialNetworkApp.controller('HomeController',
    ['$scope', 'postData', 'commentData', 'credentials', 'toaster', 'defaultProfileImageData', function ($scope, postData, commentData, credentials, toaster, defaultProfileImageData) {
        var _defaultStartPostId = 0,
            _defaultPageSize = 5;
        $scope.isLogged = credentials.checkForSessionToken();
        $scope.defaultProfileImageData = defaultProfileImageData;
        $scope.showAllComments = showAllComments;
        $scope.commentButtonName = 'Comment';
        $scope.showNewCommentForm = false;
        $scope.newCommentFormPostId = null;
        $scope.toggleNewCommentForm = toggleNewCommentForm;
        $scope.postComment = postComment;

        if($scope.isLogged) {
            getNewsFeed();
        }

        function showAllComments(postId) {
            $scope.postAllComments = {
                postId: postId,
                comments: []
            };
            postData.getPostComments(postId)
                .$promise
                .then(function (data) {
                    $scope.postAllComments.comments = data;
                }, function (error) {
                    toaster.pop('error', 'Error!', error.data.message);
                })
        }

        function toggleNewCommentForm(postId) {
            if($scope.showNewCommentForm) {
                $scope.showNewCommentForm = false;
                $scope.commentButtonName = 'Comment';
                $scope.commentContent = '';
            } else {
                $scope.showNewCommentForm = true;
                $scope.newCommentFormPostId = postId;
                $scope.commentButtonName = 'Hide';
            }
        }

        function postComment(commentContent, postId) {
            commentData.addComment(commentContent, postId)
                .$promise
                .then(function (data) {
                    toaster.pop('error', 'Success!', 'Comment successfully added.');
                    $scope.showNewCommentForm = false;
                    $scope.newCommentFormPostId = null;
                    getNewsFeed();
                }, function (error) {
                    toaster.pop('error', 'Error!', error.data.message);
                });
        }

        function getNewsFeed() {
            postData.getNewsFeed(_defaultStartPostId, _defaultPageSize)
                .$promise
                .then(function (data) {
                    $scope.newsFeed = data;
                }, function (error) {

                });
        }
}]);