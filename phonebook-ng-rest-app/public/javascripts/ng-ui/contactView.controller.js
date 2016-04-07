'use strict';

var ng_app = angular.module('phonebook');

ng_app.controller("contactViewController", function($scope , $rootScope, $timeout) {

    var vm = this;
    vm.dataSet = {};

    $scope.$on('displayContact' , function(e , item, isNew) {
        $timeout(vm.setData(item, isNew) , 500);
    });

    vm.deleteItem = function() {
        vm.markedForDelete = true;
        vm.back();
    };

    vm.addPhone = function() {
        vm.dataSet.phoneNumbers.push("");
    };

    vm.setData = function(data , isNew) {
        vm.isNew = isNew;
        vm.markedForDelete = false;
        vm.original = data;
        vm.dataSet = angular.copy(data);
    };

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
                vm.original.name = vm.dataSet.name;
                var nameArr = vm.dataSet.name.split(" ");
                vm.original.firstName = nameArr.shift();
                vm.original.lastName = nameArr.join(" ");
                vm.original.phoneNumbers = vm.dataSet.phoneNumbers;
                vm.original.parent.addItem(vm.original);
                vm.isNew = false;
                vm.dataSet = null;
                //TODO save new contact

                $rootScope.$broadcast('displayGroups', vm.original.parent);
            }
        }
        else if (vm.markedForDelete) {
            app.DomHelpers.setModal("Delete Contact ", "Are you sure you want to delete " + vm.dataSet.name + "?")
                .then(function () {
                    //remove contact
                    vm.original.remove();
                    vm.dataSet = null;
                    $rootScope.$broadcast('displayGroups', vm.original.parent);
                })
        }
        else {
            var changed = false;

            if (vm.dataSet.name != vm.original.name && vm.dataSet.name.length > 0) {
                changed = true;

                vm.original.name = vm.dataSet.name;
                var nameArr = vm.dataSet.name.split(" ");
                vm.original.firstName = nameArr.shift();
                vm.original.lastName = nameArr.join(" ");
            }

            if (vm.dataSet.phoneNumbers.length != vm.original.phoneNumbers.length){
                changed = true;
                vm.original.phoneNumbers = vm.dataSet.phoneNumbers;
            }

            else {
                for (var i=0; i<vm.dataSet.phoneNumbers.length; i++) {
                    if(vm.dataSet.phoneNumbers[i] != vm.original.phoneNumbers[i]){
                        vm.original.phoneNumbers[i] = vm.dataSet.phoneNumbers[i];
                        changed = true;
                    }
                }
            }

            if (changed) {

                //TODO update contact
            }

            vm.dataSet = null;
            $rootScope.$broadcast('displayGroups', vm.original.parent);
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