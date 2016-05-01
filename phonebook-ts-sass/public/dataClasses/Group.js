"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BookItem_1 = require('./BookItem');
var Conatct_1 = require("./Conatct");
var Group = (function (_super) {
    __extends(Group, _super);
    function Group(id, name, parent, items) {
        _super.call(this, id, name, parent);
        this.items = items;
    }
    Group.prototype.addItem = function (item) {
        if (item instanceof Conatct_1.Contact || item instanceof Group) {
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
    ;
    Group.prototype.addJsonTree = function (dataObject) {
        var itemIndex = dataObject.itemInDataIndex++;
        var dataItem = dataObject.data[itemIndex];
        dataItem.parent = this.id;
        if (dataItem.type == "Contact") {
            var nameArr = dataItem.name.split(" ");
            dataItem.firstName = dataItem.firstName || nameArr.shift();
            dataItem.lastName = dataItem.lastName || nameArr.join(" ");
            var contact = new Conatct_1.Contact(dataItem.id, dataItem.name, dataItem.parent, dataItem.firstName, dataItem.lastName, dataItem.phoneNumbers);
            this.addItem(contact);
        }
        else if (dataItem.type == "Group") {
            var group;
            if (dataItem.id == 0 || itemIndex == 0) {
                group = this;
            }
            else {
                group = new Group(dataItem.id, dataItem.name, dataItem.parent, []);
                this.addItem(group);
            }
            if (dataItem.numOfChildes > 0) {
                for (var subIndex = 0; subIndex < dataItem.numOfChildes; subIndex++) {
                    group.addJsonTree(dataObject);
                }
            }
        }
    };
    ;
    /**
     * A function that searches for a string match in all items and subItems
     *
     * @param searchStr  String to match
     * @param matchesArr Array for recursive reasons
     * @returns {*|Array}
     */
    Group.prototype.getItemsByName = function (searchStr, matchesArr) {
        matchesArr = matchesArr || [];
        if (this.name.indexOf(searchStr) != -1) {
            matchesArr.push(this);
        }
        if (this.items.length) {
            for (var itemIndex = 0, length = this.items.length; itemIndex < length; itemIndex++) {
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
    };
    /**
     * recursive search for a matched id
     * @param id
     * @returns {*|object}
     */
    Group.prototype.getItemById = function (id) {
        if (this.id == id) {
            return this;
        }
        if (this.items.length) {
            for (var itemIndex = 0, length = this.items.length; itemIndex < length; itemIndex++) {
                var subItem = this.items[itemIndex];
                if (subItem.id == id) {
                    return subItem;
                }
                if (subItem.items) {
                    var subGroup = subItem.getItemById(id);
                    if (subGroup && subGroup.id == id) {
                        return subGroup;
                    }
                }
            }
        }
    };
    ;
    /**
     * A search for an exact match on a name of a group
     * @param name
     * @returns {*| object}
     */
    Group.prototype.findGroupByExactName = function (name) {
        if (this.name == name) {
            return this;
        }
        else if (this.items.length) {
            for (var itemIndex = 0, length = this.items.length; itemIndex < length; itemIndex++) {
                var subItem = this.items[itemIndex];
                if (subItem.items && subItem.name == name) {
                    return subItem;
                }
            }
        }
    };
    return Group;
}(BookItem_1.BookItem));
exports.Group = Group;
//# sourceMappingURL=Group.js.map