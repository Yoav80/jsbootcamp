/**
 * Created by y_mil on 2/28/2016.
 */
define([], function(){
    function httpGet(url){
        console.log("httpGet: " + url);
        return "httpGet: " + url;
    }

    function httpPost(){
        return "data received!";
    }

    return {
        httpGet:httpGet,
        httpPost:httpPost
    };

});