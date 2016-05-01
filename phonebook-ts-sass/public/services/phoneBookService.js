"use strict";
var appModule_1 = require("./../appModule");
var Group_1 = require("./../dataClasses/Group");
var BookItem_1 = require("../dataClasses/BookItem");
var Conatct_1 = require("../dataClasses/Conatct");
var PhoneBookService = (function () {
    function PhoneBookService($http, ENDPOINT_URI, $q) {
        this.$http = $http;
        this.ENDPOINT_URI = ENDPOINT_URI;
        this.$q = $q;
        this._root = null;
        this.lastGroup = null;
        this.groups = 'groups/';
        this.contacts = 'contacts/';
        this.path = 'flatJSON/';
        console.log("PhoneBookService ctor");
        //this.getRoot(true);
    }
    PhoneBookService.prototype.getUrl = function () {
        return this.ENDPOINT_URI + this.path;
    };
    PhoneBookService.prototype.getRoot = function (reload) {
        var _this = this;
        var def = this.$q.defer();
        if (this._root && !reload) {
            def.resolve(this._root);
        }
        //let service = this;
        var p = this.getJSON();
        p.then(function (data) {
            console.log("PhoneBookService data loaded successfully", data);
            var dataObject = {
                itemInDataIndex: 0,
                data: data.data
            };
            BookItem_1.BookItem.setId(0);
            _this._root = new Group_1.Group(0, "PhoneBook", null, []);
            _this._root.items = [];
            _this._root.addJsonTree(dataObject);
            _this.lastGroup = _this._root;
            def.resolve(_this._root);
        }, function () {
            console.log("error loading data, getting defaults");
            var dataObject = {
                itemInDataIndex: 0,
                data: _this.getDefaults()
            };
            BookItem_1.BookItem.setId(0);
            _this._root = new Group_1.Group(0, "PhoneBook", null, []);
            _this._root.items = [];
            _this._root.addJsonTree(dataObject);
            def.resolve(_this._root);
        });
        return def.promise;
    };
    ;
    PhoneBookService.prototype.setRoot = function () {
        console.log("set root");
        var def = this.$q.defer();
        var dataToWrite = this.getFlatArrForJSON(this._root, null);
        //ataToWrite = JSON.stringify(dataToWrite);
        this.$http.post(this.getUrl(), dataToWrite)
            .then(function () {
            def.resolve({ success: true });
        }, function () {
            def.reject({ success: false });
        });
        return def.promise;
    };
    ;
    PhoneBookService.prototype.getFlatArrForJSON = function (item, flatArray) {
        var obj = null;
        flatArray = flatArray || [];
        if (item instanceof Group_1.Group) {
            obj = {
                "type": "Group",
                "name": item.name,
                "numOfChildes": item.items.length,
                "id": item.id
            };
        }
        else if (item instanceof Conatct_1.Contact) {
            obj = {
                "type": "Contact",
                "name": item.firstName + " " + item.lastName,
                "phoneNumbers": item.phoneNumbers,
                "id": item.id
            };
        }
        if (obj) {
            flatArray.push(obj);
        }
        if (item instanceof Group_1.Group && item.items.length > 0) {
            for (var subGroupsIndex = 0; subGroupsIndex < item.items.length; subGroupsIndex++) {
                this.getFlatArrForJSON(item.items[subGroupsIndex], flatArray);
            }
        }
        return flatArray;
    };
    ;
    PhoneBookService.prototype.loadDefaults = function () {
        var dataObject = {
            itemInDataIndex: 0,
            data: this.getDefaults()
        };
        BookItem_1.BookItem.setId(0);
        this._root.items = [];
        this._root.addJsonTree(dataObject);
        this.setRoot();
        return this.$q.when(this._root);
    };
    PhoneBookService.prototype.getItem = function (id) {
        var _this = this;
        var def = this.$q.defer();
        if (this._root) {
            console.log("get item", this._root);
            var item = this._root.getItemById(id);
            if (item) {
                if (item instanceof Group_1.Group) {
                    this.lastGroup = item;
                }
                def.resolve(item);
            }
            else {
                def.reject({ data: "no item found1" });
            }
        }
        else {
            this.getRoot(false).then(function (data) {
                console.log("get item2", data);
                var item = data.getItemById(id);
                if (item) {
                    if (item instanceof Group_1.Group) {
                        _this.lastGroup = item;
                    }
                    def.resolve(item);
                }
                else {
                    def.reject({ data: "no item found2" });
                }
            });
        }
        return def.promise;
    };
    PhoneBookService.prototype.getSearchResults = function (str) {
        var _this = this;
        if (this._root) {
            var resultsArr = this._root.getItemsByName(str, null);
            return this.$q.when({
                items: resultsArr.length ? resultsArr : [{ name: "no results..", noIcon: true }],
                isSearch: true,
                parent: this.getLastGroup(),
            });
        }
        else {
            var def = this.$q.defer();
            this.getRoot(true).then(function (root) {
                var resultsArr = root.getItemsByName(str, null);
                console.log("getSearchResults:: ", resultsArr);
                def.resolve({
                    items: resultsArr.length ? resultsArr : [{ name: "no results..", noIcon: true }],
                    isSearch: true,
                    parent: _this.getLastGroup(),
                });
            });
            return def.promise;
        }
    };
    PhoneBookService.prototype.getJSON = function () {
        var req = {
            method: 'GET',
            url: this.getUrl(),
            headers: {
                'Content-Type': 'text/plain'
            }
        };
        return this.$http(req);
    };
    ;
    PhoneBookService.prototype.getDefaults = function () {
        var defaultJSON = '  [{"type":"Group","name":"PhoneBook","numOfChildes":4},' +
            '{"type":"Contact","name":"yoav melkman","phoneNumbers":["0542011802","65665"]},' +
            '{"type":"Contact","name":"eran melkman","phoneNumbers":["34","05555555"]},' +
            '{"type":"Group","name":"friends","numOfChildes":3},' +
            '{"type":"Contact","name":"joe retre","phoneNumbers":["3534","12313"]},' +
            '{"type":"Contact","name":"yuval ert","phoneNumbers":["0542011802","123","234234"]},' +
            '{"type":"Group","name":"best friends","numOfChildes":2},' +
            '{"type":"Contact","name":"dani miller","phoneNumbers":["234627","05555555"]},' +
            '{"type":"Contact","name":"omer cohen","phoneNumbers":["66","77"]},' +
            '{"type":"Group","name":"classmates","numOfChildes":2},' +
            '{"type":"Contact","name":"eyal masheu","phoneNumbers":["345","6575676576"]},' +
            '{"type":"Contact","name":"bar tesler","phoneNumbers":["234","45345424"]}]';
        return JSON.parse(defaultJSON);
    };
    ;
    PhoneBookService.prototype.getLastGroup = function () {
        return this.lastGroup.id;
    };
    PhoneBookService.prototype.deleteItem = function (id, parent) {
        var _this = this;
        var def = this.$q.defer();
        this.getItem(parent)
            .then(function (item) {
            var arr = item.items;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].id == id) {
                    arr.splice(i, 1);
                    _this.setRoot();
                    return def.resolve({ data: "success" });
                }
            }
        }, function () {
            return def.reject({ data: "error" });
        });
        return def.promise;
    };
    PhoneBookService.$inject = ['$http', 'ENDPOINT_URI', '$q'];
    return PhoneBookService;
}());
exports.PhoneBookService = PhoneBookService;
appModule_1.appModule.constant('ENDPOINT_URI', 'http://localhost/phoneBook/');
appModule_1.appModule.service("phoneBookService", PhoneBookService);
//# sourceMappingURL=phoneBookService.js.map