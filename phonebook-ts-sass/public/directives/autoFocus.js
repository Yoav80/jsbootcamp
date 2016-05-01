"use strict";
var appModule_1 = require("./../appModule");
appModule_1.appModule.directive('myAutoFocus', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            link: function ($scope, $element) {
                $timeout(function () {
                    if ($element[0].value.length < 1) {
                        $element[0].focus();
                    }
                }, 100);
            }
        };
    }]);
//# sourceMappingURL=autoFocus.js.map