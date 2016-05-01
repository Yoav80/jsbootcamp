/// <reference path="./../../typings/tsd.d.ts"/>
"use strict";
var appModule_1 = require("./../../appModule");
var BookItem_1 = require("../../dataClasses/BookItem");
var GROUP_PATH = "/group";
var ContactViewComponent = (function () {
    function ContactViewComponent(phoneBookService, $route, $location, $timeout, $scope) {
        this.phoneBookService = phoneBookService;
        this.isNew = false;
        this.markedForDelete = false;
        this.parentGroup = null;
        console.log("contact view ctor: ", $route.current.locals.groupData);
        this.scope = $scope;
        this.timeout = $timeout;
        this.location = $location;
        this.setData($route.current.locals.groupData);
    }
    ContactViewComponent.prototype.setData = function (data) {
        var _this = this;
        this.isNew = data.isNew;
        this.markedForDelete = false;
        this.original = data;
        this.dataSet = angular.copy(this.original);
        this.phoneBookService.getItem(data.parent)
            .then(function (group) {
            _this.parentGroup = group;
        }, function (err) {
            console.log("error: ", err);
        });
    };
    ;
    ContactViewComponent.prototype.back = function (e) {
        var _this = this;
        console.log("back");
        e.preventDefault();
        this.clearEmptyPhone();
        if (this.isNew) {
            if (!this.dataSet.name || this.dataSet.name.trim().length < 1 || this.markedForDelete) {
                domHelpers.setModal("New Contact", "Contact will not be saved, continue anyway?")
                    .then(function () {
                    _this.isNew = false;
                    _this.markedForDelete = false;
                    _this.scope.$apply(_this.location.path(GROUP_PATH + "/" + _this.original.parent));
                }, function () {
                    _this.markedForDelete = false;
                });
            }
            else {
                this.checkIfUpdateNeeded();
                this.location.path(GROUP_PATH + "/" + this.original.parent);
            }
        }
        else if (this.markedForDelete) {
            domHelpers.setModal("Delete Contact ", "Are you sure you want to delete " + this.dataSet.name + "?")
                .then(function () {
                var deleted = _this.phoneBookService.deleteItem(_this.original.id, _this.original.parent);
                deleted.then(function (res) {
                    console.log("contact deleted successfully ", res);
                });
                _this.scope.$apply(_this.location.path(GROUP_PATH + "/" + _this.original.parent));
                //this.location.path(GROUP_PATH + "/" +this.original.parent);
            }, function () {
                _this.markedForDelete = false;
            });
        }
        else {
            this.checkIfUpdateNeeded();
            this.location.path(GROUP_PATH + "/" + this.original.parent);
        }
    };
    ;
    ContactViewComponent.prototype.deleteItem = function (e) {
        this.markedForDelete = true;
        this.back(e);
    };
    ;
    ContactViewComponent.prototype.titleBlur = function (e) {
        e.preventDefault();
        console.log("titleBlur");
        this.checkIfUpdateNeeded();
        if (this.dataSet.phoneNumbers.length == 0) {
            this.addPhone();
        }
    };
    ContactViewComponent.prototype.blurOnEnter = function ($event) {
        if ($event.which != 13) {
            return;
        }
        this.timeout(function () {
            $event.target.blur();
        }, 0, false);
    };
    ;
    /**
     * check if update/create needed and perform
     */
    ContactViewComponent.prototype.checkIfUpdateNeeded = function () {
        console.log("checking for updates..");
        this.clearEmptyPhone();
        var changed = false;
        if (this.dataSet.name != this.original.name && this.dataSet.name.length > 0) {
            changed = true;
        }
        else if (this.dataSet.phoneNumbers.length != this.original.phoneNumbers.length) {
            changed = true;
        }
        else {
            var arr = this.dataSet.phoneNumbers;
            for (var i = 0; i < arr.length; i++) {
                console.log("checking numbers: ", arr[i], this.original.phoneNumbers[i]);
                if (arr[i] != this.original.phoneNumbers[i]) {
                    changed = true;
                }
            }
        }
        if (changed) {
            console.log("updateing......");
            this.original.name = this.dataSet.name;
            var nameArr = this.dataSet.name.split(" ");
            this.original.firstName = nameArr.shift();
            this.original.lastName = nameArr.join(" ");
            this.original.phoneNumbers = this.dataSet.phoneNumbers;
            this.isNew = this.original.isNew = false;
            if (this.parentGroup.items.indexOf(this.original) == -1) {
                var t = BookItem_1.BookItem.generateNextId();
                this.original.id = t;
                this.parentGroup.addItem(this.original);
            }
            var updated = this.phoneBookService.setRoot();
            updated.then(function (res) {
                console.log("contact updated successfully ", res);
            });
            this.dataSet = angular.copy(this.original);
        }
    };
    ;
    ContactViewComponent.prototype.clearEmptyPhone = function () {
        var phones = this.dataSet.phoneNumbers;
        for (var i = 0; i < phones.length; i++) {
            if (!phones[i] || phones[i].length < 1) {
                phones.splice(i, 1);
                i--;
            }
        }
    };
    ;
    ContactViewComponent.prototype.addPhone = function () {
        this.dataSet.phoneNumbers.push("");
    };
    ;
    ContactViewComponent.$inject = ["phoneBookService", "$route", "$location", "$timeout", "$scope"];
    return ContactViewComponent;
}());
exports.ContactViewComponent = ContactViewComponent;
appModule_1.appModule.component("contactView", {
    controller: ContactViewComponent,
    template: require("./contactView.html!text"),
    styles: require("./contactView.css!css"),
});
//# sourceMappingURL=contactView.js.map