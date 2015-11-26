(function () {
    'use strict'

    myApp.factory('messagesService', messagesService);

    messagesService.$inject = ['$http'];

    function messagesService($http) {
        'use strict';

        // public API
        return {
            messageCreate: messageCreate,
            messageUpdate: messageUpdate,
            messageDelete: messageDelete,
            messagesRetrieve: messagesRetrieve
        };

        function messageCreate(messageObject) {
            return $http.post('/api/messages', messageObject);
        }

        function messageUpdate(id, messageObject) {
            return $http.put('/api/messages/' + id, messageObject);
        }

        function messageDelete(id) {
            return $http.delete('/api/messages/' + id);
        }

        function messagesRetrieve(sessionId) {
            return $http.get('/api/messages/' + sessionId);
        }
    }
})();