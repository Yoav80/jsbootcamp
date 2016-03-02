/**
 * Created by y_mil on 2/28/2016.
 */
var network = require("./network");

function getAllContacts(){
    network.httpGet("/api/contacts");
}

module.exports =  {
    getAllContacts:getAllContacts
};
