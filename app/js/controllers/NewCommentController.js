'use strict';

socialNetworkApp.controller('NewCommentController',
    ['$scope', 'commentData', 'toaster', function ($scope, commentData, toaster) {
        var defaultNotificationTimeout = 2000;
        $scope.showNewCommentForm = false;
        $scope.newCommentFormPostId = null;
        $scope.toggleNewCommentForm = toggleNewCommentForm;
        $scope.postComment = postComment;

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
            $scope.posts.forEach(function (post) {
                if(post.id == postId) {
                    if(post.author.isFriend || post.wallOwner.isFriend || $scope.user.username == post.author.username) {
                        commentData.addComment(commentContent, postId)
                            .$promise
                            .then(function (data) {
                                $scope.showNewCommentForm = false;
                                $scope.newCommentFormPostId = null;
                                post.comments.unshift(data);
                                post.totalCommentsCount++;
                                toaster.pop('success', 'Success!', 'Comment successfully added.', defaultNotificationTimeout);
                            }, function (error) {
                                toaster.pop('error', 'Error!', error.data.message, defaultNotificationTimeout);
                            });
                    } else {
                        toaster.pop(
                            'error',
                            'Error!',
                            'You can`t comment on posts when neither the author, nor wall owner is a friend.',
                            defaultNotificationTimeout);
                    }
                }
            });
        }
    }]);



