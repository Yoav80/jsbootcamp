
'use strict';

var ng_app = angular.module('phonebook');

ng_app.controller("headerController" , function($rootScope) {

    this.search = function ($event) {
        var str = $event.currentTarget.value;
        var resultsArr = app.phoneBook.root.getItemsByName(str);

        $rootScope.$broadcast('displaySearch', resultsArr);
    };

    this.resetData = function () {
        console.log("reset data");
    };
});