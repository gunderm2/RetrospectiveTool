myApp.directive('retrospectiveDirective', function () {
    return {
        restrict: 'AE',
        transclude: true,
        template: '<div ng-transclude>YOU SHOULS NEVER SEE THIS!</div>',
        controller: function ($scope, $interval, $http, $routeParams, app_constants, sessionUtils, messagesService) {
            $scope.sessionId = $routeParams.sessionId;
            var intervalValue = 10000;
            //set interval that updates the view model
            var myInterval = $interval(updateView, intervalValue);
            $scope.updateMessage = false;
            $scope.messages = {
                'kudos': [],
                'wentWell': [],
                'notWell': []
            };

            this.save = function () {
                JSONToCSVConverter($scope.messages, "Retrospective " + new Date(), true);
            }
            
            this.edit = function (index, type) {
                if ($scope.updateMessage) {
                    $scope.updateMessage = false;
                } else {
                    $scope.updateMessage = true;
                }
                syncActionsToModel('edit', index, type);
            };

            this.showTxtArea = function (index, type) {
                syncActionsToModel('updateMessage', index, type);
            };

            this.addLike = function (index, type) {
                $interval.cancel(myInterval);
                $scope.messages[type][index].likes = parseInt($scope.messages[type][index].likes) + 1;
                updateMessage(index, type);
                myInterval = $interval(updateView, intervalValue);
            };


            this.updateMsg = function (index, type) {
                $interval.cancel(myInterval);
                this.showTxtArea(index, type);
                this.edit(index, type);
                this.updateMessage = false;
                updateMessage(index, type);
                myInterval = $interval(updateView, intervalValue);
            };

            this.createMessage = function (messageObject) {
                messageObject.sessionId = $scope.sessionId;
                $interval.cancel(myInterval);
                messagesService.messageCreate(messageObject).success(function (response) {
                        //if (response.length !== 0) { //when no data has changed 304 is returned []
                        $scope.messages = sortAndCopyData(response);
                        myInterval = $interval(updateView, intervalValue);
                        // }
                    })
                    .error(function (response) {
                        console.log('Error: ' + response);
                        myInterval = $interval(updateView, intervalValue);
                    });
            }

            initViewData(); // when landing on the page, get all messages and show them

            // delete a message after checking it
            this.deleteMessage = function (index, type) {
                $interval.cancel(myInterval);
                messagesService.messageDelete($scope.messages[type][index]._id).success(function (response) {
                    console.log('delete response :', response);
                        $scope.messages = {};
                        $scope.messages = sortAndCopyData(response);

                        myInterval = $interval(updateView, intervalValue);
                }).error(function (response) {
                    console.log('Error: ' + response);
                    myInterval = $interval(updateView, intervalValue);
                });
                this.edit(index, type);
            };

            function sortAndCopyData(responseData) {
                var mutableObject = {
                    'kudos': [],
                    'wentWell': [],
                    'notWell': []
                };

                for (var i = 0; i < responseData.length; i++) {
                    mutableObject[responseData[i].type].push(responseData[i]);
                }
                return mutableObject;
            }

            function initViewData() {
                console.log('initViewData :');
                messagesService.messagesRetrieve($scope.sessionId).success(function (response) {
                        $scope.messages = {};
                        $scope.messages = sortAndCopyData(response);
                        console.log('response :', response);
                    })
                    .error(function (response) {
                        console.log('Error: ' + response);
                    });
            }

            function getBackendData() {
                messagesService.messagesRetrieve($scope.sessionId).success(function (response) {
                        console.log('responseData :', response);
                        if (response.length !== 0) { //when no data has changed 304 is returned []
                            $scope.messages = {};
                            $scope.messages = sortAndCopyData(response);
                        }
                    })
                    .error(function (response) {
                        console.log('Error: ' + response);
                    });
            }

            // when submitting the add form, send the text to the node API
            function updateMessage(index, type) {
                $interval.cancel(myInterval);
                messagesService.messageUpdate($scope.messages[type][index]._id, $scope.messages[type][index])
                    .success(function (response) {
                        console.log(response);
                        //if (response.length !== 0) { //when no data has changed 304 is returned []
                        $scope.messages = {};
                        $scope.messages = sortAndCopyData(response);
                        myInterval = $interval(updateView, intervalValue);
                        //}
                    })
                    .error(function (response) {
                        console.log('Error: ' + response);
                    });
            };


            function syncActionsToModel(action, index, type) {
                if (!$scope.messages[type][index].hasOwnProperty(action)) {
                    $scope.messages[type][index][action] = true;
                } else if ($scope.messages[type][index][action]) {
                    $scope.messages[type][index][action] = false;
                } else {
                    $scope.messages[type][index][action] = true;
                }
            }

            function updateView() {
                if ($scope.sessionId && !$scope.updateMessage) {
                    getBackendData();
                }
            }

            function JSONToCSVConverter(JSONData, reportTitle, showLabel) {
                //TODO get this working;
                console.log(JSONData);
                var CSV = '';
                var propsInJSONObject = Object.getOwnPropertyNames(JSONData).sort();
                //Set Report title in first row or line
                CSV += reportTitle + '\r\n\n';

                //This condition will generate the Label/Header
                if (showLabel) {
                    var arow = "";
                    //This loop will extract the label from 1st index of on array
                    for (var key in JSONData) {
                        //Now convert each value to string and comma-seprated
                        arow += key + ',';
                    }
                    arow = arow.slice(0, -1);
                    //append Label row with line break
                    CSV += arow + '\r\n';
                }

                var longestArrayLength = 0;
                for (var props in JSONData) {
                    if (longestArrayLength < JSONData[props].length) {
                        longestArrayLength = JSONData[props].length;
                    }
                }

                //console.log('longestArrayLength :', longestArrayLength);
                //1st loop is to extract each row
                var row = "";
                for (var t = 0; t < longestArrayLength; t++) {
                    //console.log('main loop', t);
                    for (var prop in JSONData) {
                        //console.log('prop loop');
                        //console.log("JSONData." + prop + " = " + JSONData[prop]);
                        //console.log('length :', JSONData[prop].length);
                        //console.log('has own prop :', JSONData[prop][t] !== undefined && JSONData[prop][t].hasOwnProperty('message'));
                        //for (var x = 0; x < 1; x++) {
                        if (JSONData[prop][t] !== undefined) {
                            if (JSONData[prop][t].hasOwnProperty('text')) {
                                if (JSONData[prop][t].hasOwnProperty('likes')) {
                                    row += '"' + JSONData[prop][t].text + " +" + JSONData[prop][t].likes + '",';
                                    //console.log('row on the go ', row);
                                } else {
                                    row += '"' + JSONData[prop][t].text + '",';
                                }
                            }
                        }
                        //}
                    }
                    if (row !== "") {
                        //console.log('before :', row);
                        // row.slice(0, row.length - 1);
                        row = row.slice(0, -1);
                        //console.log('after :', row);
                        //add a line break after each row
                        CSV += row + '\r\n';
                        //console.log('final :', row);
                    }
                    row = "";
                }
                console.log('Everything :', CSV);

                if (CSV === '') {
                    alert("Invalid data");
                    return;
                }
                //console.log(CSV);
                //Generate a file name
                var fileName = "MyReport_";
                //this will remove the blank-spaces from the title and replace it with an underscore
                fileName += reportTitle.replace(/ /g, "_");

                //Initialize file format you want csv or xls
                var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

                // Now the little tricky part.
                // you can use either>> window.open(uri);
                // but this will not work in some browsers
                // or you will not get the correct file extension    

                //this trick will generate a temp <a /> tag
                var link = document.createElement("a");
                link.href = uri;

                //set the visibility hidden so it will not effect on your web-layout
                link.style = "visibility:hidden";
                link.download = fileName + ".csv";

                //this part will append the anchor tag and remove it after automatic click
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    };
});