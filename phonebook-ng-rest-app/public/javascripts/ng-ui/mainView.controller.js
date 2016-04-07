
'use strict';
var ng_app = angular.module('phonebook');

ng_app.controller("mainViewController" , ['$scope' , '$timeout' , function($scope , $timeout) {
    var vm = this;
    vm.currentView = "group";

    $scope.$on('displayContact' , function(e , item) {
        vm.currentView = "";
        $timeout(function(){vm.currentView = "contact";});
    });

    $scope.$on('displayGroups' , function(e , item) {
        vm.currentView = "";
        $timeout(function(){vm.currentView = "group";});
    });
}]);