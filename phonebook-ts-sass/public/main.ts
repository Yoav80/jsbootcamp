import {appModule} from './appModule';
import './components/app';

init();

function init() {
    var element = document.getElementById("html");
    if (!element) {
        console.log("root elem not found");
        return;
    }
    console.log("bootstrap angular");
    angular.bootstrap(element, [appModule.name]);
}