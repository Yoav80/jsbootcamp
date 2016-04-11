'use strict';
angular.module('phonebook')
    .constant('ENDPOINT_URI', 'http://localhost/phoneBook/')
    .service('phoneBookData', function ($http, ENDPOINT_URI) {

        console.log("phoneBookData service");

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

        service.all = function () {
            return $http.get(getUrl());
        };

        service.fetch = function (itemId) {
            return $http.get(getUrlForId(itemId));
        };

        service.create = function (item) {
            return $http.post(getUrl(), item);
        };

        service.update = function (itemId, item) {
            return $http.put(getUrlForId(itemId), item);
        };

        service.destroy = function (itemId) {
            return $http.delete(getUrlForId(itemId));
        };

        service.getJSON = function(){

            var req = {
                method: 'GET',
                url: 'http://localhost/phonebook/flatJSON/',
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            var promise = $http.get('http://localhost/phonebook/flatJSON/');

            return promise;
        };

        service.saveJSON = function (data) {
            return $http.post(getUrl(), data);
        }
    });