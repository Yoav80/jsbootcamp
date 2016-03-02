/**
 * Created by y_mil on 2/28/2016.
 */
var app = app || {};

app.logger = (function(){
    return {
        debug:debug,
        warning:warning,
        error:error
    };

    function debug(msg){
        console.log("debug: " + msg);
    }

    function warning(msg){
        console.warn("warning: " + msg);
    }

    function error(msg){
        console.error("error: " + msg);
    }
})();