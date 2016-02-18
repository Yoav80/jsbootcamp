/**
 * Created by y_mil on 2/9/2016.
 */
'use strict';

//var Table = require('cli-table');
var readlineSync = require('readline-sync');

var ID = 0;
var currentGroup = null;
var root = null;
var contacts = [];
var groups = [];

var ADD_CONTACT = "0";
var ADD_NEW_GROUP = "1";
var CHANGE_CURRENT_GROUP = "2";
var PRINT_CURRENT_GROUP = "3";
var PRINT_ALL = "4";
var FIND = "5";
var DELETE = "6";
var EXIT = "7";

init();
initialData();
displayMenu();

function init(){
    var group = {
        parentGroupId:-1,
        id:generateId(),
        name:'Root',
        type:'group'
    };
    groups.push(group);
    currentGroup = group;
    root = group;
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
            console.log(menuIndex+": " + menu[menuIndex]);
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
    var contactNumbers = [];

    while (!contactFirstName) {
        var contactFirstName = readlineSync.question("First name?");
    }
    while(!contactLastName) {
        var contactLastName = readlineSync.question("Last name?");
    }
    while(true) {
        var numInput = readlineSync.question("phone number? (end with 'x')");
        if (numInput == "x"){
            if (contactNumbers.length>0) {
                break;
            }
            else{
                console.log("at least one number has to be entered");
            }
        }
        else{
            if (Number(numInput)) {
                contactNumbers.push(numInput);
            }
            else{
                console.log("please enter a valid number");
            }
        }
    }
    addContact(contactFirstName, contactLastName, contactNumbers);
}

function addContact(firstName,lastName,phonenums){
    var contact = {
        id:generateId(),
        firstName:firstName,
        lastName:lastName,
        phoneNums:phonenums,
        groupId:currentGroup.id,
        type:"contact"
    };
    contacts.push(contact);
    console.log(contact.firstName + " " + contact.lastName + " Added!");
}

function handleAddGroup(){
    console.log();
    while (!newGroupName) {
        var newGroupName = readlineSync.question("Group name?");
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
    while (!destination) {
        var destination = readlineSync.question("where to?");
    }
    changeCurrentGroup(destination);
}

function changeCurrentGroup(name){
    if (name == ".."){
        if (currentGroup != root) {
            currentGroup = findGroupById(currentGroup.parentGroupId);
        }
        else{
            //At root - do nothing
            console.log("you are at the root.")
        }
    }
    else {
        var group = findGroupByName(name);
        if (group && group.parentGroupId == currentGroup.id){
            currentGroup = group;
        }else{
            console.log("no group with that name was found");
        }
    }
}

function printAll(){
    console.log();
    printGroup(root,true,0);
}

function printCurrentGroup(){
    console.log();
    printGroup(currentGroup,false,0);
}

function printGroup(group,isRecursive,itr){
    var indent = "";

    for (var indentInd=0; indentInd<itr; indentInd++){
        indent += "\t";
    }
    itr++;

    if (group == root || !isRecursive) {
        printGroupContacts(group.id, group.name, indent);
    }
    else {
        console.log(indent + "\<group\> " + group.name);
        printGroupContacts(group.id, group.name, indent);
    }

    var childGroup;
    for (var groupIndex=0;groupIndex<groups.length;groupIndex++) {
        childGroup = groups[groupIndex];
        if (childGroup.parentGroupId == group.id) {
            if (isRecursive) {
                printGroup(childGroup, true, itr);
            }
            else{
                console.log(indent + "\<group\> " + childGroup.name);
            }
        }
    }
}

function printGroupContacts(Id,thisGroup,indent) {
    var contact;

    for (var contactsIndex=0; contactsIndex<contacts.length; contactsIndex++){
        contact = contacts[contactsIndex];
        if (contact.groupId == Id){
            console.log(indent + "    \<contact\> " + contact.firstName +" "+contact.lastName +" :: "+contact.phoneNums.join(" , "));
        }
    }
}

function handleFind(){
    console.log();
    while (!what) {
        var what = readlineSync.question("what?");
    }
    find(what);
}

function find(str){
    if (!str) {
        console.log("No string was passed");
        return;
    }

    var group;
    var contact;
    var matchesTable = new Table();
    matchesTable.push(["Full Name","Phone number","Id","Type"]);
    var findStr = str.toLowerCase();

    for (var groupIndex=0; groupIndex<groups.length; groupIndex++){
        group = groups[groupIndex];
        if (group.name.toLowerCase() == str){
            matchesTable.push([group.name,group.type,group.id]);
        }
    }

    for (var contactsIndex=0; contactsIndex<contacts.length; contactsIndex++){
        contact = contacts[contactsIndex];
        if (contact.firstName == findStr || contact.lastName == findStr){
            matchesTable.push([contact.firstName+ " " + contact.lastName,contact.phoneNums.join(" , "), contact.id, contact.type]);
        }
    }
    if (matchesTable.length>1){
        console.log("Found the next matches::");
        console.log(matchesTable.toString());
    }else{
        console.log("No group or contact was found");
    }
}

function deleteContactByGroupId(idToDel){
    for (var contactsIndex=0; contactsIndex<contacts.length; contactsIndex++){
        if (contacts[contactsIndex].groupId == idToDel){
            console.log("deleting contact: " + contacts[contactsIndex].id);
            contacts.splice(contactsIndex, 1);
            --contactsIndex;
        }
    }
    return 0;
}

function deleteContact(idTodel){
    var indOfcontactToDel = findContactById(idTodel);
    if (indOfcontactToDel){
        console.log("deleting contact: " + idTodel);
        contacts.splice(indOfcontactToDel, 1);
    }else{
        console.log("No contact with that id was found.");
    }
}

function handleDelete(){
    console.log();
    while (!idToDelete) {
        var idToDelete = readlineSync.question("which id?");
    }
    if (!Number(idToDelete)){
        console.log("Please enter a number");
        handleDelete();
    }
    while (!isSure) {
        var isSure = readlineSync.question("Are you sure? [y/n]");
    }
    if (isSure == "y"){
        deleteItemByID(idToDelete);
    }else{
        return;
    }
}

function deleteItemByID(idToDel){
    var group;
    var found = false;
    idToDel = Number(idToDel);
    if (!idToDel) {
        console.log("No ID was passed");
        return;
    }
    else{
        console.log("Searching id: "+idToDel);
    }

    for (var contactsIndex=0; contactsIndex<contacts.length; contactsIndex++){
        var contact = contacts[contactsIndex];
        if (contact.id == idToDel){
            console.log("deleting contact: " + contact.firstName + " " + contact.lastName);
            contacts.splice(contactsIndex, 1);
            return 0;
        }
    }

    for (var groupIndex=0; groupIndex<groups.length; groupIndex++){
        group = groups[groupIndex];
        if (group.id == idToDel){
            found = true;
            deleteContactByGroupId(group.id);
            console.log("deleting group: " + group.name);
            if (group === currentGroup){
                changeCurrentGroup("..");
            }
            groups.splice(groupIndex, 1);
            groupIndex--;
        }
    }

    if (found) {
        for (var subGroupsIndex = 0; subGroupsIndex < groups.length; subGroupsIndex++) {
            group = groups[subGroupsIndex];
            if (group && group.parentGroupId == idToDel) {
                deleteItemByID(group.id);
                subGroupsIndex--;
            }
        }
    }
    else{
        console.log("could'nt find an item with that id.")
    }
}

function generateId(){
    return ID++;
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

function findContactById(ID){
    for (var contactIndex=0; contactIndex<contacts.length; contactIndex++){
        if (contacts[contactIndex].id == ID){
            return contactIndex;
        }
    }
}

function initialData() {
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

    //printCurrentGroup();
    //printAll();
    //find("gg");
    //deleteItemByID(3);
    //printAll();
    //deleteItemByID(2);
}
