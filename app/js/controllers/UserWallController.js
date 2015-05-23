'use strict';

socialNetworkApp.controller('UserWallController',
    ['$scope', '$route', '$routeParams', 'userData', 'friendsData', 'postData', 'commentData', 'credentials', 'toaster', 'defaultProfileImageData', 'defaultCoverImageData', function ($scope, $route, $routeParams, userData, friendsData, postData, commentData, credentials, toaster, defaultProfileImageData, defaultCoverImageData) {
        var _defaultStartPostId = 0,
            _defaultPageSize = 5;
        $scope.user = credentials.getLoggedUser();
        $scope.defaultProfileImageData = defaultProfileImageData;
        $scope.sendFriendRequest = sendFriendRequest;
        $scope.wallOwnerUsername = $routeParams.username;

        $scope.submitPost = submitPost;
        $scope.deletePost = deletePost;
        $scope.unlikePost = unlikePost;
        $scope.likePost = likePost;
        $scope.editPostFormShown = false;
        $scope.editPostFormPostId = null;
        $scope.showEditPostForm = showEditPostForm;
        $scope.closeEditPostForm = closeEditPostForm;
        $scope.editPost = editPost;

        $scope.showAllComments = showAllComments;
        $scope.commentButtonName = 'Comment';
        $scope.showNewCommentForm = false;
        $scope.newCommentFormPostId = null;
        $scope.toggleNewCommentForm = toggleNewCommentForm;
        $scope.postComment = postComment;
        $scope.unlikeComment = unlikeComment;
        $scope.likeComment = likeComment;

        $scope.deleteComment = deleteComment;
        $scope.editCommentFormShown = false;
        $scope.editCommentFormCommentId = null;
        $scope.showEditCommentForm = showEditCommentForm;
        $scope.closeEditCommentForm = closeEditCommentForm;
        $scope.editComment = editComment;

        $scope.userPreviewShown = false;
        $scope.showUserPreview = showUserPreview;

        getPosts();
        if($routeParams.username) {
            userData.getUserFullData($routeParams.username)
                .$promise
                .then(function (data) {
                    $scope.userData = data;
                    if($scope.user.username === $routeParams.username || $scope.userData.isFriend === true) {
                        $scope.isFriendOrLoggedUser = true;
                        $scope.wallOwner = $scope.userData.username;
                    }

                    if(!$scope.userData.coverImageData) {
                        $scope.userData.coverImageData = defaultCoverImageData;
                    }

                    if($scope.userData.isFriend) {
                        $scope.buttonName = 'Friend';
                        $scope.disabledButton = 'disabled';
                    } else if (
                        !$scope.userData.isFriend
                        && $scope.userData.hasPendingRequest
                        && $scope.user.username !== $routeParams.username) {
                        $scope.buttonName = 'Pending request';
                        $scope.disabledButton = 'disabled';
                    } else if(
                        !$scope.userData.isFriend
                        && !$scope.userData.hasPendingReques
                        && $scope.user.username !== $routeParams.username) {
                        $scope.buttonName = 'Invite';
                    } else {
                        $scope.buttonName = 'My wall';
                        $scope.disabledButton = 'disabled';
                    }

                }, function (error) {
                    toaster.pop('error', 'Error!', error.data.message);
                });
        }

        function getPosts() {
            if(!$routeParams.username) {
                postData.getNewsFeed(_defaultStartPostId, _defaultPageSize)
                    .$promise
                    .then(function (data) {
                        $scope.posts = data;
                    }, function (error) {
                        toaster.pop('error', 'Error!', error.data.message);
                    });
            } else {
                postData.getUserWall($routeParams.username, _defaultStartPostId, _defaultPageSize)
                    .$promise
                    .then(function (data) {
                        $scope.posts = data;
                    }, function (error) {
                        toaster.pop('error', 'Error!', error.data.message);
                    });
            }
        }

        function submitPost(postContent) {
            var post = {
                postContent: postContent,
                username: $scope.wallOwner
            };

            postData.addPost(post)
                .$promise
                .then(function (data) {
                    $scope.posts.unshift(data);
                    //$route.reload();
                    toaster.pop('success', 'Post successfully added!', data.message);
                }, function (error) {
                    toaster.pop('error', 'Error!', error.data.message);
                })
        }

        function deletePost(postId) {
            $scope.posts.forEach(function (post, index, object) {
                if(post.id == postId) {
                    postData.deletePost(postId)
                        .$promise
                        .then(function (data) {
                            toaster.pop('success', 'Success!', 'Post deleted successfully.');
                            object.splice(index, 1);
                        }, function (error) {
                            toaster.pop('error', 'Error!', error.data.message);
                        });
                }
            })
        }

        function showEditPostForm(postId) {
            $scope.editPostFormShown = true;
            $scope.editPostFormPostId = postId;
        }

        function closeEditPostForm(){
            $scope.editPostFormShown = false;
            $scope.editPostFormPostId = null;
        }

        function editPost(postId, postContent) {
            $scope.posts.forEach(function (post) {
                if(post.id == postId && $scope.user.username == post.author.username) {
                    postData.editPost(postId, postContent)
                        .$promise
                        .then(function (data) {
                            $scope.editPostFormShown = false;
                            $scope.editPostFormPostId = null;
                            post.postContent = data.content;
                            toaster.pop('error', 'Success!', 'Post edited successfully!');
                        }, function (error) {
                            toaster.pop('error', 'Error!', error.data.message);
                        });
                }
            });
        }

        function unlikePost(postId) {
            $scope.posts.forEach(function (post) {
                if(post.id == postId) {
                    if(post.author.isFriend || post.wallOwner.isFriend || $scope.user.username == post.author.username) {
                        postData.unlikePost(postId)
                            .$promise
                            .then(function (data) {
                                post.liked = false;
                                post.likesCount--;
                            }, function (error) {
                                toaster.pop('error', 'Error!', error.data.message);
                            });
                    } else {
                        toaster.pop('error', 'Error!', 'You can`t unlike this post!');
                    }
                }
            });
        }

        function likePost(postId) {
            $scope.posts.forEach(function (post) {
                if(post.id == postId) {
                    if(post.author.isFriend || post.wallOwner.isFriend || $scope.user.username == post.author.username) {
                        postData.likePost(postId)
                            .$promise
                            .then(function (data) {
                                post.liked = true;
                                post.likesCount++;
                            }, function (error) {
                                toaster.pop('error', 'Error!', error.data.message);
                            });
                    } else {
                        toaster.pop('error', 'Error!', 'You can`t like this post!');
                    }
                }
            });
        }

        function showAllComments(postId) {
            $scope.postAllComments = {
                postId: postId
            };
            postData.getPostComments(postId)
                .$promise
                .then(function (data) {
                    $scope.posts.forEach(function (post) {
                        if(post.id == postId) {
                            post.comments = data;
                        }
                    });
                    //$scope.postAllComments.comments = data;
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
                                toaster.pop('success', 'Success!', 'Comment successfully added.');
                            }, function (error) {
                                toaster.pop('error', 'Error!', error.data.message);
                            });
                    } else {
                        toaster.pop(
                            'error',
                            'Error!',
                            'You can`t comment on posts when neither the author, nor wall owner is a friend.');
                    }
                }
            });
        }

        function unlikeComment(postId, commentId) {
            $scope.posts.forEach(function (post) {
                if(post.id == postId) {
                    post.comments.forEach(function (comment) {
                        if(comment.id == commentId) {
                            if(post.author.isFriend || post.wallOwner.isFriend || $scope.user.username == post.author.username) {
                                commentData.unlikeComment(postId, commentId)
                                    .$promise
                                    .then(function (data) {
                                        comment.liked = false;
                                        comment.likesCount--;
                                    }, function (error) {
                                        toaster.pop('error', 'Error!', error.data.message);
                                    });
                            } else {
                                toaster.pop('error', 'Error!', 'You can`t unlike this comment!');
                            }
                        }
                    });
                }
            });
        }

        function likeComment(postId, commentId) {
            $scope.posts.forEach(function (post) {
                if(post.id == postId) {
                    post.comments.forEach(function (comment) {
                        if(comment.id == commentId) {
                            if(post.author.isFriend || post.wallOwner.isFriend || $scope.user.username == post.author.username) {
                                commentData.likeComment(postId, commentId)
                                    .$promise
                                    .then(function (data) {
                                        comment.liked = true;
                                        comment.likesCount++;
                                    }, function (error) {
                                        toaster.pop('error', 'Error!', error.data.message);
                                    });
                            } else {
                                toaster.pop('error', 'Error!', 'You can`t like this comment!');
                            }
                        }
                    });
                }
            });
        }

        function deleteComment(postId, commentId) {
            $scope.posts.forEach(function (post) {
                if(post.id == postId) {
                    post.comments.forEach(function (comment, index, object) {
                        if(comment.id == commentId) {
                            if ($scope.user.username == comment.author.username || $scope.user.username == post.author.username) {
                                commentData.deleteComment(postId, commentId)
                                    .$promise
                                    .then(function (data) {
                                        post.totalCommentsCount--;
                                        toaster.pop('error', 'Success!', 'Comment deleted successfully.');
                                        object.splice(index, 1);
                                    }, function (error) {
                                        toaster.pop('error', 'Error!', error.data.message);
                                    });
                            }
                        }
                    });
                }
            })
        }

        function showEditCommentForm(commentId) {
            $scope.editCommentFormShown = true;
            $scope.editCommentFormCommentId = commentId;
        }

        function closeEditCommentForm(){
            $scope.editCommentFormShown = false;
            $scope.editCommentFormCommentId = null;
        }

        function editComment(postId, commentId, commentContent) {
            $scope.posts.forEach(function (post) {
                if(post.id == postId) {
                    post.comments.forEach(function (comment) {
                        if(comment.id == commentId && $scope.user.username == comment.author.username) {
                            commentData.editComment(commentContent, postId, commentId)
                                .$promise
                                .then(function (data) {
                                    $scope.editCommentFormShown = false;
                                    $scope.editCommentFormCommentId = null;
                                    comment.commentContent = data.commentContent;
                                    toaster.pop('error', 'Success!', 'Comment edited successfully!');
                                }, function (error) {
                                    toaster.pop('error', 'Error!', error.data.message);
                                });
                        }
                    })
                }
            });
        }

        function sendFriendRequest(username, userType) {
            if(userType == 'wallOwner') {
                friendsData.sendFriendRequest(username)
                    .$promise
                    .then(function (data) {
                        $scope.userData.hasPendingRequest = true;
                        $scope.buttonName = 'Pending request';
                        $scope.disabledButton = 'disabled';
                        toaster.pop('success', 'Success!', data.message);
                    }, function (error) {
                        toaster.pop('error', 'Error!', error.data.message);
                    });
            } else if(userType == 'postAuthor' || userType == 'commentAuthor') {
                friendsData.sendFriendRequest(username)
                    .$promise
                    .then(function (data) {
                        $scope.userFriendStatus = 'Pending';
                        $scope.userHoverButtonType = 'disabled';
                        toaster.pop('success', 'Success!', data.message);
                    }, function (error) {
                        toaster.pop('error', 'Error!', error.data.message);
                    });
            }
        }

        function showUserPreview(username) {
            $scope.userFriendStatus = 'Getting status...';
            $scope.userHoverButtonType = 'disabled';

            userData.getUserPreviewData(username)
                .$promise
                .then(function (data) {
                    if(data.username == $scope.user.username) {
                        $scope.userFriendStatus = 'Me';
                        $scope.userHoverButtonType = 'disabled';
                    } else if(data.isFriend) {
                        $scope.userFriendStatus = 'Friend';
                        $scope.userHoverButtonType = 'disabled';
                    } else if(!data.isFriend && data.hasPendingRequest) {
                        $scope.userFriendStatus = 'Pending';
                        $scope.userHoverButtonType = 'disabled';
                    } else if(!data.isFriend && !data.hasPendingRequest) {
                        $scope.userFriendStatus = 'Invite';
                        $scope.userHoverButtonType = 'enabled';
                    }
                }, function (error) {
                    toaster.pop('error', 'Error!', error.data.message);
                });

            return true;
        }
    }]);

