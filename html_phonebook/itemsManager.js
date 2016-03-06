/**
 * Created by y_mil on 3/2/2016.
 */
phoneBook = phoneBook || {};

phoneBook.itemsManager = ( function(){

    this.nextId = 0;

    return {
        initialise: initialise,
        changeCurrentGroup: changeCurrentGroup,
        getCurrentGroupContacts:getCurrentGroupContacts,
        findItemsByName:findItemsByName,
        deleteItem:deleteItem,
        addNewContact:addNewContact,
        addNewGroup:addNewGroup,
        getAllItems:getAllItems
    };

    function initialise(){
        if (phoneBook.root === null) {
            var args = {
                name: "PhoneBook"
            };
            phoneBook.root = phoneBook.currentGroup = createGroup(args);
        }

        initialData();
    }

    function changeCurrentGroup(group){

        var currentGroup = phoneBook.currentGroup;

        if(!group) {
            return;
        }

        if (group == ".." && currentGroup != phoneBook.root){
            changeCurrentGroup(currentGroup.parent);
            return;
        }

        phoneBook.currentGroup = group;
    }

    function findItemsByName(searchStr, item, matchesArr){
        if (!matchesArr) {
            matchesArr = [];
        }
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

    function getCurrentGroupContacts(){
        var contactsArr = [];
        var currentGroup = phoneBook.currentGroup.items;

        for(var index = 0; index < currentGroup.length; index++){
            var item = currentGroup[index];
            if (item.type == "Contact") {
                contactsArr.push(item);
            }
        }
        return contactsArr;
    }

    function getAllItems(item, itr, allItemsArr){
        if (!allItemsArr) {
            allItemsArr = [];
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

    function addItem(item) {
        var currGroup = phoneBook.currentGroup;

        if (item.type == "Contact"){
            currGroup.items.push(item);
            console.log(item.firstName + " " + item.lastName + " added");
        }
        else {
            if (currGroup.items.length > 0 && currGroup.items.indexOf(item) != -1){
                throw Error("Item with name " + item.name + " was already added to group: " + currGroup.name);
            }
            else{
                currGroup.items.push(item);
                phoneBook.currentGroup = item;
            }
        }
    }

    function deleteItem(id){
        var item = findItemByID(id,phoneBook.root);

        if (item == phoneBook.root){
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
            return;
        }

        if (isSure){
            var parentArr = item.parent.items;
            if (parentArr) {
                var indexToRemove = parentArr.indexOf(item);
                if (indexToRemove != -1) {
                    parentArr.splice(indexToRemove, 1);
                }
            }
        }
    }

    function findItemByID(id,item){
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

    function addNewContact(args){
        var contact = createContact(args);
        addItem(contact);
    }

    function addNewGroup(args){
        var contact = createGroup(args);
        addItem(contact);
    }

    function createContact(args) {
        return {
            id: args.id ? args.id : generateNextId(),
            firstName: args.firstName ? args.firstName : "",
            lastName: args.lastName ? args.lastName : "",
            phoneNumbers: args.phoneNumbers ? args.phoneNumbers : [],
            parent: args.parent ? args.parent : phoneBook.currentGroup,
            type:"Contact"
        };
    }

    function createGroup(args) {
        return {
            id: args.id ? args.id : generateNextId(),
            name: args.name ? args.name : "",
            items: args.items ? args.items : [],
            type: "Group",
            parent: args.parent ? args.parent : phoneBook.currentGroup
        };
    }

    function generateNextId(){
        return this.nextId++;
    }

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

        changeCurrentGroup(phoneBook.root);
    }

})();