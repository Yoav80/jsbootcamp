/// <reference path="./../typings/tsd.d.ts"/>

import {appModule} from "./../appModule";
import  "./header/header";
import "./listView/listView";
import "./contactView/contactView";
import "./../directives/autoFocus"
import "./../directives/ngEnter"
import "./../appModule.config";

declare var $postLink;
declare var componentHandler;

class AppComponent {
    constructor() {
        (<any>(this)).$postLink = function() {
            console.log("app init");
            initMdl();
        };
    }
}

function initMdl() {
    console.log("initMdl");
    componentHandler.upgradeDom();
}

appModule.component("app" , <any>{
    controller: AppComponent,
    template: require("./app.html!text"),

});