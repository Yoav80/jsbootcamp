"use strict";
/// <reference path="./../../typings/tsd.d.ts"/>
var appModule_1 = require("./../../appModule");
var ListViewItemComponent = (function () {
    function ListViewItemComponent() {
        console.log("ListViewItemComponent ctor: ", this.item);
    }
    return ListViewItemComponent;
}());
exports.ListViewItemComponent = ListViewItemComponent;
appModule_1.appModule.component("listViewItem", {
    controller: ListViewItemComponent,
    template: require("./listViewItem.html!text"),
    bindings: {
        item: '=ngModel',
        parentCtrl: '=ngCtrl'
    },
});
//# sourceMappingURL=listViewItem.js.map