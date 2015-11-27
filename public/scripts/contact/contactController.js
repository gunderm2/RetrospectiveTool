(function () {
    'use strict'
    myApp.controller('contactController', function ($scope, $http) {
        $scope.succssMessage = false;
        $scope.validationFailMessage = false;
        $scope.name = '';
        $scope.email = '';
        $scope.message = '';
        $scope.submitForm = function () {
            if ($scope.contactForm.$valid) {
                var messageObj = {
                    'name': $scope.name,
                    'email': $scope.email,
                    'message': $scope.message
                };
                var req = {
                    method: 'POST',
                    url: 'http://mikeinmotion.net/cgi-bin/contact_me.php',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: messageObj
                };

//                $http(req).success(function (data, status, headers, config) {
//                    $scope.successMessage = true;
//                    $scope.validationFailMessage = false;
//                }).error(function (data, status, headers, config) {
//                    console.log(status);
//                });
            } else {
                $scope.validationFailMessage = true;
            }
        }
    });
})();