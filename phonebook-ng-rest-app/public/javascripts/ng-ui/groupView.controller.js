'use strict';

var app = app || {};
var ng_app = angular.module('phonebook');


ng_app.controller("groupViewController", function($scope , $rootScope, phoneBookItems) {

    var SEARCH_RESULTS_TITLE = "Search results";

    var vm = this;

    vm.isBackDisabled = true;
    vm.isTitleDisabled = true;
    vm.isAddingDisabled = false;
    vm.noItems = false;

    $scope.$on('displayGroups' , function(e , item) {
        console.log("group ctrl displayGroups: " , item, e);
        vm.setData(item);
    });

    $scope.$on('displaySearch' , function(e , results) {
        console.log("group view controller on search: " ,e, results);

        var parent = vm.dataSet.name == SEARCH_RESULTS_TITLE ? vm.dataSet.parent : vm.dataSet;
        var searchDataSet = {
            items: results.length ? results : [{name:"no results.." , noIcon:true}],
            name: SEARCH_RESULTS_TITLE,
            isSearch: true,
            parent: parent
        };
        vm.setData(searchDataSet);
    });

    vm.deleteItem = function (item) {
        console.log("groupViewController - delete item: ", item);
        //TODO confirm modal

        app.DomHelpers.setModal("DELETE",
                "Are you sure you want to delete " + item.name + " ?")
            .then(function () {
                item.remove();
                if (vm.dataSet.items.length == 0) {
                    vm.noItems = true;
                }
                $scope.$apply();
            })
            .fail(function() {
                console.log('cancel DELETE');
            });
        // delete item
        // save
    };

    vm.back = function() {
        if (vm.original.parent) {
            this.setData(vm.original.parent);
        }
    };

    vm.setData = function (data) {
        //console.log("groupViewController set data: ", data);
        if (data.items) {
            vm.dataSet = angular.copy(data);
            vm.original = data;
            vm.noItems = (data.items.length == 0);
            vm.isBackDisabled = vm.isTitleDisabled = data.parent == null;
            vm.isAddingDisabled = data.name == SEARCH_RESULTS_TITLE;
        }
        else {
            $rootScope.$broadcast('displayContact', data);
        }
    };

    vm.addItem = function (type) {

        var args = {};
        vm.newGroupName = "";

        if (type == 'contact') {
            args.parent = vm.original;
            var newContact = new app.Contact(args);
            $rootScope.$broadcast('displayContact', newContact, true);
        }
        else if (type == 'group') {
            args.parent = vm.dataSet;
            var newGroup = new app.Group(args);
            newGroup.isNew = true;
            vm.noItems = false;
            vm.dataSet.items.push(newGroup);
        }
    };

    vm.titleBlur = function (event) {
        console.log("group ctrl title blur: " , event);
        vm.updateCurrentGroup();
    };

    vm.updateCurrentGroup = function () {
        console.log("checking for updates..");
        var changed = false;

        if (vm.dataSet.name != vm.original.name && vm.dataSet.name.length > 0) {
            changed = true;
        }
        else if (vm.dataSet.items.length != vm.original.items.length){
            changed = true;
        }
        else {
            for (var i=0; i<vm.dataSet.items.length; i++) {
                if(vm.dataSet.items[i] != vm.original.items[i]){
                    changed = true;
                }
            }
        }

        if (changed) {
            console.log("found changes, updating....");
            vm.original.name = vm.dataSet.name;
            //vm.original.items = vm.dataSet.items;

            //TODO update group
        }

    };

    vm.saveNewItem = function (event , item)   {


        if (vm.newGroupName.length < 1 ) {
            vm.newGroupName = event.target.placeholder;
        }

        var newGroup = new app.Group({name:vm.newGroupName});
        vm.original.addItem(newGroup);
        vm.setData(vm.original);

        console.log("save item: " , newGroup);
        //TODO create new group
    };

    //vm.setData(phoneBookItems.root());
    var dataP = phoneBookItems.root();
    dataP.then(function (data) {
        vm.setData(data);
    });

});
