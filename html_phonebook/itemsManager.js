
var phoneBook = phoneBook || {};

phoneBook.itemsManager = ( function(){
    'use strict';

    var nextId = 0;
    var root = null;
    var currentGroup = null;

    var SAVE_DATA_SUCCESS_MSG = "phonebook was saved successfully! ";
    var SAVE_DATA_ERROR_MSG = "ERROR saving data";

    return {
        initialise: initialise,
        changeCurrentGroup: changeCurrentGroup,
        getCurrentGroupContacts: getCurrentGroupContacts,
        findItemsByName: findItemsByName,
        deleteItem: deleteItem,
        addNewContact: addNewContact,
        addNewGroup: addNewGroup,
        getAllItems: getAllItems,
        save: saveData,
        getDataObj:getDataObj,
        getCurrentGroup:getCurrentGroup,
        loadDefaults:loadDefaults
    };

    /**
     * the items manager start up function.
     * set the phone book root object,
     * either by reading JSON or creating an empty root
     */
    function initialise(){
        var jsonData = phoneBook.dataManager.readData();
        if (jsonData) {
            var dataObject = {
                itemInDataIndex: 0,
                data:jsonData
            };
            root = currentGroup = createItemsFromJson(dataObject);
        }
        else {
            console.error("Error loading data");
            loadDefaults();
        }
    }

    /**
     * creates the tree of objects from  JSON array of objects
     *
     * @param dataObject - an object containing flat JSON objects,
     *        and an index to keep count on the current object being read.
     * @param parentGroup - pass null to start from top
     * @returns {items} - an object containing all items - root
     */
    function createItemsFromJson(dataObject, parentGroup ){

        var items = null;
        var itemIndex = dataObject.itemInDataIndex++;
        var dataItem = dataObject.data[itemIndex];
        dataItem.parent = parentGroup;

        if (dataItem.type == "Group") {
            var group = createGroup(dataItem);

            if (parentGroup == null) {
                items = group;
            }
            else{
                parentGroup.items.push(group);
            }

            if (dataItem.numOfChildes > 0) {
                for (var subIndex = 0; subIndex < dataItem.numOfChildes; subIndex++) {
                    createItemsFromJson(dataObject, group);
                }
            }
        }
        else if (dataItem.type == "Contact") {
            dataItem.firstName = dataItem.name.split(" ")[0];
            dataItem.lastName = dataItem.name.split(" ")[1];

            var contact = createContact(dataItem);
            parentGroup.items.push(contact);
        }

        return items;
    }

    /**
     *
     * @param group - the group to change to
     */
    function changeCurrentGroup(group){
        if(!group) {
            return;
        }

        if (group == ".." && currentGroup != root){
            currentGroup = currentGroup.parent;
        }
        else {
            currentGroup = group;
        }
    }

    /**
     * A recursive search on all items by string
     * @param searchStr - string to match
     * @param item - the group object to run on
     * @param matchesArr - for recursive purposes, the array that returns
     * @returns {*|Array}
     */
    function findItemsByName(searchStr, item, matchesArr){

        matchesArr = matchesArr || [];
        item = item || root;

        if (item.type == "Contact"){
            if (item.firstName == searchStr || item.lastName == searchStr){
                matchesArr.push(item);
            }
        }
        else {
            if (item.name == searchStr){
                matchesArr.push(item);
            }
            if (item.items && item.items.length > 0) {
                for (var itemIndex = 0; itemIndex < item.items.length; itemIndex++) {
                    findItemsByName(searchStr, item.items[itemIndex],matchesArr);
                }
            }
        }
        return matchesArr;
    }

    /**
     *
     * @param id
     * @param item - the group object to run on, recursive
     * @returns {*}
     */
    function findItemByID(id,item){
        item = item || root;

        if (item.id == id){
            return item;
        }
        if (item.items) {
            for (var itemIndex = 0 , length = item.items.length; itemIndex < length; itemIndex++) {
                var subItem = findItemByID(id, item.items[itemIndex]);
                if (subItem){
                    return subItem;
                }
            }
        }
    }

    /**
     *
     * @returns {Array} of items of the current group
     */
    function getCurrentGroupContacts(){
        var contactsArr = [];
        var currentItems = currentGroup.items;

        for(var index = 0; index < currentItems.length; index++){
            var item = currentItems[index];
            if (item.type == "Contact") {
                contactsArr.push(item);
            }
        }
        return contactsArr;
    }

    /**
     * returns all the phone book items as an array
     * @param item - the group object to run on
     * @param itr - for recursive purposes to create a tree indent
     * @param allItemsArr - for recursive purposes, the array that returns
     * @returns {*|Array}
     */
    function getAllItems(item, itr, allItemsArr){
        allItemsArr = allItemsArr || [];
        item = item || root;
        itr = itr || 0;

        if (!item) {
            return allItemsArr;
        }

        var indent = "";
        for (var indentInd=0; indentInd<itr; indentInd++){
            indent += "\t";
        }
        itr++;

        if(item.type == "Contact"){
            allItemsArr.push({item:item , indent:indent});
        }
        else{
            allItemsArr.push({item:item , indent:indent});
            for(var subGroupsIndex = 0; subGroupsIndex < item.items.length; subGroupsIndex++) {
                getAllItems(item.items[subGroupsIndex], itr, allItemsArr);
            }
        }
        return allItemsArr;
    }

    /**
     * Delete an item by id
     * @param id
     */
    function deleteItem(id){

        var item = findItemByID(id);

        if (item == root){
            alert("The root of phonebook cant be deleted");
            return;
        }

        if (item){
            var itemName = item.type == "Contact" ?
                "Contact " + item.firstName + " " + item.lastName :
                "Group " + item.name;

            var isSure = confirm("delete " + itemName + "?");
        }
        else{
            alert("No item with that id was found");
            return false;
        }

        if (isSure){
            if (item == currentGroup) {
                currentGroup = item.parent;
            }
            var parentArr = item.parent.items;
            if (parentArr) {
                var indexToRemove = parentArr.indexOf(item);
                if (indexToRemove != -1) {
                    parentArr.splice(indexToRemove, 1);
                }
            }
        }

        saveData();
        return true;
    }

    /**
     * Adds an item to the current group
     * @param item
     */
    function addItem(item) {
        if (item.type == "Contact"){
            currentGroup.items.push(item);
        }
        else {
            if (currentGroup.items.length > 0 && currentGroup.items.indexOf(item) != -1){
                alert("Item with name " + item.name + " was already added to group: " + currentGroup.name);
                console.error("Item with name " + item.name + " was already added to group: " + currentGroup.name);
            }
            else{
                currentGroup.items.push(item);
                currentGroup = item;
            }
        }

        saveData();
    }

    /**
     *
     * @param args - object with all contact properties
     */
    function addNewContact(args){
        var contact = createContact(args);
        addItem(contact);
    }

    /**
     *
     * @param args - object with all contact properties
     * @returns {object}  - contact
     */
    function createContact(args) {
        return {
            id: args.id ? args.id : generateNextId(),
            firstName: args.firstName ? args.firstName : "",
            lastName: args.lastName ? args.lastName : "",
            phoneNumbers: args.phoneNumbers ? args.phoneNumbers : [],
            parent: args.parent ? args.parent : currentGroup,
            type:"Contact"
        };
    }

    /**
     *
     * @param args - object with all group properties
     */
    function addNewGroup(args){
        var contact = createGroup(args);
        addItem(contact);
    }

    /**
     *
     * @param args - object with all group properties
     * @returns {object}  - group
     */
    function createGroup(args) {
        var id = args.id != undefined ? args.id : generateNextId();
        return {
            id: id,
            name: args.name ? args.name : "",
            items: args.items ? args.items : [],
            type: "Group",
            parent: args.parent ? args.parent : currentGroup
        };
    }

/* helpers  */

    /**
     * @returns {number}
     */
    function generateNextId(){

        var allItemsArr = getAllItems();
        allItemsArr.sort(function(a, b){
            return a.item.id > b.item.id;
        });

        if (allItemsArr.length) {
            nextId = allItemsArr[allItemsArr.length - 1].item.id + 1;
        }

        return nextId++;
    }

    /**
     * call data manager to save
      */
    function saveData(){
        var writeSuccess = phoneBook.dataManager.writeData(root);
        if (writeSuccess) {
            console.log(SAVE_DATA_SUCCESS_MSG);
        }
        else {
            console.log(SAVE_DATA_ERROR_MSG);
        }
    }

    /**
     * getter - root
     * @returns {object}
     */
    function getDataObj(){
        return root;
    }

    /**
     * getter - current group
     * @returns {object}
      */
    function getCurrentGroup(){
        return currentGroup;
    }

    /**
     * loads a ready to use tree in case there's no JSON or when reset to "default" is pressed
     */
    function loadDefaults() {
        var args = {
            name: "PhoneBook"
        };

        nextId = 0;
        root = currentGroup = null;
        root = currentGroup = createGroup(args);
        initialData();
    }

    /**
     * loads ready to use tree items for debug
     */
    function initialData() {

        // ---- test data ---- //
        addItem(createContact({firstName: 'yoav',lastName: 'melkman',phoneNumbers: ['0542011802', '65665']}));
        addItem(createContact({firstName: 'eran',lastName: 'melkman',phoneNumbers: ['34', '05555555']}));

        addItem(createGroup({name: "friends"}));

        addItem(createContact({firstName: 'joe',lastName: 'retre',phoneNumbers: ['3534', '12313']}));
        addItem(createContact({firstName: 'yuval',lastName: 'ert',phoneNumbers: ['0542011802', '123', '234234']}));

        addItem(createGroup({name: "best friends"}));

        addItem(createContact({firstName: 'dani',lastName: 'miller',phoneNumbers: ['234627', '05555555']}));
        addItem(createContact({firstName: 'omer',lastName: 'cohen',phoneNumbers: ['66', '77']}));

        changeCurrentGroup("..");
        changeCurrentGroup("..");

        addItem(createGroup({name: "classmates"}));

        addItem(createContact({firstName: 'eyal',lastName: 'masheu',phoneNumbers: ['345', '6575676576']}));
        addItem(createContact({firstName: 'bar',lastName: 'tesler',phoneNumbers: ['234', '45345424']}));

        // -----------end--------------//

        changeCurrentGroup(root);
    }

})();