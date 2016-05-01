/// <reference path="./../../typings/tsd.d.ts"/>

import {appModule} from "./../../appModule";
import {PhoneBookService} from "../../services/phoneBookService";
import {Contact} from "../../dataClasses/Conatct";
import {Group} from "../../dataClasses/Group";
import {BookItem} from "../../dataClasses/BookItem";

const GROUP_PATH = "/group";
declare var domHelpers;

export class ContactViewComponent {

    public dataSet:Contact;
    private original:Contact;
    private location;
    private timeout;
    private scope;
    private isNew:boolean = false;
    private markedForDelete:boolean = false;
    private parentGroup:Group = null;

    static $inject = ["phoneBookService" , "$route", "$location" , "$timeout", "$scope"];

    constructor(private phoneBookService : PhoneBookService, $route , $location, $timeout, $scope: ng.IScope) {

        console.log("contact view ctor: ", $route.current.locals.groupData);

        this.scope = $scope;
        this.timeout = $timeout;
        this.location = $location;
        this.setData($route.current.locals.groupData);
    }

    setData (data:Contact) {
        this.isNew = data.isNew;
        this.markedForDelete = false;
        this.original = data;
        this.dataSet = angular.copy(this.original);
        this.phoneBookService.getItem(data.parent)
            .then((group) => {
                this.parentGroup = group;
            } , (err) => {
                console.log("error: " , err);
            })
    };

    back (e) {

        console.log("back");
        e.preventDefault();

        this.clearEmptyPhone();

        if (this.isNew){
            if (!this.dataSet.name || this.dataSet.name.trim().length < 1 || this.markedForDelete){

                domHelpers.setModal("New Contact", "Contact will not be saved, continue anyway?")
                    .then( ()=> {
                        this.isNew = false;
                        this.markedForDelete = false;
                        this.scope.$apply(this.location.path(GROUP_PATH + "/" +this.original.parent));
                    }, () => {
                        this.markedForDelete = false;
                    });
            }

            else {
                this.checkIfUpdateNeeded();

                this.location.path(GROUP_PATH + "/" +this.original.parent);
            }
        }
        else if (this.markedForDelete) {

           domHelpers.setModal("Delete Contact ", "Are you sure you want to delete " + this.dataSet.name + "?")
                .then(() => {
                    var deleted = this.phoneBookService.deleteItem(this.original.id , this.original.parent);
                    deleted.then(function (res) {
                        console.log("contact deleted successfully " , res);
                    });

                    this.scope.$apply(this.location.path(GROUP_PATH + "/" +this.original.parent));
                    //this.location.path(GROUP_PATH + "/" +this.original.parent);
                } , () => {
                    this.markedForDelete = false;
                })
        }
        else {
            this.checkIfUpdateNeeded();

            this.location.path(GROUP_PATH + "/" +this.original.parent);
        }
    };

    deleteItem (e) {
        this.markedForDelete = true;
        this.back(e);
    };

    titleBlur (e) {
        e.preventDefault();
        console.log("titleBlur");

        this.checkIfUpdateNeeded();
        if (this.dataSet.phoneNumbers.length == 0) {
            this.addPhone();
        }
    }

    blurOnEnter( $event ) {
        if ( $event.which != 13 ) {
            return;
        }

        this.timeout(function () {
                $event.target.blur();
            }
            , 0, false);
    };

    /**
     * check if update/create needed and perform
     */
    checkIfUpdateNeeded () {
        console.log("checking for updates..");
        this.clearEmptyPhone();

        let changed:boolean = false;

        if (this.dataSet.name != this.original.name && this.dataSet.name.length > 0) {
            changed = true;
        }
        else if (this.dataSet.phoneNumbers.length != this.original.phoneNumbers.length){
            changed = true;
        }
        else {
            let arr = this.dataSet.phoneNumbers;
            for (var i=0; i<arr.length; i++) {
                console.log("checking numbers: " , arr[i], this.original.phoneNumbers[i] );
                if (arr[i] != this.original.phoneNumbers[i]) {
                    changed = true;
                }
            }
        }

        if (changed) {

            console.log("updateing......");
            this.original.name = this.dataSet.name;
            var nameArr = this.dataSet.name.split(" ");
            this.original.firstName = nameArr.shift();
            this.original.lastName = nameArr.join(" ");
            this.original.phoneNumbers = this.dataSet.phoneNumbers;
            this.isNew = this.original.isNew = false;

            if (this.parentGroup.items.indexOf(this.original) == -1){
                var t = BookItem.generateNextId();
                this.original.id = t;
                this.parentGroup.addItem(this.original);
            }

            var updated = this.phoneBookService.setRoot();
            updated.then(function (res) {
                console.log("contact updated successfully " , res);
            });

            this.dataSet = angular.copy(this.original);

        }

    };

    clearEmptyPhone () {
        let phones = this.dataSet.phoneNumbers;
        for (let i:number = 0; i < phones.length; i++) {
            if (!phones[i] ||  (phones[i] as string).length < 1) {
                phones.splice(i,1);
                i--;
            }
        }
    };

    addPhone () {
        this.dataSet.phoneNumbers.push("");
    };
}

appModule.component("contactView" , <any>{
    controller: ContactViewComponent,
    template: require("./contactView.html!text"),
    styles: require("./contactView.css!css"),

});
