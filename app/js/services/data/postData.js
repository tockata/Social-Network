'use strict';

socialNetworkApp.factory('postData', ['$resource', 'baseUrl', 'credentials', function ($resource, baseUrl, credentials) {
    //function getPosts() {
    //    var authorization = credentials.getAuthorization();
    //    return $resource(
    //        baseUrl + 'me/friends',
    //        null,
    //        {
    //            'get': {
    //                method: 'GET',
    //                isArray: true,
    //                headers: {'Authorization': authorization}
    //            }
    //        })
    //        .get();
    //}

    function addPost(post) {
        var authorization = credentials.getAuthorization();
        return $resource(
            baseUrl + 'posts',
            null,
            {
                'save': {
                    method: 'POST',
                    headers: {'Authorization': authorization}
                }
            })
            .save(post);
    }

    function editPost(postId, postContent) {
        var authorization = credentials.getAuthorization();
        return $resource(
            baseUrl + 'posts/' + postId,
            null,
            {
                'update': {
                    method: 'PUT',
                    headers: {'Authorization': authorization}
                }
            })
            .update(postContent);
    }

    return {
        addPost: addPost,
        editPost: editPost
    }
}]);

