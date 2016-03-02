/**
 * Created by y_mil on 2/28/2016.
 */
var network_1 = require("./network");
function getAllContacts() {
    network_1.httpGet("/api/contacts");
}
exports.getAllContacts = getAllContacts;
//# sourceMappingURL=storage.js.map