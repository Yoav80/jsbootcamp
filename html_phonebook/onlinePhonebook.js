/**
 * Created by y_mil on 2/18/2016.
 */

var ID = 0;
var currentGroup = null;
var root = null;
var contacts = [];
var groups = [];

init();
initialData();
createSideMenu();
populateContactsTable();


function init() {
    var group = {
        parentGroupId: -1,
        id: generateId(),
        name: 'PhoneBook',
        type: 'group'
    };
    groups.push(group);
    currentGroup = group;
    root = group;
}

function createSideMenu(){

    var wrapper = document.getElementById("directory");
    var directoryUl = document.createElement("ul");
    directoryUl.id = "directoryUl";
    wrapper.insertBefore(directoryUl,wrapper.firstChild);
    createDirectoryItem(root,0,directoryUl);

}

function updateDisplay(){
    document.getElementById("currentGroupName").innerText = currentGroup.name;
    populateContactsTable();
}

function createDirectoryItem(group,itr,parent){
    var indent = "";
    for (var indentInd=0; indentInd<itr; indentInd++){
        indent += "- ";
    }
    itr++;

    var li = document.createElement("li");
    li.id = group.id;
    li.innerText = indent + group.name;
    li.onclick = directoryItemClick(group);
    parent.appendChild(li);

    var childGroup;
    for (var groupIndex=0; groupIndex<groups.length; groupIndex++){
        childGroup = groups[groupIndex];
        if (childGroup.parentGroupId == group.id) {
            var childeUl = document.createElement("ul");
            parent.appendChild(childeUl);
            createDirectoryItem(childGroup,itr,childeUl);
        }
    }
}

function directoryItemClick(group){
        return function(){
        changeCurrentGroup(group.name);
    }
}

function populateContactsTable(){

    var contactsArr = getCurrentGroupContacts();
    var contactTable = document.getElementById("contactsTableBody");
    contactTable.innerHTML = "";
    var contact;

    for (var contactIndex=0; contactIndex<contactsArr.length; contactIndex++){

        contact = contactsArr[contactIndex];
        var row = contactTable.insertRow(0);
        row.insertCell(0).innerHTML = contact.id;
        row.insertCell(1).innerHTML = contact.firstName;
        row.insertCell(2).innerHTML = contact.lastName;
        row.insertCell(3).innerHTML = contact.phoneNums.join(" , ");
        row.insertCell(4).innerHTML = "action";
    }
}

function getCurrentGroupContacts(){
    var contactsArr = [];
    for (var contactIndex=0; contactIndex<contacts.length; contactIndex++){
        if (contacts[contactIndex].groupId == currentGroup.id){
            contactsArr.push(contacts[contactIndex]);
        }
    }
    return contactsArr;
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
        if (group){
            currentGroup = group;
            updateDisplay();
        }else{
            console.log("no group with that name was found");
        }
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
        if (groups[groupsIndex].name.toLowerCase() == str.toLowerCase()){
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
    //addGroup("test2");
}