
'use strict';

var ng_app = angular.module('phonebook');

ng_app.controller("headerController" , function($rootScope , phoneBookItems) {

    this.search = function ($event) {
        var str = $event.currentTarget.value;
        var data = phoneBookItems.root();
        var resultsArr = data.getItemsByName(str);

        $rootScope.$broadcast('displaySearch', resultsArr);
    };

    this.resetData = function () {
        console.log("reset data");
    };
});