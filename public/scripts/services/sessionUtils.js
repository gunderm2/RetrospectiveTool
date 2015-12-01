(function () {
    "use strict";

    angular.module('startapp').factory('sessionUtils', sessionUtils);

    sessionUtils.$inject = ['$location', '$window', '$q', '$rootScope', 'app_constants'];

    function sessionUtils($location, $window, $q, $rootScope, app_constants) {
        'use strict';

        // public API
        return {
            authCheck: authCheck,
            getSessionAttribute: getSessionAttribute,
            setSessionAttribute: setSessionAttribute,
            removeSessionAttribute: removeSessionAttribute,
            isSessionIdSet: isSessionIdSet
        };

        function authCheck() {
            var deferred = $q.defer();
            if (getSessionAttribute(app_constants.sessionId)) {
                deferred.resolve(true);
            } else {
                deferred.reject();
            }
            return deferred.promise;
        }

        function getSessionAttribute(key) {
            return JSON.parse($window.sessionStorage.getItem(key));
        }

        function setSessionAttribute(key, value) {
            return $window.sessionStorage.setItem(key, JSON.stringify(value));
        }

        function removeSessionAttribute(key) {
            return $window.sessionStorage.removeItem(key);
        }

        function isSessionIdSet(key) {
            return $window.sessionStorage.getItem(key) !== null;
        }
    }
})();
//myApp.factory('sessionUtils', function(){
//     
//    var fac = {};
//     
//    fac.users = ['John', 'James', 'Jake']; 
//     
//    return fac;
// 
//});