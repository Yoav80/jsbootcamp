/**
 * Created by y_mil on 3/2/2016.
 */
var phoneBook = (function() {

    "use strict";

    function initialise(){
        this.itemsManager.initialise();
        this.displayManager.initialise();
    }

    return {
        initialise: initialise
    }
})();

($(document).ready(function () {
    phoneBook.initialise();
}));