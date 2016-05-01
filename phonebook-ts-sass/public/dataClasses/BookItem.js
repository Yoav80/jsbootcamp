"use strict";
var BookItem = (function () {
    function BookItem(id, name, parent) {
        this.isNew = false;
        this.name = name;
        this.parent = parent;
        if (isNaN(id) || id == null) {
            var t = BookItem.generateNextId();
            console.log("Book Item ctor ", t);
            this.id = t;
            console.log("Book Item ctor ", this.id);
        }
        else {
            this.id = id;
            this.setHeightestId(id);
        }
    }
    BookItem.prototype.getName = function () {
        return this.name;
    };
    ;
    BookItem.setId = function (id) {
        this._id = id;
    };
    ;
    BookItem.generateNextId = function () {
        return ++BookItem._id;
    };
    BookItem.prototype.setHeightestId = function (id) {
        if (id > BookItem._id) {
            BookItem.setId(id);
        }
    };
    BookItem._id = -1;
    return BookItem;
}());
exports.BookItem = BookItem;
//# sourceMappingURL=BookItem.js.map