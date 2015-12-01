angular.module('startapp').directive('teamView', function () {    
    return {
        restrict: 'E',
        replace: true,
        scope: {messages: '=viewModel', viewName: '@', viewKey: '@'},
        require: '^retrospectiveDirective',
        templateUrl: 'scripts/retrospective/dir/components/teamView.html',
        controller: function($scope) {
            var nDate = new Date();
            $scope.todaysDate = nDate.toDateString() + ' ' + nDate.toTimeString();
        },
        link: function (scope, el, attrs, retrospectiveDirective) {
            scope.remove = function(index, type) {
                retrospectiveDirective.deleteMessage(index, type);
            }
            scope.edit = function (index, type) {
                retrospectiveDirective.edit(index, type);
            };

            scope.showTxtArea = function (index, type) {
                retrospectiveDirective.showTxtArea(index, type);
            };

            scope.addLike = function (index, type) {
                retrospectiveDirective.addLike(index, type);
            };


            scope.updateMsg = function (index, type) {
                retrospectiveDirective.updateMsg(index, type);
            };
            
        }
    };
});