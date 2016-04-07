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
    vm.dataSet = phoneBookItems.root();
    vm.parent = null;

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
        if (this.dataSet.parent) {
            this.setData(this.dataSet.parent);
        }
    };

    vm.setData = function (data) {
        //console.log("groupViewController set data: ", data);
        if (data.items) {
            vm.dataSet = data;
            vm.noItems = data.items.length == 0;
            vm.isBackDisabled = vm.isTitleDisabled = data.parent == null;
            vm.isAddingDisabled = data.name == SEARCH_RESULTS_TITLE;
        }
        else {
            $rootScope.$broadcast('displayContact', data);
        }
    };

    vm.addItem = function (type) {

        var args = {};
        args.parent = this.dataSet;

        if (type == 'contact') {
            var newContact = new app.Contact(args);
            $rootScope.$broadcast('displayContact', newContact, true);
        }
        else if (type == 'group') {
            args.items = [];
            var newGroup = new app.Group(args);
            newGroup.isNew = true;
            vm.dataSet.items.push(newGroup);
        }
    }

    vm.saveItem = function (item)   {
        console.log("save item");
        $scope.$apply();
    }
});
