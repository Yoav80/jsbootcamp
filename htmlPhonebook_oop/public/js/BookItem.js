var app = app || {};

app.BookItem = (function () {

    var _id = -1;

    function BookItem (id, name) {
        this.name = name;
        if (isNaN(id)) {
            this.id = generateNextId();
        }
        else {
            this.id = id;
            setHeightestId(id);
        }
    }

    function generateNextId() {
        return ++_id;
    };

    function setHeightestId(id) {
        if (id > _id) {
            _id = id;
        }
    }

    function getId() {
        return _id;
    }

    BookItem.prototype.remove = function () {
        var arr = this.parent.items;
        var ind = arr.indexOf(this);
        if (ind > -1) {
            arr.splice(ind, 1);
            EventBus.dispatch("dataChanged", this);
        }
    }

    BookItem.prototype.getName = function() {
        return this.name;
    }

    BookItem.setId = function (id) {
        _id = id;
    }
    return BookItem;
})();

