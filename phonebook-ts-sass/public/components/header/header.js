/// <reference path="./../../typings/tsd.d.ts"/>
"use strict";
var appModule_1 = require("./../../appModule");
var HeaderComponent = (function () {
    function HeaderComponent($location, phoneBookService) {
        this.location = $location;
        this.phoneBook = phoneBookService;
    }
    HeaderComponent.prototype.resetData = function () {
        var _this = this;
        this.phoneBook.loadDefaults().then(function () {
            _this.location.path("/group");
        });
    };
    HeaderComponent.prototype.search = function (event) {
        console.log("search ", event.target.value);
        this.location.path("/search/" + event.target.value);
    };
    HeaderComponent.$inject = ["$location", "phoneBookService"];
    return HeaderComponent;
}());
exports.HeaderComponent = HeaderComponent;
appModule_1.appModule.component("pbHeader", {
    controller: HeaderComponent,
    template: require("./header.html!text"),
});
appModule_1.appModule.component("pbHeaderDrawer", {
    controller: HeaderComponent,
    template: require("./headerDrawer.html!text"),
});
//# sourceMappingURL=header.js.map