
var phoneBook = phoneBook || {};

phoneBook.displayManager = (function (){
    'use strict';

    var DEFAULT_VIEW = "contactsTable";
    var currentView = undefined;

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

    function initialise(){

        createSideMenu();
        setHandlers();
        renderDisplay();
    }

/* builders */
    /**
     * creates the first ul element for the side menu
     * and calls a recursive function for the rest of the tree
     */
    function createSideMenu() {

        var wrapper = document.getElementById("directory");
        wrapper.innerHTML = "";
        var directoryUl = document.createElement("ul");
        directoryUl.id = "directoryUl";
        wrapper.insertBefore(directoryUl,wrapper.firstChild);

        createSideMenuItem(phoneBook.itemsManager.getDataObj(),0,directoryUl);
    }

    /**
     * A recursive function that creates html elements for all groups
     * @param group - the group object to run on
     * @param itr - for the indent of subgroups
     * @param parent - the parent element to append the list item
     */
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

    /**
     * set the static event listeners
     */
    function setHandlers(){
        //search
        document.getElementById("searchBtn").addEventListener("click", handleSearch);

        //nav
        document.getElementById("addNewContact").addEventListener("click", handleNavNewContact);
        document.getElementById("addNewGroup").addEventListener("click", handleNavNewGroup);
        document.getElementById("delete").addEventListener("click", handleNavDelete);
        document.getElementById("showAll").addEventListener("click", handleNavShowAll);
        document.getElementById("resetData").addEventListener("click", handleResetData);
    }

    /**
     *  main display function - receives a div id correlating the main functions
     * @param view - id of container to display, null for the default view
     */
    function renderDisplay(view) {

        view = view || DEFAULT_VIEW;

        if (view == GROUP_CONTACTS_TABLE_ID) {

            populateContactsTable();
        }
        else if (view == SEARCH_RESULTS_TABLE_ID) {

            populateSearchResults();
        }
        else if (view == SHOW_ALL_TABLE_ID) {

            populateAllItemsTable();
        }
        else if (view == NEW_CONTACT_FORM_ID) {

            document.getElementById(NEW_CONTACT_FORM_ID).innerHTML = phoneBook.htmlElements.NEW_CONTACT_FORM_HTML;
            document.getElementById("newContactBtn").addEventListener("click", handleAddContact);
            document.getElementById("addPhoneFieldBtn").addEventListener("click", handleAddAnotherPhoneField);
        }
        else if (view == NEW_GROUP_FORM_ID) {

            document.getElementById(NEW_GROUP_FORM_ID).innerHTML = phoneBook.htmlElements.NEW_GROUP_FORM_HTML;
            document.getElementById("newGroupBtn").addEventListener("click", handleAddGroup);
        }
        else if (view == DELETE_FORM_ID) {

            document.getElementById(DELETE_FORM_ID).innerHTML = phoneBook.htmlElements.DELETE_FORM_HTML;
            document.getElementById("deleteIdBtn").addEventListener("click", handleDelete);
        }

        makeDivActive(view);
        createSideMenu();
        updateCurrentGroup();
        if (currentView != view && currentView != undefined) {
            clearView(currentView);
        }
        currentView = view;
    }

    /**
     * clears a view - remove listeners and clear inner html
     * @param view - id of the container element
     */
    function clearView(view) {

        var container = document.getElementById(view);
        var btn = container.querySelector('[id^="btn"]');


        if (btn && btn.id == "newContactBtn") {
            document.getElementById("newContactBtn").removeEventListener("click", handleAddContact);
        }

        if (btn && btn.id == "newGroupBtn") {
            document.getElementById("newGroupBtn").removeEventListener("click", handleAddGroup);
        }

        if (btn && btn.id == "deleteIdBtn") {
            document.getElementById("deleteIdBtn").removeEventListener("click", handleDelete);
        }

        document.getElementById(view).innerHTML = "";
    }

    /**
     * updates the view according to the current group
     */
    function updateCurrentGroup() {

        var currentGroupLabel = document.getElementById("currentGroupName");
        if (currentGroupLabel) {
            currentGroupLabel.innerText = phoneBook.itemsManager.getCurrentGroup().name;
        }

        var currentTreeItem = document.getElementsByClassName("current");
        if (currentTreeItem.length) {
            currentTreeItem[0].classList.remove("current");
        }

        currentTreeItem = document.getElementById("treeGroup"+phoneBook.itemsManager.getCurrentGroup().id);
        if (currentTreeItem) {
            currentTreeItem.classList.add("current");
        }
    }

    /**
     * populates the contacts table according to the current group
     */
    function populateContactsTable() {

        document.getElementById(GROUP_CONTACTS_TABLE_ID).innerHTML = phoneBook.htmlElements.GROUP_CONTACTS_TABLE_HTML;
        var contactTable = document.getElementById("contactsTableBody");
        var contactsArr = phoneBook.itemsManager.getCurrentGroupContacts();

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

    /**
     * populates the search results table according to the matches of the passed string
     */
    function populateSearchResults() {

        document.getElementById(SEARCH_RESULTS_TABLE_ID).innerHTML = phoneBook.htmlElements.SEARCH_RESULTS_TABLE_HTML;

        var resultsTable = document.getElementById("searchResultsTableBody");
        var searchStr = document.getElementById("searchInput").value;
        var resultsArr = phoneBook.itemsManager.findItemsByName(searchStr);
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
                row.id = item.id;
                row.insertCell(0).innerHTML = item.id;
                row.insertCell(1).innerHTML = item.type;
                row.insertCell(2).innerHTML = item.type == "Contact" ? item.firstName + " " + item.lastName : item.name;
                row.insertCell(3).innerHTML = item.type == "Contact" ? item.phoneNumbers.join(" , ") : " - ";
                row.insertCell(4).innerHTML = "delete";
                row.cells[4].addEventListener("click", handleSearchResultsTableAction);
                row.cells[4].classList.add("clickable");
            }
        }
    }

    /**
     * populates the all items table with all the items
     */
    function populateAllItemsTable() {

        document.getElementById(SHOW_ALL_TABLE_ID).innerHTML = phoneBook.htmlElements.SHOW_ALL_TABLE_HTML;

        var allItemsArr = phoneBook.itemsManager.getAllItems();
        var resultsTable = document.getElementById("allItemsTableBody");
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
                (item.type == "Group" ? "Group: " : "") + " ID: " + item.id +
                " | Name: " + (item.type == "Contact" ? item.firstName + " " + item.lastName : item.name) +
                (item.type == "Contact" ? " | Phones: " + item.phoneNumbers.join(" , ") : "");

            row.insertCell(1);
            if (item != phoneBook.itemsManager.getDataObj()) {
                row.cells[1].innerHTML = "delete";
                row.cells[1].addEventListener("click", handleAllItemsTableAction);
                row.cells[1].classList.add("clickable");
            }
        }
    }

    /**
     * handle search button click
     */
    function handleSearch(){
        renderDisplay(SEARCH_RESULTS_TABLE_ID);
        document.getElementById("searchInput").value = "";
    }

    /**
     * closure function that returns a function for a side menu click event
     * @param group - the group to set as current
     * @returns {Function} - that changes the current group
     */
    function createSideMenuItemClickHandler(group){
        return function(){
            phoneBook.itemsManager.changeCurrentGroup(group);
            renderDisplay(GROUP_CONTACTS_TABLE_ID);
        }
    }

    /**
     * handles the contact table row action click - delete contact
     */
    function handleContactsTableAction() {
        var rowID = this.parentElement.id;
        deleteItemHandler(rowID);
    }

    /**
     * handles the all items table row action click - delete item
     */
    function handleAllItemsTableAction() {
        var rowID = this.parentElement.id;
        deleteItemHandler(rowID, SHOW_ALL_TABLE_ID);
    }

    /**
     * handles the search results table row action click - delete item
     */
    function handleSearchResultsTableAction() {
        var rowID = this.parentElement.id;
        deleteItemHandler(rowID);
    }

    function deleteItemHandler (id, view) {
        phoneBook.itemsManager.deleteItem(id);
        renderDisplay(view);
    }

    /**
     * handles the add contact form btn click.
     * validates fields and calls the add contact item function
     */
    function handleAddContact() {

        var firstName = document.getElementById("fNameInput").value;
        var lastName = document.getElementById("lNameInput").value;
        var phoneInputs = document.querySelectorAll('[id$="phonesInput"]');
        var phoneNumbers = [];

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

        for (var phoneInputIndex = 0; phoneInputIndex < phoneInputs.length; phoneInputIndex++){
            var elem = phoneInputs[phoneInputIndex];

            if (checkIfEmpty(elem.value)){
                err = true;
                displayFormError(phoneInputIndex + "phones", PHONES_ERROR_MSG);
            }
            else if (!checkIfNumber(elem.value)) {
                err = true;
                displayFormError(phoneInputIndex + "phones", PHONES_ERROR_MSG2);
            }
            else {
                phoneNumbers.push(elem.value);
                displayFormError(phoneInputIndex + "phones", PHONES_ERROR_MSG2, false);
            }
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

    /**
     * handles the another phone input field
     */
    function handleAddAnotherPhoneField() {
        var addPhoneFieldBtn = document.getElementById("addPhoneFieldBtn");
        var phoneInputs = document.querySelectorAll('[id$="phonesInput"]');
        var lastPhoneInput = phoneInputs[phoneInputs.length - 1];

        var clone = lastPhoneInput.cloneNode(true);
        clone.id = phoneInputs.length + "phonesInput";
        clone.value = "";
        lastPhoneInput.parentElement.insertBefore( clone, addPhoneFieldBtn );
    }

    /**
     * handles the add group form btn click.
     * validates fields and calls the add group item function
     */
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

    /**
     * handles the delete form btn click - not in use
     */
    function handleDelete() {
        var id = document.getElementById("deleteIdInput").value;
        var err = false;

        if (!checkIfNumber(id) || checkIfEmpty(id)) {
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

    /**
     * handles the nav item "delete group" click
     * */
    function handleNavDelete() {
        phoneBook.itemsManager.deleteItem(phoneBook.itemsManager.getCurrentGroup().id);
        initialise();
        //renderDisplay(DELETE_FORM_ID);
    }

    /**
     * handles the nav item "add contact" click
     */
    function handleNavNewContact() {
        renderDisplay(NEW_CONTACT_FORM_ID);
    }

    /**
     * handles the nav item "add contact" click
     */
    function handleNavNewGroup() {
        renderDisplay(NEW_GROUP_FORM_ID);
    }

    /**
     * handles the nav item "show all" click
     */
    function handleNavShowAll() {
        renderDisplay(SHOW_ALL_TABLE_ID);
    }

    /**
     * handles the nav item "reset to default" click
     */
    function handleResetData(){
        phoneBook.itemsManager.loadDefaults();
        initialise();
    }

/* helpers */
    /**
     * hides and shows div according to the passed id
     * @param id
     */
    function makeDivActive(id){

        var divs = document.querySelectorAll("section > div");
        for (var divIndex = 0; divIndex < divs.length; divIndex++) {
            divs[divIndex].classList.remove("active");
            divs[divIndex].classList.add("inactive");
        }

        var currentDiv = document.querySelector("#" + id);
        currentDiv.classList.remove("inactive");
        currentDiv.classList.add("active");
    }

    /**
     * validation function - checks if value is empty
     * @param value
     * @returns {boolean}
     */
    function checkIfEmpty (value) {
        return value == undefined || value == null || value == "";
    }

    /**
     * validation function - checks if value is empty
     * @param itemToCheck
     * @returns {boolean}
     */
    function checkIfNumber(itemToCheck) {
        return !isNaN(itemToCheck);
    }

    function displayFormError(idSelector, msg, isError){

        if (isError == undefined || isError == null) {
            isError = true;
        }

        var field = document.getElementById( idSelector + "Input" );
        var errMsgElem = document.getElementById( idSelector + "Err" );

        if (isError) {
            if (errMsgElem) {
                errMsgElem.classList.remove("inactive");
                errMsgElem.classList.add("active");
                errMsgElem.firstElementChild.innerHTML = msg ? msg : "error";
            }
            field.classList.add("inputError");
        }
        else {
            if (errMsgElem) {
                errMsgElem.classList.remove("active");
                errMsgElem.classList.add("inactive");
            }
            field.classList.remove("inputError");
        }
    }

})();