/**
 * Created by y_mil on 2/28/2016.
 */
define(["./network"], function(network) {

    function getAllContacts(url){
        return network.httpGet(url);
    }

    function setContacts(){
        return network.httpPost();
    }
    return {
        getAllContacts:getAllContacts,
        setContacts:setContacts
    };
});