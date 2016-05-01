"use strict";
var appModule_1 = require('./appModule');
require('./components/app');
init();
function init() {
    var element = document.getElementById("html");
    if (!element) {
        console.log("root elem not found");
        return;
    }
    console.log("bootstrap angular");
    angular.bootstrap(element, [appModule_1.appModule.name]);
}
//# sourceMappingURL=main.js.map