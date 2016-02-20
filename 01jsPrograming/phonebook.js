/**
 * Created by y_mil on 2/9/2016.
 */
'use strict';

var readlineSync = require('readline-sync');

var ID = 0;
var currentGroup = null;
var root = null;
var contacts = [];
var groups = [];

var ADD_CONTACT = "1";
var ADD_NEW_GROUP = "2";
var CHANGE_CURRENT_GROUP = "3";
var PRINT_CURRENT_GROUP = "4";
var PRINT_ALL = "5";
var FIND = "6";
var DELETE = "7";
var EXIT = "8";

init();
addTestData();
displayMenu();

function init(){
    var group = {
        parentGroupId:-1,
        id:generateId(),
        name:'Root',
        type:'group'
    };
    groups.push(group);
    currentGroup = root = group;
}

function displayMenu(){
    var inputCmd = 0;
    while (inputCmd != EXIT) {
        var menu = [
            "Add new contact",
            "Add new group",
            "Change current group",
            "Print current group",
            "Print All",
            "Find",
            "Delete",
            "Exit"
        ];

        console.log();
        for (var menuIndex=0; menuIndex<menu.length; menuIndex++){
            console.log((menuIndex+1)+": " + menu[menuIndex]);
        }
        inputCmd = readlineSync.question(currentGroup.name + ">");

        switch (inputCmd){
            case ADD_CONTACT:
                handleAddContact();
                break;

            case ADD_NEW_GROUP:
                handleAddGroup();
                break;

            case CHANGE_CURRENT_GROUP:
                handleChangeCurrentGroup();
                break;

            case PRINT_CURRENT_GROUP:
                printCurrentGroup();
                break;

            case PRINT_ALL:
                printAll();
                break;

            case FIND:
                handleFind();
                break;

            case DELETE:
                handleDelete();
                break;

            case EXIT:
                break;

            default: //do nothing
                break;
        }
    }
}

function handleAddContact(){
    console.log();

    var contactFirstName = readlineSync.question("enter first name >");
    if (!contactFirstName){
        console.log("no name was entered");
        return;
    }

    var contactLastName = readlineSync.question("enter last name >");
    //not mandatory
    /*if (!contactLastName){
        console.log("nothing was entered");
        return;
    }*/

    var phoneNumbers = [];
    while(true) {
        var phone = readlineSync.question("enter phone number >");
        if (phone == "x"){
            if (phoneNumbers.length>0) {
                break;
            }
            else{
                console.log("no phone number was entered");
                return;
            }
        }
        else if (!phone){
            if (phoneNumbers.length>0) {
                break;
            }
            else{
                console.log("no phone number was entered");
                return;
            }
        }
        else if (Number(phone)) {
            phoneNumbers.push(phone);
        }
        else{
            console.log("please enter a valid number (digits only)");
        }
    }
    addContact(contactFirstName, contactLastName, phoneNumbers);
}

function addContact(firstName,lastName,phoneNumbers){
    var contact = {
        id:generateId(),
        firstName:firstName,
        lastName:lastName,
        phoneNums:phoneNumbers,
        groupId:currentGroup.id,
        type:"contact"
    };
    contacts.push(contact);
    console.log(contact.firstName + " " + contact.lastName + " Added!");
}

function handleAddGroup(){
    console.log();

    var newGroupName = readlineSync.question("enter group name >");
    if (!newGroupName){
        console.log("nothing was entered");
        return;
    }
    addGroup(newGroupName);
}

function addGroup(name){
    var group = {
        parentGroupId:currentGroup.id,
        id:generateId(),
        name:name,
        type:"group"
    };
    groups.push(group);
    currentGroup = group;
    console.log(group.name+ " Added!");
}

function handleChangeCurrentGroup(){
    console.log();

    var destination = readlineSync.question("enter group name ( '..' for parent group) >");
    if (!destination){
        console.log("nothing was entered");
        return;
    }
    changeCurrentGroup(destination);
}

function changeCurrentGroup(name){
    if (name == ".."){
        if (currentGroup != root) {
            currentGroup = findGroupById(currentGroup.parentGroupId);
        }
        else{
            //At the root - do nothing
            console.log("you are at the root.")
        }
    }
    else {
        var group = findGroupByName(name);
        if (group && group.parentGroupId == currentGroup.id){
            currentGroup = group;
        }
        else{
            console.log("no group with that name was found here");
        }
    }
}

function printAll(){
    console.log();
    printGroup(root,true);
}

function printCurrentGroup(){
    console.log();
    printGroup(currentGroup,false);
}

function printGroup(group,isRecursive,itr){
    var indent = "";
    itr = itr ? itr : 0;
    for (var indentInd=0; indentInd<itr; indentInd++){
        indent += "\t";
    }
    itr++;

    if (group === root) {
        console.log(root.name + ">");
    }
    else {
        console.log(indent + "\<GROUP\> name:" + group.name + " | id:" + group.id);
    }

    printGroupContacts(group.id, group.name, indent);

    var childGroup;
    for (var groupIndex=0;groupIndex<groups.length;groupIndex++) {
        childGroup = groups[groupIndex];
        if (childGroup.parentGroupId == group.id) {
            if (isRecursive) {
                printGroup(childGroup, true, itr);
            }
            else {
                console.log(indent + "\<GROUP\> name:" + childGroup.name + " | id:" + childGroup.id);
            }
        }
    }
}

function printGroupContacts(Id,thisGroup,indent) {
    var contact;
    for (var contactsIndex=0; contactsIndex<contacts.length; contactsIndex++){
        contact = contacts[contactsIndex];
        if (contact.groupId == Id){
            console.log(indent + "    \<CONTACT\> name:" + contact.firstName + " " + contact.lastName +
                " | phone numbers:" + contact.phoneNums.join(" , ") + " | id:" + contact.id);
        }
    }
}

function handleFind(){
    console.log();

    var what = readlineSync.question("enter name >");
    if (!what){
        console.log("nothing was entered");
        return;
    }
    find(what);
}

function find(str){
    var group;
    var contact;
    var findStr = str.toLowerCase();
    var match = false;

    for (var groupIndex=0; groupIndex<groups.length; groupIndex++){
        group = groups[groupIndex];
        if (group.name.toLowerCase() == str){
            match = true;
            console.log("\<GROUP\> name:" + group.name + " id:" + group.id);
        }
    }

    for (var contactsIndex=0; contactsIndex<contacts.length; contactsIndex++){
        contact = contacts[contactsIndex];
        if (contact.firstName == findStr || contact.lastName == findStr){
            match = true;
            console.log("\<CONTACT\> name:" + contact.firstName+ " " + contact.lastName +
                " | phone numbers:" + contact.phoneNums.join(" , ") + " | id:" + contact.id);
        }
    }
    if (!match){
        console.log("No group or contact was found");
    }
}

function handleDelete(){
    console.log();

    var idToDelete = readlineSync.question("enter id >");
    idToDelete = Number(idToDelete);

    if (!idToDelete){
        console.log("no valid id was entered.");
        return;
    }

    var groupToDelete = findGroupById(idToDelete);
    var contactIndexToDelete = findContactIndexById(idToDelete);

    if (!groupToDelete && !contactIndexToDelete){
        console.log("no item with that id was found");
        return;
    }
    else {
        var nameOfItemToDelete = groupToDelete ? "\<GROUP\> " + groupToDelete.name :
            "\<CONTACT\> " + contacts[contactIndexToDelete].firstName + " " + contacts[contactIndexToDelete].lastName;
    }

    while (!isSure) {
        var isSure = readlineSync.question("Are you sure you want to delete " + nameOfItemToDelete + " ? [y/n]");
    }

    if (isSure == "y"){
        if (groupToDelete) {
            deleteGroupByID(groupToDelete.id);
        }
        else {
            deleteContactByIndex(contactIndexToDelete);
        }
    }
}

function deleteGroupByID(idToDel){
    var group;
    var contact;
    for (var subGroupsIndex = 0; subGroupsIndex < groups.length; subGroupsIndex++) {
        group = groups[subGroupsIndex];
        if (group && group.parentGroupId == idToDel) {
            deleteGroupByID(group.id);
            subGroupsIndex--;
        }
    }
    for (var groupIndex=0; groupIndex<groups.length; groupIndex++){
        group = groups[groupIndex];
        if (group.id == idToDel){
            deleteContactsByGroupId(group.id);
            if (group === currentGroup){
                changeCurrentGroup("..");
            }
            console.log("deleting group: " + group.name);
            groups.splice(groupIndex, 1);
            groupIndex--;
        }
    }
}

function deleteContactByIndex(contactIndex){
    console.log("deleting contact: " + contacts[contactIndex].firstName + " " + contacts[contactIndex].lastName);
    contacts.splice(contactIndex, 1);
    return;
}

function deleteContactsByGroupId(groupId){
    for (var contactIndex=0; contactIndex<contacts.length; contactIndex++){
        if (contacts[contactIndex].groupId == groupId){
            deleteContactByIndex(contactIndex);
            contactIndex--;
        }
    }
    return;
}

function findGroupById(ID){
    for (var groupsIndex=0; groupsIndex<groups.length; groupsIndex++){
        if (groups[groupsIndex].id == ID){
            return groups[groupsIndex];
        }
    }
}

function findGroupByName(str){
    for (var groupsIndex=0; groupsIndex<groups.length; groupsIndex++){
        if (groups[groupsIndex].name.toLowerCase() == str){
            return groups[groupsIndex];
        }
    }
}

function findContactIndexById(ID){
    for (var contactIndex=0; contactIndex<contacts.length; contactIndex++){
        if (contacts[contactIndex].id == ID){
            return contactIndex;
        }
    }
}

function generateId(){
    return ID++;
}

function addTestData() {
    addContact('yoav', 'melkman', ['0542011802', '05555555']);
    addContact('joe', 'gggg', ['8787878', '7878787878']);
    addGroup("friends");
    changeCurrentGroup('..');
    addGroup("bffs");
    addContact('gg', 'melkman', ['0542011802', '05555555']);
    addContact('hh', 'gggg', ['8787878', '7878787878']);
    addGroup("the bff");
    addContact('bff', 'gggg', ['8787878', '7878787878']);
    addGroup("gg");
    changeCurrentGroup('..');
    changeCurrentGroup('..');
    addGroup("test2");
}
