/**
 * group view list item directive - template
 */
(function () {
    angular.module('phonebook')
        .directive('groupViewListItem', [ function() {
            return {
                restrict: 'E',
                scope: {
                    item: '=ngModel',
                    groupCtrl: '=ngCtrl'
                },
                templateUrl: './javascripts/ng-directives/groupListItem.html',
            }
        }]);
})();