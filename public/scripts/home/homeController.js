(function () {
    "use strict";

    // create the controller and inject Angular's $scope
    angular.module('startapp').controller('homeController', function ($scope, $rootScope, $location, app_constants, sessionUtils) {
        'use strict'
        $scope.oneAtATime = true;
        $scope.status = {
            isFirstOpen: true,
            isFirstDisabled: false
        };
        //var t = 60000; //milliseconds in a minute
        //var y = 60; //min in an hour
        //var m = 24; //hours in day
        var millisInDay = 60000 * 60 * 24;
        var sessionDate, millisTimeDif;
        $scope.today = new Date();
        if (sessionUtils.getSessionAttribute(app_constants.sessionStorageId)) {
            sessionDate = new Date(sessionUtils.getSessionAttribute(app_constants.sessionStorageId).date);
            millisTimeDif = calcTimeDiference($scope.today, sessionDate);
            if (millisTimeDif > millisInDay) {
                sessionUtils.removeSessionAttribute(app_constants.sessionStorageId);
                $location.path('/');
            } else {
                var sessionAttrs = sessionUtils.getSessionAttribute(app_constants.sessionStorageId);
                $scope.companyName = sessionAttrs.companyName;
                $scope.projectName = sessionAttrs.projectName;
                $scope.iterationName = sessionAttrs.iterationName;
            }
        }

        $scope.clearSession = function () {
            sessionUtils.removeSessionAttribute(app_constants.sessionStorageId);
        };

        $scope.notAuthorizedAlert = false;

        // create a message to display in our view
        $scope.shortMessage = 'A high quality retrospective tool that is fully anonymous!';
        $scope.sessionId = "";

        $scope.makeSessionId = function (compName, projName, iterName) {
            if (!$scope.sessionId) {
                $scope.sessionId = genSessionId(compName, projName, iterName);
                setSessionAttributes($scope.sessionId, $scope.today, compName, projName, iterName);
            }
        };

        $scope.clearForm = function () {
            $scope.companyName = "";
            $scope.projectName = "";
            $scope.iterationName = "";
            $scope.sessionId = "";
        };

        $scope.startSession = function (id) {
            if (id) {
                //make rest call here to get the company info from sessionId
                setSessionAttributes(id, $scope.today);//pass in company info here to set on session
                $rootScope.$broadcast('canRetrospect', true);
                $location.path('/retrospective/' + id);

            } else {
                $scope.notAuthorizedAlert = true;
            }

        };


        function calcTimeDiference(todaysDate, someDate) {
            var timeDif = 0;
            if (todaysDate.getTime() > someDate.getTime()) {
                timeDif = todaysDate.getTime() - someDate.getTime();
            }
            return timeDif;
        }

        function genSessionId() {
            var mutableString = "";
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] !== undefined && arguments[i].length > 4) {
                    var str = arguments[i].replace(/ +/g, "");
                    mutableString += str.toLowerCase().slice(0, 3);
                } else {
                    mutableString += Math.floor(Math.random(31) * 100);
                }
            }
            return mutableString + new Date().getTime().toString();
        }

        function setSessionAttributes(sessionId, todaysDate, companyName, projectName, iterationName) {
            if (typeof (Storage) !== "undefined") {
                // Code for localStorage/sessionStorage.
                sessionUtils.setSessionAttribute(app_constants.sessionStorageId, {
                    sessionId: sessionId,
                    date: todaysDate,
                    companyName: companyName,
                    projectName: projectName,
                    iterationName: iterationName
                });
            } else {
                // Sorry! No Web Storage support..
                //TODO set page level message or form message saying browser does not support storage
            }
        }
    });
})();