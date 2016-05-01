import {BookItem} from './BookItem';
import {Contact} from "./Conatct";
import {PhoneBookService} from "../services/phoneBookService";

export class Group extends BookItem{


    constructor(id:number, name:string, parent:number, public items:Array<any>  ) {
        super(id, name, parent);
    }

    public addItem(item: BookItem) {

        if (item instanceof Contact || item instanceof Group) {
            if (this.items.indexOf(item) != -1) {
                console.error("duplicate item: " + item.name + " in group: " + this.name);
                throw new Error("duplicate item cannot be added to a group");
            }
            else {
                console.log("adding: " + item.getName());
                item.parent = this.id;
                this.items.push(item);
            }
        }

        //EventBus.dispatch("dataChanged", this);
    };

    public addJsonTree (dataObject : ({itemInDataIndex:number , data:Array<any>})) {
        var itemIndex = dataObject.itemInDataIndex++;
        var dataItem = dataObject.data[itemIndex];
        dataItem.parent = this.id;

        if (dataItem.type == "Contact") {
            var nameArr = dataItem.name.split(" ");
            dataItem.firstName = dataItem.firstName || nameArr.shift();
            dataItem.lastName = dataItem.lastName || nameArr.join(" ");

            var contact = new Contact(dataItem.id , dataItem.name, dataItem.parent, dataItem.firstName, dataItem.lastName, dataItem.phoneNumbers);
            this.addItem(contact);
        }
        else if (dataItem.type == "Group") {
            var group;

            if (dataItem.id == 0 || itemIndex == 0) {
                group = this;
            }
            else {
                group = new Group(dataItem.id , dataItem.name, dataItem.parent, []);
                this.addItem(group);
            }

            if (dataItem.numOfChildes > 0) {
                for (var subIndex = 0; subIndex < dataItem.numOfChildes; subIndex++) {
                    group.addJsonTree(dataObject);
                }
            }
        }
    };

    /**
     * A function that searches for a string match in all items and subItems
     *
     * @param searchStr  String to match
     * @param matchesArr Array for recursive reasons
     * @returns {*|Array}
     */
    public getItemsByName (searchStr:string, matchesArr:Array<BookItem>) {

        matchesArr = matchesArr || [];

        if (this.name.indexOf(searchStr) != -1){
            matchesArr.push(this);
        }
        if (this.items.length) {
            for (var itemIndex = 0 , length = this.items.length; itemIndex < length; itemIndex++) {

                var subItem = this.items[itemIndex];

                if (subItem.items) {
                    subItem.getItemsByName(searchStr, matchesArr);
                }
                else if (subItem.name.indexOf(searchStr) != -1) {
                    matchesArr.push(subItem);
                }
            }
        }

        return matchesArr;
}


    /**
     * recursive search for a matched id
     * @param id
     * @returns {*|object}
     */
    public getItemById (id) {
        if (this.id == id){
            return this;
        }
        if (this.items.length) {
            for (var itemIndex = 0 , length = this.items.length; itemIndex < length; itemIndex++) {

                var subItem = this.items[itemIndex];
                if (subItem.id == id) {
                    return subItem;
                }
                if (subItem.items) {
                    var subGroup = subItem.getItemById(id);
                    if (subGroup && subGroup.id == id){
                        return subGroup;
                    }
                }
            }
        }
    };

    /**
     * A search for an exact match on a name of a group
     * @param name
     * @returns {*| object}
     */
    public findGroupByExactName (name) {
        if (this.name == name){
            return this;
        }
        else if (this.items.length) {
            for (var itemIndex = 0 , length = this.items.length; itemIndex < length; itemIndex++) {

                var subItem = this.items[itemIndex];
                if (subItem.items && subItem.name == name) {
                    return subItem;
                }
            }
        }
    }

}