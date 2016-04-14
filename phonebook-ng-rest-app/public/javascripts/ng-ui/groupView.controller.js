
var app = app || {};

/**
 * The group list view angular controller.
 * builds list items by groups in the root object
 */

(function () {
    'use strict';
    var ng_app = angular.module('phonebook');

    ng_app.constant('SEARCH_RESULTS_TITLE', 'Search results');
    ng_app.controller("groupViewController", function($scope , $rootScope, phoneBookData, SEARCH_RESULTS_TITLE) {

        var vm = this;

        vm.isBackDisabled = true;
        vm.isTitleDisabled = true;
        vm.isAddingDisabled = false;
        vm.noItems = false;

        /**
         * an event to display a group
         */
        $scope.$on('displayGroups' , function(e , item) {
            console.log("group ctrl displayGroups: " , item, e);
            vm.setData(item);
        });

        /**
         * an event to display search results
         */
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

        /**
         * an event telling the view to fetch the root object
         * after reset
         */
        $scope.$on('resetData' , function (e) {
           vm.setData(phoneBookData.getRoot());
        });

        vm.deleteItem = function (item) {

            app.DomHelpers.setModal("DELETE","Are you sure you want to delete " + item.name + " ?")
                .then(function () {
                    console.log("deleting item " , item);

                    item.remove();

                    var deleted = phoneBookData.destroy(item);
                    deleted.then(function (res) {
                        console.log("item " + item.name + " deleted successfully " , res);
                    });

                    if (vm.dataSet.name == SEARCH_RESULTS_TITLE) {

                        var items = vm.dataSet.items;

                        var res = item.getItemById(vm.dataSet.parent.id);
                        if (res) {
                            vm.dataSet.parent = item.parent;
                        }

                        for (var i=0; i<items.length; i++){
                            if (items[i].id == item.id){
                                items.splice(i , 1);
                                i--;
                            }
                            else if (item.getItemById(items[i].id)) {
                                items.splice(i , 1);
                                i--;
                            }
                        }
                    }

                    vm.noItems = (vm.dataSet.items.length == 0);
                })
                .fail(function() {
                    console.log('cancel DELETE');
                });
        };

        vm.back = function() {
            if (vm.dataSet.parent) {
                this.setData(vm.dataSet.parent);
            }
        };

        vm.setData = function (data) {

            if (data.items) {

                vm.dataSet = data;
                vm.title = data.name;

                vm.noItems = (data.items.length == 0);
                vm.isBackDisabled = vm.isTitleDisabled = data.parent == null;
                vm.isAddingDisabled = data.name == SEARCH_RESULTS_TITLE;
            }
            else {
                var item = vm.dataSet.getItemById(data.id);
                $rootScope.$broadcast('displayContact', item);
            }
        };

        vm.addItem = function (type) {

            var args = {};

            if (type == 'contact') {
                args.parent = vm.dataSet;
                var newContact = new app.Contact(args);
                $rootScope.$broadcast('displayContact', newContact, true);
            }
            else if (type == 'group') {
                args.parent = vm.dataSet;
                var newGroup = new app.Group(args);
                newGroup.isNew = true;

                vm.newGroup = newGroup;
                vm.newGroupName = "";
                vm.noItems = false;
                vm.dataSet.items.push(newGroup);
            }
        };

        vm.titleBlur = function (event) {
            vm.updateCurrentGroup();
        };

        vm.updateCurrentGroup = function () {
            console.log("checking for updates.." , vm.dataSet.name , vm.title );
            var changed = false;

            if (vm.dataSet.name != vm.title && vm.title.length > 0) {
                changed = true;
            }

            if (changed) {
                console.log("found changes, updating....");
                vm.dataSet.name = vm.title;

                //update group
                var updated = phoneBookData.update(vm.dataSet);
                updated.then(function (res) {
                    console.log("updated success " , res);
                });
            }
        };

        vm.saveNewItem = function (event , item)   {

            if (!vm.newGroupName || vm.newGroupName.length < 1 ) {
                vm.newGroupName = event.target.placeholder;
            }

            vm.newGroup.name = vm.newGroupName;
            vm.newGroup.isNew = false;
            //vm.setData(vm.original);

            //create new group
            var created = phoneBookData.create(vm.newGroup);
            created.then(function (res) {
                console.log("saved item: " , vm.newGroup, res, event);
            });
        };

        var dataP = phoneBookData.getRoot();
        dataP.then(function (data) {
            vm.setData(data);
        });

    });
})();