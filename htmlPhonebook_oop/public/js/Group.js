var app = app || {};

app.Group = (function (app) {

    var _app = app;

    function Group(args) {

        _app.BookItem.call(this, args.id, args.name);
        this.parent = args.parent;
        this.items = [];
    }

    Group.prototype = Object.create(_app.BookItem.prototype);
    //_app.DomHelpers.inherit(Group, _app.BookItem);

    Group.prototype.addItem = function (item) {

        if (item instanceof _app.Contact || item instanceof _app.Group) {
            if (this.items.indexOf(item) != -1) {

                alert("Item with name " + item.name + " was already added to group: " + this.name);
                console.error("Item with name " + item.name + " was already added to group: " + this.name);
            }
            else {
                console.log("adding: " + item.getName());
                this.items.push(item);
            }
        }

        EventBus.dispatch("dataChanged", this);
    };

    Group.prototype.addJsonTree = function (dataObject , append) {
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

            if (dataItem.id == 0 || dataItem.name == "PhoneBook") {
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
        EventBus.dispatch("dataChanged", this);
    };

    Group.prototype.destroy = function (id) {
        var arr = this.parent.items;
        var ind = arr.indexOf(this);
        arr.splice(ind, 1);
        EventBus.dispatch("dataChanged", this);
    }

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

    return Group;
})(app);