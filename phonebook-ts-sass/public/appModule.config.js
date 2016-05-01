/// <reference path="./typings/tsd.d.ts"/>
"use strict";
var appModule_1 = require("./appModule");
var Conatct_1 = require("./dataClasses/Conatct");
function appConfig($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/search/:str', {
        template: '<list-view></list-view>',
        resolve: {
            groupData: ['$route', 'phoneBookService', function ($route, phoneBookService) {
                    var str = $route.current.params.str;
                    return phoneBookService.getSearchResults(str);
                }]
        }
    })
        .when('/group', {
        template: '<list-view></list-view>',
        resolve: {
            groupData: ['$route', 'phoneBookService', function ($route, phoneBookService) {
                    console.log("ng route /group:: ", $route.current.params);
                    return phoneBookService.getRoot(false);
                }]
        }
    })
        .when('/group/:id', {
        template: '<list-view></list-view>',
        resolve: {
            groupData: ['$route', 'phoneBookService', function ($route, phoneBookService) {
                    console.log("ng route group :: ", $route.current.params.id);
                    return phoneBookService.getItem($route.current.params.id);
                }]
        }
    })
        .when('/contact/:id', {
        template: '<contact-view></contact-view>',
        resolve: {
            groupData: ['$route', 'phoneBookService', function ($route, phoneBookService) {
                    //console.log("ng route:: " , $route.current.params.id);
                    return phoneBookService.getItem($route.current.params.id);
                }]
        }
    })
        .when('/contact', {
        template: '<contact-view></contact-view>'
    })
        .when('/new-contact/:groupId', {
        template: '<contact-view></contact-view>',
        resolve: {
            groupData: ['$route', 'phoneBookService', function ($route, phoneBookService) {
                    var groupId = $route.current.params.groupId;
                    var contact = new Conatct_1.Contact(-999, null, groupId);
                    contact.isNew = true;
                    return contact;
                    //return phoneBookService.getItem($route.current.params.id);
                }]
        }
    })
        .otherwise({ redirectTo: '/group' });
}
function appRun(phoneBookService) {
    console.log("app run get!!!");
    phoneBookService.getRoot(true).then(function (data) {
        console.log("app run receive!!!", data);
    });
}
appModule_1.appModule.config(['$routeProvider', '$locationProvider', appConfig]);
//appModule.run([<any>'phoneBookService' , appRun]); 
//# sourceMappingURL=appModule.config.js.map