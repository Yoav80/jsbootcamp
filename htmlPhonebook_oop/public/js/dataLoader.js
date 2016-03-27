var app = app || {};

app.DataLoader = (function () {

    function DataLoader() {
        'use strict';
        var _self = this;
    }

    /**
     * writes the phonebook tree to the local storage as a flat array of objects
     * @param root
     */
    DataLoader.prototype.writeDataToLocalStorage = function (root) {

        if (this.isStorageAvailable('localStorage')) {
            var dataToWrite = this.getFlatArrForJSON(root);
            dataToWrite = JSON.stringify(dataToWrite);

            localStorage.setItem('phonebookData', dataToWrite);
            return true;
        }
        return false;
    };


    /**
     * reads data from the local storage and returns it parsed
     * @returns {*}
     */
    DataLoader.prototype.readDataFromLocalStorage = function () {
        var dataToParse = null;
        if (this.isStorageAvailable('localStorage')) {
            dataToParse = localStorage.getItem('phonebookData');
            dataToParse = JSON.parse(dataToParse);
        }
        return dataToParse;
    };


    /**
     * A recursive functions that returns all items as objects
     * @param item - group to start
     * @param flatArray - an array passed from within to save results
     * @returns an array of all contacts and groups
     */
    DataLoader.prototype.getFlatArrForJSON = function (item, flatArray) {

        var obj = null;
        flatArray = flatArray || [];

        if (item instanceof app.Group) {
            obj = {
                "type": "Group",
                "name": item.name,
                "numOfChildes": item.items.length,
                "id": item.id
            };
        }
        else if (item instanceof app.Contact) {
            obj = {
                "type": "Contact",
                "name": item.firstName + " " + item.lastName,
                "phoneNumbers": item.phoneNumbers,
                "id": item.id
            };
        }

        if (obj) {
            flatArray.push(obj);
        }

        if (item instanceof app.Group && item.items.length > 0) {
            for (var subGroupsIndex = 0; subGroupsIndex < item.items.length; subGroupsIndex++) {
                this.getFlatArrForJSON(item.items[subGroupsIndex], flatArray);
            }
        }

        return flatArray;
    };


    /**
     * checks if localStorage is available
     * @param type - localstorage
     * @returns {boolean}
     */
    DataLoader.prototype.isStorageAvailable = function (type) {
        try {
            var storage = window[type],
                x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        }
        catch (e) {
            return false;
        }
    };

    return DataLoader;

})();