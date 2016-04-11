angular.module('phonebook')
    .directive('groupViewListItem', [ function() {
        return {
            restrict: 'E',
            scope: {
                item: '=ngModel',
                groupCtrl: '=ngCtrl'
            },
            templateUrl: './javascripts/directives/groupListItem.html',
            link: function (scope, element ) {

                /*
                //var inpt = element.find("input");
                //setHandlers(inpt);

                function handleNewData(event) {
                    console.log("new group item blur: ", event);
                    var inpt = event.currentTarget;
                    if (inpt.value.length < 1) {
                        scope.item.remove();
                    }
                    else {
                        scope.item.isNew = false;
                        scope.item.name = inpt.value;
                        scope.groupCtrl.saveNewItem(scope.item);
                        setHandlers($(inpt));
                    }
                    scope.$apply();
                }

                function setHandlers(target) {

                    target.unbind();

                    if (scope.item.isNew) {
                        target.bind('blur' , handleNewData);
                        target.bind('keypress' , function (event) {

                            if (event.which === 13) {
                                console.log("keypress: " , event, scope);
                                handleNewData(event)
                            }
                        });
                    }
                    else {
                        target.bind('click' , function(event) {
                            console.log('group list item click ', event, scope.item);
                            scope.groupCtrl.setData(scope.item);
                            scope.$apply();
                        });
                    }
                }

                */
            }
        }
    }]);