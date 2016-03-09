/**
 * Created by y_mil on 3/6/2016.
 */

phoneBook = phoneBook || {};

phoneBook.dataManager = (function () {
    'use strict';
    return {
        writeData:writeData,
        readData:readData
    };

    /**
     * writes the phonebook tree to the local storage as a flat array of objects
     * @param root
     */
    function writeData(root) {
        if (storageAvailable('localStorage')) {
            var dataToWrite = createFlatArr(root);
            dataToWrite = JSON.stringify(dataToWrite);
            localStorage.setItem('phonebookData',dataToWrite);
            return true;
        }
        return false;
    }

    /**
     * reads data from the local storage and returns it parsed
     * @returns {*}
     */
    function readData() {
        var dataToParse = null;
        if (storageAvailable('localStorage')) {
            dataToParse = localStorage.getItem('phonebookData');
            dataToParse = JSON.parse(dataToParse);
        }
        return dataToParse;
    }
    /**
     * A recursive functions that returns all items as objects
     * @param item - group to start
     * @param flatArray - an array passed from within to save results
     * @returns an array of all contacts and groups
     */
    function createFlatArr(item, flatArray) {
        var obj = {};

        flatArray = flatArray || [];

        if (item.type == "Group") {
            obj = {
                "type": item.type,
                "name": item.name,
                "numOfChildes": item.items.length,
                "id": item.id
            };
        }
        else {
            obj = {
                "type": item.type,
                "name": item.firstName + " " + item.lastName,
                "phoneNumbers": item.phoneNumbers,
                "id": item.id
            };
        }

        flatArray.push(obj);

        if (item.type == "Group" && item.items.length > 0) {
            for (var subGroupsIndex = 0; subGroupsIndex < item.items.length; subGroupsIndex++) {
                createFlatArr(item.items[subGroupsIndex], flatArray);
            }
        }

        return flatArray;
    }

    /**
     * checks if localStorage is available
     * @param type - localstorage
     * @returns {boolean}
     */
    function storageAvailable(type) {
        try {
            var storage = window[type],
                x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        }
        catch(e) {
            return false;
        }
    }
})();