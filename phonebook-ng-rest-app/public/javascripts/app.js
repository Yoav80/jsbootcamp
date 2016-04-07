(function () {

    'use strict';
    //var ng_app = angular.module('phonebook' , ['ngAnimate']);
    var ng_app = angular.module('phonebook' , []);

    angular.module('phonebook')
        .directive('myAutoFocus', ['$timeout', function($timeout) {
            return {
                restrict: 'A',
                link : function($scope, $element, $parentCtrl) {

                    $timeout(function () {
                        if ($element[0].value.length < 1) {
                            $element.attr("ng-readonly",false);
                            $scope.ngClick = null;
                            $element[0].focus();
                        }
                    });
                }
            }
        }]);
})();
