var app = app || {};

app.PhoneBookClass = (function (app) {

    /**
     * The Phone Book construction function.
     * set the phone book root object, and fill it
     * either by reading JSON or by creating a default tree.
     */

    var _app = app;

    function PhoneBook() {
        'use strict';

        this.dataLoader = new _app.DataLoader();
        this.root = new _app.Group({name: "PhoneBook"});

        var jsonData = this.dataLoader.readDataFromLocalStorage();
        if (!jsonData) {
            console.error("Error loading data, loading defaults");
        }
        this.setData(jsonData);
    }

    PhoneBook.prototype.setData = function (jsonData) {
        jsonData = jsonData || this.getDefaults();
        var dataObject = {
            itemInDataIndex: 0,
            data: jsonData
        };

        _app.BookItem.setId(0);
        this.root.items = [];
        this.root.addJsonTree(dataObject);

        EventBus.dispatch("dataChanged", this);
    }

    PhoneBook.prototype.getDefaults = function () {

        var defaultJSON = '  [{"type":"Group","name":"PhoneBook","numOfChildes":4},' +
            '{"type":"Contact","name":"yoav melkman","phoneNumbers":["0542011802","65665"]},' +
            '{"type":"Contact","name":"eran melkman","phoneNumbers":["34","05555555"]},' +
            '{"type":"Group","name":"friends","numOfChildes":3},' +
            '{"type":"Contact","name":"joe retre","phoneNumbers":["3534","12313"]},' +
            '{"type":"Contact","name":"yuval ert","phoneNumbers":["0542011802","123","234234"]},' +
            '{"type":"Group","name":"best friends","numOfChildes":2},' +
            '{"type":"Contact","name":"dani miller","phoneNumbers":["234627","05555555"]},' +
            '{"type":"Contact","name":"omer cohen","phoneNumbers":["66","77"]},' +
            '{"type":"Group","name":"classmates","numOfChildes":2},' +
            '{"type":"Contact","name":"eyal masheu","phoneNumbers":["345","6575676576"]},' +
            '{"type":"Contact","name":"bar tesler","phoneNumbers":["234","45345424"]}]';

        return JSON.parse(defaultJSON);
    };

    PhoneBook.prototype.handleDataChanged = function (event, scope) {

        var res = this.dataLoader.writeDataToLocalStorage(this.root);
        console.log("save data on change!", this.root);

    };

    return PhoneBook;
})(app);