"use strict";
var appModule_1 = require("./../appModule");
appModule_1.appModule.directive('ngEnter', [function () {
        return {
            restrict: 'A',
            link: function (scope, element) {
                element.bind('keydown keypress', function (event) {
                    if (event.which === 13) {
                        event.target.blur();
                        event.preventDefault();
                    }
                });
                element.on("$destroy", function handleDestroyEvent() {
                    element.unbind();
                    scope.$destroy();
                });
            }
        };
    }]);
//# sourceMappingURL=ngEnter.js.map