angular.module('phonebook')
    .directive('pbItemTitle', [ function() {
        return {
            restrict: 'A',
            scope: {
                Ctrl: '=ngCtrl'
            },
            link: function (scope, element) {

                element.on('blur' , handleData);

                element.on('keypress' , function (event) {
                    if (event.which === 13) {
                        event.target.blur();
                    }
                });

                function handleData(event) {
                    var val = event.currentTarget.value.trim();
                    if (val.length < 1) {
                        //TODO invalid title
                        console.log("invalid title");
                    }
                    else {
                        console.log("name title blur: ", event);
                        scope.Ctrl.titleBlur(event);
                    }
                }
            }
        }
    }]);