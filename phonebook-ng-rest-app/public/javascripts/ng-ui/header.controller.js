
/**
 * The header controller.
 * in charge of reset and search
 */

(function () {

    'use strict';

    var ng_app = angular.module('phonebook');
    ng_app.controller("headerController" , function($rootScope , phoneBookData) {

        this.search = function ($event) {
            var str = $event.currentTarget.value;
            var resultsArr = phoneBookData.getRoot().getItemsByName(str);

            $rootScope.$broadcast('displaySearch', resultsArr);
        };

        this.resetData = function () {
            console.log("reset data");
            phoneBookData.resetToDefaults();
            $rootScope.$broadcast('resetData');
        };
    });

})();