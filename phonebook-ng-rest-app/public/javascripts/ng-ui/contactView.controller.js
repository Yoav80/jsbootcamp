'use strict';

var ng_app = angular.module('phonebook');

ng_app.controller("contactViewController", function($scope , $rootScope, $timeout) {

    var vm = this;
    vm.dataSet = {};
    vm.isNew = false;
    vm.markedForDelete = false;

    $scope.$on('displayContact' , function(e , item, isNew) {
        $timeout(vm.setData(item, isNew) , 500);
    });

    vm.deleteItem = function() {
        vm.markedForDelete = true;
        vm.back();
    };

    vm.titleBlur = function (event) {
        if (vm.dataSet.phoneNumbers.length == 0) {
            vm.addPhone();
        }

        vm.checkIfUpdateNeeded();
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
                    vm.dataSet = null;
                    $rootScope.$broadcast('displayGroups', vm.original.parent);
                })
        }
        else {
            vm.checkIfUpdateNeeded();

            vm.dataSet = null;
            $rootScope.$broadcast('displayGroups', vm.original.parent);
        }
    };

    vm.checkIfUpdateNeeded = function () {
        console.log("checking for updates..");
        var changed = false;

        if (vm.dataSet.name != vm.original.name && vm.dataSet.name.length > 0) {
            changed = true;
        }

        else if (vm.dataSet.phoneNumbers.length != vm.original.phoneNumbers.length){
            changed = true;
        }

        if (changed) {

            if (vm.original.parent.items.indexOf(vm.original) == -1){
                // TODO -  check if id??
                vm.original.parent.addItem(vm.original);
                vm.isNew = false;

                //TODO create contact
                console.log("creating new contact......")
            }
            else {
                console.log("updateing......")
                //TODO update contact
                vm.original.name = vm.dataSet.name;
                var nameArr = vm.dataSet.name.split(" ");
                vm.original.firstName = nameArr.shift();
                vm.original.lastName = nameArr.join(" ");
                vm.original.phoneNumbers = vm.dataSet.phoneNumbers;
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