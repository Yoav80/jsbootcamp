var app = app || {};

app.Group = (function (app) {

    var _app = app;


    /**
     * @constructor function for creation of a group object
     *              inherits from the BookItem class
     *
     * @param args - name as string
     *             - parent as Group or null for the root
     *             - id as int if loaded from db
     *
     */
    function Group(args) {

        _app.BookItem.call(this, args.id, args.name);
        this.parent = args.parent;
        this.items = [];
    }
    Group.prototype = Object.create(_app.BookItem.prototype);


    /**
     * A function that adds an item to the items array
     * (cannot add duplicate items)
     *
     * @param item - object, instance of Group or Contact
     *
     */
    Group.prototype.addItem = function (item) {

        if (item instanceof _app.Contact || item instanceof _app.Group) {
            if (this.items.indexOf(item) != -1) {
                console.error("duplicate item: " + item.name + " in group: " + this.name);
                throw new Error("duplicate item cannot be added to a group");
            }
            else {
                console.log("adding: " + item.getName());
                item.parent = this;
                this.items.push(item);
            }
        }

        EventBus.dispatch("dataChanged", this);
    };


    /**
     * A function that converts json objects to Groups and contacts
     *
     * @param dataObject - data as JSON data of groups and contacts
     *                   - itemInDataIndex as int, for keeping track of the current json object being read
     *
     */
    Group.prototype.addJsonTree = function (dataObject) {
        var itemIndex = dataObject.itemInDataIndex++;
        var dataItem = dataObject.data[itemIndex];
        dataItem.parent = this;

        if (dataItem.type == "Contact") {
            var nameArr = dataItem.name.split(" ");
            dataItem.firstName = dataItem.firstName || nameArr.shift();
            dataItem.lastName = dataItem.lastName || nameArr.join(" ");

            var contact = new _app.Contact(dataItem);
            this.addItem(contact);
        }
        else if (dataItem.type == "Group") {
            var group;

            if (dataItem.id == 0 || itemIndex == 0) {
                group = this;
            }
            else {
                group = new _app.Group(dataItem);
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
    Group.prototype.getItemsByName = function (searchStr, matchesArr) {

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
    Group.prototype.getItemById = function (id) {
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
    }

    /**
     * A search for an exact match on a name of a group
     * @param name
     * @returns {*| object}
     */
    Group.prototype.findGroupByExactName = function (name) {
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

    return Group;
})(app);