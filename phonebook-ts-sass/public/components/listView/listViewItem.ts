
/// <reference path="./../../typings/tsd.d.ts"/>
import {appModule} from "./../../appModule";

export class ListViewItemComponent {

    private item;

    constructor(){
        console.log("ListViewItemComponent ctor: " , this.item);
    }
}

appModule.component("listViewItem" , <any>{
    controller: ListViewItemComponent,
    template: require("./listViewItem.html!text"),
    bindings: {
        item: '=ngModel',
        parentCtrl: '=ngCtrl'
    },
});