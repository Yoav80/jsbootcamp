import {appModule} from "./../appModule";

appModule.directive('ngEnter', [ function() {
    return {
        restrict: 'A',

        link: function (scope, element) {

            element.bind('keydown keypress', function (event) {
                if (event.which === 13) {
                    event.target.blur();
                    event.preventDefault();
                }
            });
            element.on(
                "$destroy",
                function handleDestroyEvent() {
                    element.unbind();
                    scope.$destroy();
                }
            );
        }
    }
}]);