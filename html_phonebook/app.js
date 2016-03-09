
var phoneBook = (function() {

    "use strict";

    function initialise(){
        phoneBook.itemsManager.initialise();
        phoneBook.displayManager.initialise();
    }

    return {
        initialise: initialise
    }
})();


function ready(fn) {
    if (document.readyState != 'loading'){
        fn();
    } else if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', fn);
    } else {
        document.attachEvent('onreadystatechange', function() {
            if (document.readyState != 'loading')
                fn();
        });
    }
}
ready(phoneBook.initialise);