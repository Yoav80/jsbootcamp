/// <reference path="./../../typings/tsd.d.ts"/>

import {appModule} from "./../../appModule";
import {PhoneBookService} from "../../services/phoneBookService";

export class HeaderComponent {

    static $inject = ["$location" , "phoneBookService"];

    private location;
    private phoneBook;

    constructor($location , phoneBookService:PhoneBookService) {
        this.location = $location;
        this.phoneBook = phoneBookService;
    }

    resetData() {
        this.phoneBook.loadDefaults().then(() => {
            this.location.path("/group");
        })
    }

    search(event) {
        console.log("search " , event.target.value);
        this.location.path("/search/" + event.target.value);
    }
}

appModule.component("pbHeader" , <any>{
    controller: HeaderComponent,
    template: require("./header.html!text"),

});

appModule.component("pbHeaderDrawer" , <any>{
    controller: HeaderComponent,
    template: require("./headerDrawer.html!text"),

});