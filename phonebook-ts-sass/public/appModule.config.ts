/// <reference path="./typings/tsd.d.ts"/>

import {appModule} from "./appModule";
import {PhoneBookService} from "./services/phoneBookService";
import {Group} from "./dataClasses/Group";
import {Contact} from "./dataClasses/Conatct";

function appConfig ($routeProvider: angular.route.IRouteProvider, $locationProvider: angular.ILocationProvider) {

    $locationProvider.html5Mode(true);

    $routeProvider
        .when('/search/:str', {
            template: '<list-view></list-view>',
            resolve: {
                groupData: ['$route', 'phoneBookService', function ($route, phoneBookService : PhoneBookService) {
                    let str = $route.current.params.str;
                    return phoneBookService.getSearchResults(str);
                }]
            }
        })
        .when('/group', {
            template: '<list-view></list-view>',
            resolve: {
                groupData: ['$route', 'phoneBookService', function ($route, phoneBookService : PhoneBookService) {
                    console.log("ng route /group:: " , $route.current.params);
                    return phoneBookService.getRoot(false);
                }]
            }
        })
        .when('/group/:id', {
            template: '<list-view></list-view>',
            resolve: {
                groupData: ['$route', 'phoneBookService', function ($route, phoneBookService : PhoneBookService) {
                    console.log("ng route group :: " , $route.current.params.id);
                    return phoneBookService.getItem($route.current.params.id);
                }]
            }
        })
        .when('/contact/:id', {
            template: '<contact-view></contact-view>',
            resolve: {
                groupData: ['$route', 'phoneBookService', function ($route, phoneBookService : PhoneBookService) {
                    //console.log("ng route:: " , $route.current.params.id);
                    return phoneBookService.getItem($route.current.params.id);
                }]
            }
        })
        .when('/contact', {
            template: '<contact-view></contact-view>'
        })

        .when('/new-contact/:groupId' , {
            template: '<contact-view></contact-view>',
            resolve: {
                groupData: ['$route', 'phoneBookService', function ($route, phoneBookService : PhoneBookService) {

                    let groupId = $route.current.params.groupId;
                    let contact = new Contact(-999,null,groupId);
                    contact.isNew = true;
                    return contact;
                    //return phoneBookService.getItem($route.current.params.id);
                }]
            }
        })

        .otherwise({ redirectTo: '/group' });
}

function appRun( phoneBookService : PhoneBookService) {

    console.log("app run get!!!");

    phoneBookService.getRoot(true).then(function (data) {
        console.log("app run receive!!!" , data);
    })
}
appModule.config([<any>'$routeProvider', <any>'$locationProvider', appConfig]);

//appModule.run([<any>'phoneBookService' , appRun]);