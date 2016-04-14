(function () {
    'use strict';
    angular.module('phonebook')
        .directive('ngEnter', [ function() {
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
                            console.log( "ngEnter destroy!!!");
                            element.unbind();
                            scope.$destroy();
                        }
                    );
                }
            }
        }]);
})();