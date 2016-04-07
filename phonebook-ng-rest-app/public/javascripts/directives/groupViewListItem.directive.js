angular.module('phonebook')
    .directive('groupViewListItem', [ function() {
        return {
            restrict: 'E',
            scope: {
                item: '=ngModel',
                groupCtrl: '=ngCtrl'
            },
            templateUrl: './javascripts/directives/groupListItem.html',
            link: function (scope, element, attributes, parentController) {
                if (scope.item.isNew) {
                    element.find("input").on(['blur' , 'keyup'], function (e) {
                        console.log("new group item blur: ", scope, parentController, e);
                        if (e.currentTarget.value.length < 1) {
                            scope.item.remove();
                        }
                        else {
                            scope.item.isNew = false;
                            //TODO save new group
                            scope.groupCtrl.saveItem(scope.item);
                        }
                    });

                }
            }
        }
    }]);