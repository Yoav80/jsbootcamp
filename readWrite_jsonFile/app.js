var rl = require('readline-sync');
var fs = require('fs');

var root = null;
var currentGroup = null;
var nextId = 0;
var DATA_PATH = "./data.txt";

var Menu = {
    ADD_NEW_CONTACT: 1,
    ADD_NEW_GROUP: 2,
    CHANGE_CURRENT_GROUP: 3,
    PRINT: 4,
    PRINT_ALL: 5,
    FIND: 6,
    DELETE: 7,
    EXIT: 8
};

loadData();

function loadData(){
    if(!fs.existsSync(DATA_PATH)) {
        console.log("data file does not exist");
        initialise(false);
    }
    else {
        fs.readFile(DATA_PATH, 'utf8', handleData);
    }
}

function handleData(err,data){
    if (err) {
        console.error("error while loading data");
        console.error(err);
    }
    else {
        if (data) {

            console.log("data loaded, parsing...");

            var dataObject = {
                itemInDataIndex: 0,
                data:JSON.parse(data)
            };
            createItemsFromJson(dataObject, root);
        }
        else {
            console.error("data file is empty");
        }
    }
    initialise();
}

function createItemsFromJson(dataObject, parentGroup){

    var itemIndex = dataObject.itemInDataIndex++;
    var dataItem = dataObject.data[itemIndex];

    dataItem.parent = parentGroup;

    if (dataItem.type == "Contact"){
        dataItem.firstName = dataItem.name.split(" ")[0];
        dataItem.lastName = dataItem.name.split(" ")[1];

        var contact = createContact(dataItem);
        parentGroup.items.push(contact);
    }
    else if (dataItem.type == "Group") {
        var group = createGroup(dataItem);

        if (parentGroup === null){ //if root is null
            root = currentGroup = group;
        }
        else{
            parentGroup.items.push(group);
        }

        if (dataItem.numOfChildes > 0){
            for (var subIndex = 0; subIndex < dataItem.numOfChildes; subIndex++) {
                createItemsFromJson(dataObject, group);
            }
        }
    }
}

function initialise(){
    if (root === null) {
        var args = {
            name: "~"
        };
        root = currentGroup = createGroup(args);
    }

    while(true) {
        printMenu();

        var command = rl.question(currentGroup.name + "> ");
        handleCommand(command);
    }
}

function printMenu() {
    console.log();
    console.log("1) Add new contact");
    console.log("2) Add new group");
    console.log("3) Change current group");
    console.log("4) Print");
    console.log("5) Print All");
    console.log("6) Find");
    console.log("7) Delete");
    console.log("8) Exit");
}

function handleCommand(line) {
    var command = parseInt(line);

    if (command == Menu.ADD_NEW_CONTACT) {
        addNewContact();
    }
    else if(command == Menu.ADD_NEW_GROUP) {
        addNewGroup();
    }
    else if(command == Menu.CHANGE_CURRENT_GROUP) {
        changeCurrentGroup();
    }
    else if(command == Menu.PRINT) {
        print();
    }
    else if(command == Menu.PRINT_ALL) {
        printAll();
    }
    else if(command == Menu.FIND) {
        find();
    }
    else if(command == Menu.DELETE) {
        deleteItem();
    }
    else if(command == Menu.EXIT) {
        exit();
    }
}

function addNewContact(){
    var firstName = readNonEmptyString("First Name: ");
    var lastName = readNonEmptyString("Last Name: ");
    var phoneNumbers = [];

    while(true){
        var phoneNumber = rl.question("Phone Number (press enter when done): ");
        if(!phoneNumber){
            break;
        }
        phoneNumbers.push(phoneNumber);
    }

    var args = {
        firstName:firstName,
        lastName:lastName,
        phoneNumbers:phoneNumbers,
        parent:currentGroup
    };

    var contact = createContact(args);
    addItem(contact);
}

function addNewGroup(){
    var name = readNonEmptyString("Name: ");
    var args = {
        name:name
    };
    var group = createGroup(args);
    addItem(group);
}

function changeCurrentGroup(){
    var name = readNonEmptyString("Name: ");
    if(name == ".."){
        if(!currentGroup.parent){
            return;
        }

        currentGroup = currentGroup.parent;
    }
    else {
        var subGroup = findGroup(currentGroup, name);

        if(!subGroup){
            console.log("Group with name " + name + " was not found");
            return;
        }

        currentGroup = subGroup;
    }
}

function findGroup(group, name){
    for(var subGroupsIndex = 0; subGroupsIndex < group.items.length; subGroupsIndex++) {
        if (group.items[subGroupsIndex].name == name){
            return group.items[subGroupsIndex];
        }
    }
}

function print() {
    for(var index = 0; index < currentGroup.items.length; index++){
        var item = currentGroup.items[index];
        printItem(item);
    }
}

function printAll() {
    printSubItems(root,0);
}

function printSubItems(item,itr){
    var indent = "";

    for (var indentInd=0; indentInd<itr; indentInd++){
        indent += "\t";
    }
    itr++;

    if(item.type == "Group"){
        printItem(item , indent);
        for(var subGroupsIndex = 0; subGroupsIndex < item.items.length; subGroupsIndex++) {
            printSubItems(item.items[subGroupsIndex],itr);
        }
    }
    else{
        printItem(item , indent);
    }
}

function printItem(item,indent){
    if (!indent){
        indent = "";
    }
    if (item.type == "Group"){
        console.log(indent + "Group name: " + item.name
            + " , Group id: " + item.id);
    }
    else {
        console.log(indent + "--Contact name: "
            + item.firstName + " " + item.lastName
            + " , Contact Id: " + item.id
            + " , Phones: " + item.phoneNumbers);
    }
}

function find(){
    var str = readNonEmptyString("Enter search string: ");
    var matchesArr= [];

    findItemsByName(str,root,matchesArr);

    if (matchesArr.length == 0) {
        console.log("No matches");
        return;
    }

    for (var matchesIndex = 0 , length = matchesArr.length; matchesIndex < length; matchesIndex++){
        var item = matchesArr[matchesIndex];

        if (item.type == "Contact") {
            console.log("Contact Name: " + item.firstName + " " + item.lastName + " | Id: " + item.id);
        }
        else {
            console.log("Group Name: " + item.name + " | Id: " + item.id);
        }
    }
}

function deleteItem(){

    var id = Number(readNonEmptyString("ID: "));
    if (!id){
        console.log("id must be a number");
        return;
    }

    var item = findItemByID(id,root);

    if (item){
        var itemName = item.type == "Contact" ?
            "Contact " + item.firstName + " " + item.lastName :
            "Group " + item.name;

        var isSure = readNonEmptyString("Are you sure you want to delete " + itemName + ": [y/n]");
    }
    else{
        console.log("No item with that id was found");
        return;
    }

    if (isSure == "y"){
        //** method 2 for deleting
        var parentArr = item.parent.items;
        if (parentArr) {
            var indexToRemove = parentArr.indexOf(item);
            if (indexToRemove != -1) {
                parentArr.splice(indexToRemove, 1);
            }
        }

        //method one for deleting
        //var parent = item.parent;
        //for(var itemIndex in parent.items) {
        //    if (parent.items[itemIndex] === item){
        //        parent.items.splice(itemIndex,1);
        //        return;
        //    }
        //}
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

function findItemsByName(name,item,matchesArr){
    if (item.type == "Contact"){
        if (item.firstName == name || item.lastName == name){
            matchesArr.push(item);
        }
    }
    else {
        if (item.name == name){
            matchesArr.push(item);
        }
        else if (item.items && item.items.length > 0) {
            for (var itemIndex = 0; itemIndex < item.items.length; itemIndex++) {
                findItemsByName(name, item.items[itemIndex],matchesArr);
            }
        }
    }
}

function exit(){
    writeData();
    process.exit(0);
}

function writeData(){
    var dataToWrite = createFlatArr(root);
    dataToWrite = JSON.stringify(dataToWrite);

    var saved = fs.writeFileSync(DATA_PATH, dataToWrite , "utf8");
    if (saved == undefined){
        console.log("data saved");
    }
    else {
        console.log("error while saving data");
    }

    //app ends;
}

function createFlatArr(item, flatArray){
    var obj = {};

    if (flatArray == null) {
        flatArray = [];
    }

    if (item.type == "Group") {
        obj = {
            "type": item.type,
            "name": item.name,
            "numOfChildes": item.items.length,
            "id":item.id
        };
    }
    else{
        obj = {
            "type": item.type,
            "name": item.firstName + " " + item.lastName,
            "phoneNumbers": item.phoneNumbers,
            "id":item.id
        };
    }

    flatArray.push(obj);

    if(item.type == "Group" && item.items.length > 0){
        for(var subGroupsIndex = 0; subGroupsIndex < item.items.length; subGroupsIndex++) {
            createFlatArr(item.items[subGroupsIndex],flatArray);
        }
    }

    return flatArray;
}

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

function  createGroup(args) {
    return {
        id: args.id ? args.id : generateNextId(),
        name: args.name ? args.name : "",
        items: args.items ? args.items : [],
        type: "Group",
        parent: args.parent ? args.parent : currentGroup
    };
}

function addItem(item) {
    if (item.type == "Contact"){
        currentGroup.items.push(item);
        console.log(item.firstName + " " + item.lastName + " added");
    }
    else {
        var ifContains = !!~currentGroup.items.indexOf(item);
        if (ifContains){
            throw Error("Item with name " + item.name + " was already added to group: " + currentGroup.name);
        }
        else{
            currentGroup.items.push(item);
            currentGroup = item;
        }
    }
}

function generateNextId(){
    return nextId++;
}

function readNonEmptyString(message) {
    while(true) {
        var line = rl.question(message).trim();
        if(line){
            return line;
        }
    }
}

