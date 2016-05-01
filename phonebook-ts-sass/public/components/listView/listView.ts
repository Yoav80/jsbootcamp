/// <reference path="./../../typings/tsd.d.ts"/>

import {appModule} from "./../../appModule";
import "./listViewItem"
import "../../services/phoneBookService";
import {PhoneBookService} from "../../services/phoneBookService";
import {Group} from "../../dataClasses/Group";
import {BookItem} from "../../dataClasses/BookItem";
import {Contact} from "../../dataClasses/Conatct";

declare var domHelpers;
declare var initMdlSpeedDial;

const SEARCH_RESULTS_TITLE = "search results";
const GROUP_PATH = "/group";
const CONTACT_PATH = "/contact";
const NEW_CONTACT_PATH = "/new-contact";

export class ListViewComponent{

    public dataSet = null;

    private title:string;
    private noItems:boolean;
    private isBackDisabled:boolean = true;
    private isTitleDisabled:boolean = true;
    private isAddingDisabled:boolean = false;
    private isSearch:boolean = false;
    private searchTitle:string;
    private newGroup:Group = null;
    private newGroupName:string = null;
    private location;

    static $inject = ["phoneBookService" , "$route", "$location"];

    constructor(private phoneBookService : PhoneBookService, $route , $location ) {

        this.location = $location;
        this.searchTitle = SEARCH_RESULTS_TITLE;
        console.log("ListViewComponent ctor : " , $route.current.locals.groupData);
        this.setData($route.current.locals.groupData);
    }

    $postLink() {
        //console.log("ListViewComponent $postLink ");
        initMdlSpeedDial();
    };

    setData(data:any) {
        if (data instanceof Group) {

            this.dataSet = data;
            this.title = data.name;
            this.noItems = (data.items.length == 0);
            this.isBackDisabled = this.isTitleDisabled = data.parent == null;
            this.isAddingDisabled = data.name == SEARCH_RESULTS_TITLE;
        }
        else if (data.isSearch == true) {
            this.dataSet = data;
            this.title = SEARCH_RESULTS_TITLE;
            this.noItems = (data.items.length == 0);
            this.isBackDisabled = false;
            this.isAddingDisabled = this.isSearch = true;
        }
    };

    navigate(item:BookItem) {
        let path = item instanceof Group ? GROUP_PATH + "/" + item.id : CONTACT_PATH + "/" + item.id;
        console.log("navigate " , item, path);

        this.location.path(path);
    }

    back() {
        console.log("back:: " , this.dataSet.parent);
        if (this.dataSet.parent != null) {
            this.location.path(GROUP_PATH + "/" +this.dataSet.parent);
        }
    };


    deleteItem (item) {

        console.log("list view delete item: " , item);

        domHelpers.setModal("DELETE","Are you sure you want to delete " + item.name + " ?")
            .then(() => {
                console.log("deleting item " , item);

                var deleted = this.phoneBookService.deleteItem(item.id , item.parent);
                deleted.then(function (res) {
                    console.log("item " + item.name + " deleted successfully " , res);
                });

                if (this.isSearch) {

                    if (item instanceof Group) {
                        let res = item.getItemById(this.dataSet.parent.id);
                        if (res) {
                            this.dataSet.parent = item.parent;
                        }
                    }


                    var items = this.dataSet.items;
                    for (var i=0; i<items.length; i++){
                        if (items[i].id == item.id){
                            items.splice(i , 1);
                            i--;
                        }
                        else if (item instanceof Group && item.getItemById(items[i].id)) {
                            items.splice(i , 1);
                            i--;
                        }
                    }
                }

                this.noItems = (this.dataSet.items.length == 0);
            })
            .fail(function() {
                console.log('cancel DELETE');
            });
    };


    addItem(type:string) {

        if (type == 'contact') {
            //var newContact = new Contact(null,null,this.dataSet);
            this.location.path(NEW_CONTACT_PATH + "/" + this.dataSet.id);
        }

        else if (type == 'group') {
            var newGroup = new Group(null,null,this.dataSet.id, []);
            newGroup.isNew = true;

            this.newGroup = newGroup;
            this.newGroupName = "";
            this.noItems = false;
            this.dataSet.items.push(newGroup);
        }
    };

    titleBlur() {
        this.updateCurrentGroup();
    };

    updateCurrentGroup() {
        console.log("checking for updates.." , this.dataSet.name , this.title );
        var changed = false;

        if (this.dataSet.name != this.title && this.title.length > 0) {
            changed = true;
        }

        if (changed) {
            console.log("found changes, updating....");
            this.dataSet.name = this.title;

            //update group
            this.phoneBookService.setRoot()
                .then(function (res) {
                    console.log("update item: " , res, event);
                });
        }
    };

    saveNewItem(event , item)   {

        if (!this.newGroupName || this.newGroupName.length < 1 ) {
            this.newGroupName = event.target.placeholder;
        }

        this.newGroup.name = this.newGroupName;
        this.newGroup.isNew = false;

        //create new group
        this.phoneBookService.setRoot()
        .then(function (res) {
            console.log("saved item: " , res, event);
        });
    };
}


appModule.component("listView" , <any>{
    controller: ListViewComponent,
    template: require("./listView.html!text"),
    styles: require("./listView.css!css"),

});

