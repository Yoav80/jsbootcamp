var phoneBook = phoneBook || {} ;

/**
 * An object containing inner html elements for code use
 * @type {object}
 */
phoneBook.htmlElements = {

    GROUP_CONTACTS_TABLE_HTML: '<h3>Contacts:</h3><table>' +
        '<thead><td>ID</td><td>First name</td><td>Last name</td>' +
        '<td>Phones</td><td>Action</td></thead><tbody id="contactsTableBody"></tbody></table>',
    
    SEARCH_RESULTS_TABLE_HTML: '<h3>Search results:</h3>' +
        '<table><thead><td>ID</td><td>Type</td>' +
        '<td>Name</td><td>Phones</td><td>Action</td>' +
        '</thead><tbody id="searchResultsTableBody"></tbody></table>',
    
    NEW_GROUP_FORM_HTML: "<h3>Add new group:</h3>" +
        "<p><span>Enter group name: </span><input type='text' id='groupNameInput' placeholder='Group name'></p>" +
        "<p id='groupNameErr' class='errorMsg inactive'><span></span></p>" +
        "<p><input type='button' value='add' id='newGroupBtn'></p>",
    
    NEW_CONTACT_FORM_HTML: '<h3>Add new contact:</h3><p><span>Enter first name: </span>'+
        '<input type="text" name="fName" id="fNameInput" placeholder="First name"></p>' +
        '<p id="fNameErr" class="errorMsg inactive"><span></span></p>' +
        '<p><span>Enter last name: </span><input type="text" name="lName" id="lNameInput" placeholder="Last name"></p>'+
        '<p id="lNameErr" class="errorMsg inactive"><span></span></p>' +
        '<p><span>Enter phone numbers: </span><input type="text" name="phones" id="0phonesInput" class="phonesInput"' +
        ' placeholder="Phone">' +
        '<span id="addPhoneFieldBtn">+</span></p>'+
        '<p id="0phonesErr" class="errorMsg inactive"><span></span></p>'+
        '<p><input type="button" value="add" id="newContactBtn"></p>',
    
    DELETE_FORM_HTML: '<h3>Delete item by id:</h3><p>' +
        '<span>Enter id: </span><input type="text" id="deleteIdInput" placeholder="ID"></p>' +
        '<p id="deleteIdErr" class="errorMsg inactive"><span></span></p>' +
        '<p><input type="button" value="delete" id="deleteIdBtn"></p></div>',
    
    SHOW_ALL_TABLE_HTML: '<h3>all items:</h3>' +
        '<table><tbody id="allItemsTableBody"></tbody></table>'
};