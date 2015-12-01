angular.module('startapp').directive('createMessages', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        require: '^retrospectiveDirective',
        templateUrl: 'scripts/retrospective/dir/components/createMessages.html',
        link: function (scope, el, attrs, retrospectiveDirective) {
            scope.save = function () {
                retrospectiveDirective.save();
            };

            scope.createMessage = function (type, message) { 
                var mutableObject = {};
                mutableObject.text = message;
                mutableObject.type = type;
                mutableObject.likes = 0;
                console.log('scope.createMessage', mutableObject);
                retrospectiveDirective.createMessage(mutableObject);
                scope.message = ""; // clear the form so our user is ready to enter another
            };
        }
    };
});