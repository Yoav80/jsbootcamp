"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BookItem_1 = require('./BookItem');
var Contact = (function (_super) {
    __extends(Contact, _super);
    function Contact(id, name, parent, firstName, lastName, phoneNumbers) {
        if (name === void 0) { name = ""; }
        if (parent === void 0) { parent = null; }
        if (firstName === void 0) { firstName = ""; }
        if (lastName === void 0) { lastName = ""; }
        if (phoneNumbers === void 0) { phoneNumbers = []; }
        _super.call(this, id, name, parent);
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumbers = phoneNumbers;
    }
    return Contact;
}(BookItem_1.BookItem));
exports.Contact = Contact;
//# sourceMappingURL=Conatct.js.map