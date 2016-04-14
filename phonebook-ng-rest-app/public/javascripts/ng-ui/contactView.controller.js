
/**
 * The contact view angular controller.
 * displays a contact by the object received (an empty contact for new )
 */

(function () {
    'use strict';
    var ng_app = angular.module('phonebook');
    ng_app.controller("contactViewController", function($scope , $rootScope, $timeout, phoneBookData) {

        var vm = this;
        vm.dataSet = {};
        vm.isNew = false;
        vm.markedForDelete = false;

        $scope.$on('displayContact' , function(e , item, isNew) {
            $timeout(vm.setData(item, isNew) , 500);
        });

        /**
         * hack for catching the enter key
         * @param $event
         */
        vm.blurOnEnter = function( $event ) {
            if ( $event.which != 13 ) {
                return;
            }

            $timeout(function () {
                    $event.target.blur();
                }
                , 0, false);
        };

        vm.deleteItem = function() {
            vm.markedForDelete = true;
            vm.back();
        };

        vm.titleBlur = function () {
            vm.checkIfUpdateNeeded();
            if (vm.dataSet.phoneNumbers.length == 0) {
                vm.addPhone();
            }
        };

        vm.addPhone = function() {
            vm.dataSet.phoneNumbers.push("");
        };

        vm.setData = function(data , isNew) {
            vm.isNew = isNew;
            vm.markedForDelete = false;
            vm.dataSet = angular.copy(data);
            vm.original = data;
        };

        /**
         * goes back to last group after updating contact if needed
         */
        vm.back = function () {
            vm.clearEmptyPhone();

            if (vm.isNew){
                if (vm.dataSet.name.length < 1 || vm.markedForDelete){
                    app.DomHelpers.setModal("New Contact", "Contact will not be saved, continue anyway?")
                        .then(function () {
                            vm.isNew = false;
                            vm.markedForDelete = false;
                            $rootScope.$broadcast('displayGroups', vm.original.parent);
                            vm.dataSet = null;
                        }).fail(function () {
                            vm.markedForDelete = false;
                        });
                }

                else {
                    vm.checkIfUpdateNeeded();

                    vm.isNew = false;
                    vm.dataSet = null;

                    $rootScope.$broadcast('displayGroups', vm.original.parent);
                }
            }
            else if (vm.markedForDelete) {
                app.DomHelpers.setModal("Delete Contact ", "Are you sure you want to delete " + vm.dataSet.name + "?")
                    .then(function () {
                        //remove contact
                        vm.original.remove();
                        vm.dataSet.remove();
                        vm.dataSet = null;


                        var deleted = phoneBookData.destroy(vm.original);
                        deleted.then(function (res) {
                            console.log("contact deleted successfully " , res);
                        });
                        $rootScope.$broadcast('displayGroups', vm.original.parent);
                    })
            }
            else {
                vm.checkIfUpdateNeeded();

                vm.dataSet = null;
                $rootScope.$broadcast('displayGroups', vm.original.parent);
            }
        };

        /**
         * check if update/create needed and perform
         */
        vm.checkIfUpdateNeeded = function () {
            console.log("checking for updates..");
            vm.clearEmptyPhone();

            var changed = false;

            if (vm.dataSet.name != vm.original.name && vm.dataSet.name.length > 0) {
                changed = true;
            }
            else if (vm.dataSet.phoneNumbers.length != vm.original.phoneNumbers.length){
                changed = true;
            }
            else {
                var arr = vm.dataSet.phoneNumbers;
                for (var i=0; i<arr.length; i++) {
                    console.log("checking numbers: " , arr[i], vm.original.phoneNumbers[i] );
                    if (arr[i] != vm.original.phoneNumbers[i]) {
                        changed = true;
                    }
                }
            }

            if (changed) {
                if (vm.original.parent.items.indexOf(vm.original) == -1){

                    vm.original.parent.addItem(vm.original);
                    vm.isNew = false;

                    console.log("creating new contact......");
                    var created = phoneBookData.create(vm.original);
                    created.then(function (res) {
                        console.log("contact created successfully " , res);
                    });
                }
                else {
                    console.log("updateing......");
                    vm.original.name = vm.dataSet.name;
                    var nameArr = vm.dataSet.name.split(" ");
                    vm.original.firstName = nameArr.shift();
                    vm.original.lastName = nameArr.join(" ");
                    vm.original.phoneNumbers = vm.dataSet.phoneNumbers;
                    vm.setData(vm.original);

                    var updated = phoneBookData.update(vm.original);
                    updated.then(function (res) {
                        console.log("contact updated successfully " , res);
                    });
                }
            }

        };

        vm.clearEmptyPhone = function () {
            var phones = vm.dataSet.phoneNumbers;
            for (var i = 0; i < phones.length; i++) {
                if (phones[i] == "") {
                    phones.splice(i,1);
                    i--;
                }
            }
        };

    });
})();