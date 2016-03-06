/**
 * Created by y_mil on 3/2/2016.
 */
var phoneBook = (function() {
    "use strict";

    var root = null;
    var currentGroup = null;

    //var itemsManagerFile = require('./itemsManager.js');
    //var itemsManager = new itemsManagerFile.ItemsManager(phoneBook);

    //var displayManagerFile = require('./displayManager.js');
    //var displayManager = new displayManagerFile.ItemsManager(phoneBook);

    function initialise(){
        this.itemsManager.initialise();
        this.displayManager.initialise();
    }

    return {
        root: root,
        currentGroup: currentGroup,
        initialise: initialise
    }
})();

($(document).ready(function () {
    phoneBook.initialise();
}));