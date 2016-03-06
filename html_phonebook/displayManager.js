/**
 * Created by y_mil on 3/2/2016.
 */
phoneBook = phoneBook || {};

phoneBook.displayManager = (function (){

    var DEFAULT_VIEW = "contactsTable";
    var parent = null;
    //var lastView;

    var GROUP_CONTACTS_TABLE_ID = "contactsTable";
    var SEARCH_RESULTS_TABLE_ID = "searchResults";
    var NEW_CONTACT_FORM_ID = "NewContactForm";
    var NEW_GROUP_FORM_ID = "NewGroupForm";
    var DELETE_FORM_ID = "deleteForm";
    var SHOW_ALL_TABLE_ID = "allItemsTable";

    var FIRST_NAME_ERROR_MSG = "first name is required";
    var LAST_NAME_ERROR_MSG = "last name is required too";
    var PHONES_ERROR_MSG = "at least one phone has to be entered";
    var PHONES_ERROR_MSG2 = "please enter only numbers";
    var GROUP_NAME_ERROR_MSG = "group name is required";
    var DELETE_ID_ERROR_MSG = "invalid id";
    
    return {
        initialise: initialise
    };

    function initialise(thisParent){
        parent = thisParent;

        createSideMenu();
        setHandlers();
        renderDisplay();
    }

    /* builders */
    function createSideMenu() {

        var wrapper = document.getElementById("directory");
        wrapper.innerHTML = "";
        var directoryUl = document.createElement("ul");
        directoryUl.id = "directoryUl";
        wrapper.insertBefore(directoryUl,wrapper.firstChild);

        createSideMenuItem(phoneBook.root,0,directoryUl);
    }

    function createSideMenuItem(group,itr,parent) {

        var indent = "";
        for (var indentInd=0; indentInd<itr; indentInd++){
            indent += "- ";
        }
        itr++;

        var li = document.createElement("li");
        li.id = "treeGroup" + group.id;
        li.innerText = indent + group.name;
        li.addEventListener("click", createSideMenuItemClickHandler(group));
        li.classList.add("clickable");

        parent.appendChild(li);

        if (!group.items) return;

        for (var groupIndex=0; groupIndex<group.items.length; groupIndex++){
            var childItem = group.items[groupIndex];

            if (childItem.type == "Group") {
                var childUl = document.createElement("ul");
                parent.appendChild(childUl);
                createSideMenuItem(childItem, itr, childUl);
            }
        }
    }

    /* set handlers */
    function setHandlers(){
        //search
        document.getElementById("searchBtn").addEventListener("click", handleSearch);

        //nav
        document.getElementById("addNewContact").addEventListener("click", handleNavNewContact);
        document.getElementById("addNewGroup").addEventListener("click", handleNavNewGroup);
        document.getElementById("delete").addEventListener("click", handleNavDelete);
        document.getElementById("showAll").addEventListener("click", handleNavShowAll);

        //add contact form button click
        document.getElementById("newContactBtn").addEventListener("click", handleAddContact);

        //add group form button click
        document.getElementById("newGroupBtn").addEventListener("click", handleAddGroup);

        //delete id form button click
        document.getElementById("deleteIdBtn").addEventListener("click", handleDelete);
    }

    /* main display function - receives a div id correlating the main functions */
    function renderDisplay(view) {

        view = view ? view : DEFAULT_VIEW;

        if (view == GROUP_CONTACTS_TABLE_ID) {
            populateContactsTable();
        }
        else if (view == SEARCH_RESULTS_TABLE_ID) {
            populateSearchResults();
        }
        else if (view == NEW_CONTACT_FORM_ID) {
            document.getElementById("fNameInput").value = "";
            document.getElementById("lNameInput").value = "";
            document.getElementById("phonesInput").value = "";
        }
        else if (view == NEW_GROUP_FORM_ID) {
            document.getElementById("groupNameInput").value = "";
        }
        else if (view == DELETE_FORM_ID) {
            document.getElementById("deleteIdInput").value = "";
        }
        else if (view == SHOW_ALL_TABLE_ID) {
            populateAllItemsTable();
        }


        makeDivActive(view);
        updateCurrentGroup();
    }

    /* display related functions */
    function updateCurrentGroup() {

        var currentGroupLabel = document.getElementById("currentGroupName");
        if (currentGroupLabel) {
            currentGroupLabel.innerText = phoneBook.currentGroup.name;
        }

        var currentTreeItem = document.getElementsByClassName("current");
        if (currentTreeItem.length) {
            currentTreeItem[0].classList.remove("current");
        }

        currentTreeItem = document.getElementById("treeGroup"+phoneBook.currentGroup.id);
        if (currentTreeItem) {
            currentTreeItem.classList.add("current");
        }
    }

    function populateContactsTable() {

        var contactsArr = phoneBook.itemsManager.getCurrentGroupContacts();
        var contactTable = document.getElementById("contactsTableBody");
        contactTable.innerHTML = "";

        for (var contactIndex=0; contactIndex<contactsArr.length; contactIndex++){

            var contact = contactsArr[contactIndex];
            var row = contactTable.insertRow(0);

            row.id = contact.id;
            row.insertCell(0).innerHTML = contact.id;
            row.insertCell(1).innerHTML = contact.firstName;
            row.insertCell(2).innerHTML = contact.lastName;
            row.insertCell(3).innerHTML = contact.phoneNumbers.join(" , ");
            row.insertCell(4).innerHTML = "delete";
            row.cells[4].addEventListener("click", handleContactsTableAction);
            row.cells[4].classList.add("clickable");
        }
    }

    function populateSearchResults() {

        var searchStr = document.getElementById("searchInput").value;
        var resultsArr = phoneBook.itemsManager.findItemsByName(searchStr,phoneBook.root);

        var resultsTable = document.getElementById("searchResultsTableBody");
        resultsTable.innerHTML = "";
        var row;

        if (!resultsArr.length) {
            row = resultsTable.insertRow(0);
            row.insertCell(0);
            row.cells[0].colSpan = 5;
            row.cells[0].innerHTML = "0 items found";
        }
        else {
            for (var resultIndex = 0; resultIndex < resultsArr.length; resultIndex++){

                var item = resultsArr[resultIndex];
                row = resultsTable.insertRow(0);

                row.insertCell(0).innerHTML = item.id;
                row.insertCell(1).innerHTML = item.type;
                row.insertCell(2).innerHTML = item.type == "Contact" ? item.firstName + " " + item.lastName : item.name;
                row.insertCell(3).innerHTML = item.type == "Contact" ? item.phoneNumbers.join(" , ") : " - ";
                row.insertCell(4).innerHTML = "action";
            }
        }
    }

    function populateAllItemsTable() {

        var allItemsArr = phoneBook.itemsManager.getAllItems(phoneBook.root,0);
        var resultsTable = document.getElementById("allItemsTableBody");
        resultsTable.innerHTML = "";
        var row;

        for (var resultIndex = 0; resultIndex < allItemsArr.length; resultIndex++){

            var item = allItemsArr[resultIndex].item;
            row = resultsTable.insertRow(resultIndex);
            row.id = item.id;
            if (item.type == "Group" ) {
                row.classList.add("groupStyle");
            }

            row.insertCell(0);
            row.cells[0].colSpan = 3;
            row.cells[0].innerHTML = allItemsArr[resultIndex].indent +
                (item.type == "Group" ? "Group: " : "") +
                " ID: " + item.id +
                " | Name: " + (item.type == "Contact" ? item.firstName + " " + item.lastName : item.name) +
                (item.type == "Contact" ? " | Phones: " + item.phoneNumbers.join(" , ") : "");

            row.insertCell(1);
            if (item != phoneBook.root) {
                row.cells[1].innerHTML = "delete";
                row.cells[1].addEventListener("click", handleAllItemsTableAction);
                row.cells[1].classList.add("clickable");
            }
        }
    }

    /* handlers */
    function handleSearch(){
        renderDisplay(SEARCH_RESULTS_TABLE_ID);
    }

    function createSideMenuItemClickHandler(group){
        return function(){
            phoneBook.itemsManager.changeCurrentGroup(group);
            renderDisplay(GROUP_CONTACTS_TABLE_ID);
        }
    }

    function handleContactsTableAction() {

        var rowID = this.parentElement.id;
        phoneBook.itemsManager.deleteItem(rowID);

        renderDisplay();
    }

    function handleAllItemsTableAction() {
        var rowID = this.parentElement.id;
        phoneBook.itemsManager.deleteItem(rowID);

        renderDisplay(SHOW_ALL_TABLE_ID);
    }

    function handleAddContact() {

        var firstName = document.getElementById("fNameInput").value;
        var lastName = document.getElementById("lNameInput").value;
        var phoneNumbers = document.getElementById("phonesInput").value.split(" ");

        /* validation */
        var err = false;

        if (checkIfEmpty(firstName)){
            err = true;
            displayFormError("fName", FIRST_NAME_ERROR_MSG);
        }
        else {
            displayFormError("fName", FIRST_NAME_ERROR_MSG, false);
        }

        if (checkIfEmpty(lastName)){
            err = true;
            displayFormError("lName", LAST_NAME_ERROR_MSG);
        }
        else {
            displayFormError("lName", LAST_NAME_ERROR_MSG, false);
        }

        if (checkIfEmpty(phoneNumbers)){
            err = true;
            displayFormError("phones", PHONES_ERROR_MSG);
        }
        else if (!checkIfNumber(phoneNumbers)) {
            err = true;
            displayFormError("phones", PHONES_ERROR_MSG2);
        }
        else {
            displayFormError("phones", PHONES_ERROR_MSG2, false);
        }

        if (err) {
            return;
        }
        /* end validation */

        var args = {
            firstName:firstName,
            lastName:lastName,
            phoneNumbers:phoneNumbers
        };

        phoneBook.itemsManager.addNewContact(args);
        renderDisplay();
    }

    function handleAddGroup() {

        var groupName = document.getElementById("groupNameInput").value;
        var err = false;

        if (checkIfEmpty(groupName)){
            err = true;
            displayFormError("groupName", GROUP_NAME_ERROR_MSG);
        }
        else {
            displayFormError("groupName", GROUP_NAME_ERROR_MSG, false);
        }

        if(err){
            return;
        }

        var args = {
            name:groupName
        };

        phoneBook.itemsManager.addNewGroup(args);
        createSideMenu();

        renderDisplay();
    }

    function handleDelete() {
        var id = document.getElementById("deleteIdInput").value;
        var err = false;

        if (!checkIfNumber(id)){
            err = true;
            displayFormError("deleteId", DELETE_ID_ERROR_MSG);
        }
        if(err){
            return;
        }

        phoneBook.itemsManager.deleteItem(id);

        renderDisplay();
    }

    /* nav handlers */
    function handleNavDelete() {
        renderDisplay(DELETE_FORM_ID);
    }

    function handleNavNewContact() {
        renderDisplay(NEW_CONTACT_FORM_ID);
    }

    function handleNavNewGroup() {
        renderDisplay(NEW_GROUP_FORM_ID);
    }

    function handleNavShowAll() {
        renderDisplay(SHOW_ALL_TABLE_ID);
    }

    /* helpers */
    function makeDivActive(id){

        $("section > div").each( function () {
            $(this).addClass("inactive").removeClass("active");
        });

        $("#" + id).removeClass("inactive").addClass("active");
    }

    function checkIfEmpty (value) {
        return value == undefined || value == null || value == "";
    }

    function checkIfNumber(itemToCheck) {
        if (Array.isArray(itemToCheck)) {
            if (itemToCheck.some(isNaN) || itemToCheck.some(checkIfEmpty)) {
                return false;
            }
        }

        else if (Number(itemToCheck) == isNaN) {
            return false;
        }
        return true;
    }

    function displayFormError(idSelector, msg, isError){

        if (isError == undefined || isError == null) {
            isError = true;
        }

        var field = document.getElementById( idSelector + "Input" );
        var errMsgElem = document.getElementById( idSelector + "Err" );

        if (isError) {
            errMsgElem.classList.remove("inactive");
            errMsgElem.classList.add("active");
            errMsgElem.firstElementChild.innerHTML = msg ? msg : "error";
            field.classList.add("inputError");
        }
        else {
            errMsgElem.classList.remove("active");
            errMsgElem.classList.add("inactive");
            field.classList.remove("inputError");
        }
    }

})();