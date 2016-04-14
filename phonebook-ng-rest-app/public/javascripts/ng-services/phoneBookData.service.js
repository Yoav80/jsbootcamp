'use strict';
var app = app || {};

/**
 * The Phone Book Data service.
 * set the phone book root object, and fill it
 * either by getting JSON from server or by creating a default tree.
 */

( function () {
angular.module('phonebook')
    .constant('ENDPOINT_URI', 'http://localhost/phoneBook/')
    .service('phoneBookData', function ($http, ENDPOINT_URI, $q) {

        var _root = null;
        var service = this,
            groups = 'groups/',
            contacts = 'contacts/',
            path = 'flatJSON/';

        function getUrl() {
            return ENDPOINT_URI + path;
        }

        function getUrlForId(itemId) {
            return getUrl(path) + itemId;
        }

        // REST

        service.all = function () {
            return $http.get(getUrl());
        };

        service.fetch = function (itemId) {
            return $http.get(getUrlForId(itemId));
        };

        service.create = function (item) {
            console.log("REST create item - " , item);
            return service.setRoot();
            //return $http.post(getUrl(), item);
        };

        service.update = function (item) {
            console.log("REST update item - " , item);
            return service.setRoot();
            //return $http.put(getUrlForId(itemId), item);
        };

        service.destroy = function (item) {
            console.log("REST destroy item - " , item);
            return service.setRoot();
            //return $http.delete(getUrlForId(itemId));
        };

        service.getJSON = function(){

            var req = {
                method: 'GET',
                url: 'http://localhost/phonebook/flatJSON/',
                headers: {
                    'Content-Type': 'text/plain'
                }
            };

            //var promise = $http.get('http://localhost/phonebook/flatJSON/');

            return $http(req);
        };

        // FLAT FILE API

        service.resetToDefaults = function () {
            var dataObject = {
                itemInDataIndex: 0,
                data: service.getDefaults()
            };

            app.BookItem.setId(0);
            _root.items = [];
            _root.addJsonTree(dataObject);
            console.log("REST reset " , _root);
            service.setRoot();
        };

        service.getRoot = function(reload) {

            if (_root && !reload) {
                return _root;
            }

            _root = new app.Group({name: "PhoneBook"});

            var def = $q.defer();
            var p = service.getJSON();

            p.success(function (data) {
                console.log("data loaded successfully" , data);
                var dataObject = {
                    itemInDataIndex: 0,
                    data: data
                };

                app.BookItem.setId(0);
                _root.items = [];
                _root.addJsonTree(dataObject);
                def.resolve(_root);

            }).error(function () {
                console.log("error loading data, getting defaults");
                var dataObject = {
                    itemInDataIndex: 0,
                    data: service.getDefaults()
                };

                app.BookItem.setId(0);
                _root.items = [];
                _root.addJsonTree(dataObject);
                def.resolve(_root);
            });

            return def.promise;
        };

        service.setRoot = function () {
            var def = $q.defer();
            var dataToWrite = service.getFlatArrForJSON(_root);
            //ataToWrite = JSON.stringify(dataToWrite);

            $http.post(getUrl(), dataToWrite)
                .success(function () {
                    def.resolve({success:true});
                }).error(function () {
                    def.reject({success:false});
                });

            return def.promise;
        };

        service.getFlatArrForJSON = function (item, flatArray) {

            var obj = null;
            flatArray = flatArray || [];

            if (item instanceof app.Group) {
                obj = {
                    "type": "Group",
                    "name": item.name,
                    "numOfChildes": item.items.length,
                    "id": item.id
                };
            }
            else if (item instanceof app.Contact) {
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

            if (item instanceof app.Group && item.items.length > 0) {
                for (var subGroupsIndex = 0; subGroupsIndex < item.items.length; subGroupsIndex++) {
                    this.getFlatArrForJSON(item.items[subGroupsIndex], flatArray);
                }
            }

            return flatArray;
        };

        service.getDefaults = function () {

            console.log("get defaults");

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

    });
})();