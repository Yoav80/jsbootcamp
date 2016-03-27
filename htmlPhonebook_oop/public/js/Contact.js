var app = app || {};

app.Contact = (function (app) {

    var _app = app;

    function Contact(args) {

        this.firstName = args.firstName || "";
        this.lastName = args.lastName || "";

        var nameStr = this.firstName + (this.lastName ? " " + this.lastName : "");

        _app.BookItem.call(this, args.id, nameStr);

        this.phoneNumbers = args.phoneNumbers || [];
        this.parent = args.parent;
    }

    Contact.prototype = Object.create(_app.BookItem.prototype);
    //_app.DomHelpers.inherit(Contact, app.BookItem);

    Contact.prototype.destroy = function (id) {
        var arr = this.parent.items;
        var ind = arr.indexOf(this);
        arr.splice(ind, 1);

        EventBus.dispatch("dataChanged", this);
    }

    return Contact;
})(app);