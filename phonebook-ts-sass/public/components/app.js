/// <reference path="./../typings/tsd.d.ts"/>
"use strict";
var appModule_1 = require("./../appModule");
require("./header/header");
require("./listView/listView");
require("./contactView/contactView");
require("./../directives/autoFocus");
require("./../directives/ngEnter");
require("./../appModule.config");
var AppComponent = (function () {
    function AppComponent() {
        (this).$postLink = function () {
            console.log("app init");
            initMdl();
        };
    }
    return AppComponent;
}());
function initMdl() {
    console.log("initMdl");
    componentHandler.upgradeDom();
}
appModule_1.appModule.component("app", {
    controller: AppComponent,
    template: require("./app.html!text"),
});
//# sourceMappingURL=app.js.map