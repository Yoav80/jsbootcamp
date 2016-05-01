/// <reference path="./../../typings/tsd.d.ts"/>
"use strict";
var appModule_1 = require("./../../appModule");
require("./listViewItem");
require("../../services/phoneBookService");
var Group_1 = require("../../dataClasses/Group");
var SEARCH_RESULTS_TITLE = "search results";
var GROUP_PATH = "/group";
var CONTACT_PATH = "/contact";
var NEW_CONTACT_PATH = "/new-contact";
var ListViewComponent = (function () {
    function ListViewComponent(phoneBookService, $route, $location) {
        this.phoneBookService = phoneBookService;
        this.dataSet = null;
        this.isBackDisabled = true;
        this.isTitleDisabled = true;
        this.isAddingDisabled = false;
        this.isSearch = false;
        this.newGroup = null;
        this.newGroupName = null;
        this.location = $location;
        this.searchTitle = SEARCH_RESULTS_TITLE;
        console.log("ListViewComponent ctor : ", $route.current.locals.groupData);
        this.setData($route.current.locals.groupData);
    }
    ListViewComponent.prototype.$postLink = function () {
        //console.log("ListViewComponent $postLink ");
        initMdlSpeedDial();
    };
    ;
    ListViewComponent.prototype.setData = function (data) {
        if (data instanceof Group_1.Group) {
            this.dataSet = data;
            this.title = data.name;
            this.noItems = (data.items.length == 0);
            this.isBackDisabled = this.isTitleDisabled = data.parent == null;
            this.isAddingDisabled = data.name == SEARCH_RESULTS_TITLE;
        }
        else if (data.isSearch == true) {
            this.dataSet = data;
            this.title = SEARCH_RESULTS_TITLE;
            this.noItems = (data.items.length == 0);
            this.isBackDisabled = false;
            this.isAddingDisabled = this.isSearch = true;
        }
    };
    ;
    ListViewComponent.prototype.navigate = function (item) {
        var path = item instanceof Group_1.Group ? GROUP_PATH + "/" + item.id : CONTACT_PATH + "/" + item.id;
        console.log("navigate ", item, path);
        this.location.path(path);
    };
    ListViewComponent.prototype.back = function () {
        console.log("back:: ", this.dataSet.parent);
        if (this.dataSet.parent != null) {
            this.location.path(GROUP_PATH + "/" + this.dataSet.parent);
        }
    };
    ;
    ListViewComponent.prototype.deleteItem = function (item) {
        var _this = this;
        console.log("list view delete item: ", item);
        domHelpers.setModal("DELETE", "Are you sure you want to delete " + item.name + " ?")
            .then(function () {
            console.log("deleting item ", item);
            var deleted = _this.phoneBookService.deleteItem(item.id, item.parent);
            deleted.then(function (res) {
                console.log("item " + item.name + " deleted successfully ", res);
            });
            if (_this.isSearch) {
                if (item instanceof Group_1.Group) {
                    var res = item.getItemById(_this.dataSet.parent.id);
                    if (res) {
                        _this.dataSet.parent = item.parent;
                    }
                }
                var items = _this.dataSet.items;
                for (var i = 0; i < items.length; i++) {
                    if (items[i].id == item.id) {
                        items.splice(i, 1);
                        i--;
                    }
                    else if (item instanceof Group_1.Group && item.getItemById(items[i].id)) {
                        items.splice(i, 1);
                        i--;
                    }
                }
            }
            _this.noItems = (_this.dataSet.items.length == 0);
        })
            .fail(function () {
            console.log('cancel DELETE');
        });
    };
    ;
    ListViewComponent.prototype.addItem = function (type) {
        if (type == 'contact') {
            //var newContact = new Contact(null,null,this.dataSet);
            this.location.path(NEW_CONTACT_PATH + "/" + this.dataSet.id);
        }
        else if (type == 'group') {
            var newGroup = new Group_1.Group(null, null, this.dataSet.id, []);
            newGroup.isNew = true;
            this.newGroup = newGroup;
            this.newGroupName = "";
            this.noItems = false;
            this.dataSet.items.push(newGroup);
        }
    };
    ;
    ListViewComponent.prototype.titleBlur = function () {
        this.updateCurrentGroup();
    };
    ;
    ListViewComponent.prototype.updateCurrentGroup = function () {
        console.log("checking for updates..", this.dataSet.name, this.title);
        var changed = false;
        if (this.dataSet.name != this.title && this.title.length > 0) {
            changed = true;
        }
        if (changed) {
            console.log("found changes, updating....");
            this.dataSet.name = this.title;
            //update group
            this.phoneBookService.setRoot()
                .then(function (res) {
                console.log("update item: ", res, event);
            });
        }
    };
    ;
    ListViewComponent.prototype.saveNewItem = function (event, item) {
        if (!this.newGroupName || this.newGroupName.length < 1) {
            this.newGroupName = event.target.placeholder;
        }
        this.newGroup.name = this.newGroupName;
        this.newGroup.isNew = false;
        //create new group
        this.phoneBookService.setRoot()
            .then(function (res) {
            console.log("saved item: ", res, event);
        });
    };
    ;
    ListViewComponent.$inject = ["phoneBookService", "$route", "$location"];
    return ListViewComponent;
}());
exports.ListViewComponent = ListViewComponent;
appModule_1.appModule.component("listView", {
    controller: ListViewComponent,
    template: require("./listView.html!text"),
    styles: require("./listView.css!css"),
});
//# sourceMappingURL=listView.js.map