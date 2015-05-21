'use strict';

socialNetworkApp.factory('friendsData', ['$resource', 'baseUrl', 'credentials', function ($resource, baseUrl, credentials) {
    function getLoggedUserFriends() {
        var authorization = credentials.getAuthorization();
        return $resource(
            baseUrl + 'me/friends',
            null,
            {
                'get': {
                    method: 'GET',
                    isArray: true,
                    headers: {'Authorization': authorization}
                }
            })
            .get();
    }

    function getOtherUserFriends(username) {
        var authorization = credentials.getAuthorization();
        return $resource(
            baseUrl + 'users/' + username + '/friends/preview',
            null,
            {
                'get': {
                    method: 'GET',
                    headers: {'Authorization': authorization}
                }
            })
            .get();
    }

    function getFriendsPreview() {
        var authorization = credentials.getAuthorization();
        return $resource(
            baseUrl + 'me/friends/preview',
            null,
            {
                'get': {
                    method: 'GET',
                    headers: {'Authorization': authorization}
                }
            })
            .get();
    }

    function getFriendRequests() {
        var authorization = credentials.getAuthorization();
        return $resource(
            baseUrl + 'me/requests',
            null,
            {
                'get': {
                    method: 'GET',
                    isArray: true,
                    headers: {'Authorization': authorization}
                }
            })
            .get();
    }

    function sendFriendRequest(name) {
        var authorization = credentials.getAuthorization();
        return $resource(
            baseUrl + 'me/requests/' + name,
            null,
            {
                'save': {
                    method: 'POST',
                    headers: {'Authorization': authorization}
                }
            })
            .save();
    }

    function approveFriendRequest(requestId) {
        var authorization = credentials.getAuthorization();
        return $resource(
            baseUrl + 'me/requests/' + requestId + '?status=approved',
            null,
            {
                'update': {
                    method: 'PUT',
                    headers: {'Authorization': authorization}
                }
            })
            .update();
    }

    function rejectFriendRequest(requestId) {
        var authorization = credentials.getAuthorization();
        return $resource(
            baseUrl + 'me/requests/' + requestId + '?status=rejected',
            null,
            {
                'update': {
                    method: 'PUT',
                    headers: {'Authorization': authorization}
                }
            })
            .update();
    }

    return {
        getLoggedUserFriends: getLoggedUserFriends,
        getOtherUserFriends: getOtherUserFriends,
        getFriendsPreview: getFriendsPreview,
        getFriendRequests: getFriendRequests,
        sendFriendRequest: sendFriendRequest,
        approveFriendRequest: approveFriendRequest,
        rejectFriendRequest: rejectFriendRequest
    }
}]);
