var app = app || {};

app.GroupViewControllerClass = (function (app) {

    var _app = app;

    var ANIMATION_DURATION = 250;
    var ADD_CONTACT_ELEMENT_CLASS = ".mdl-button.person";
    var ADD_GROUP_ELEMENT_CLASS = ".mdl-button.group";
    var ADD_BUTTON_ELEMENT_CLASS = ".mdl-speed-dial__main-fab";
    var TEMPLATE_ICON_HOLDER_CLASS = ".iconHolder";
    var TEMPLATE_DELETE_BUTTON_CLASS = ".deleteButton";
    var TEMPLATE_ITEM_NAME_CLASS = ".itemName";

    var DUPLICATE_GROUP_NAME_ERROR = "A group with that name already exists";

    function GroupViewController(viewData) {

        this.addBtn = viewData.container.find(ADD_BUTTON_ELEMENT_CLASS);
        this.addContactBtn = viewData.container.find(ADD_CONTACT_ELEMENT_CLASS);
        this.addGroupBtn = viewData.container.find(ADD_GROUP_ELEMENT_CLASS);

        _app.ViewControllerClass.call(this, viewData);
    }
    GroupViewController.prototype = Object.create(_app.ViewControllerClass.prototype);

    GroupViewController.prototype.updateDOM = function() {

        if (!this.dataSet) {
            return;
        }

        var me = this;
        var arr = this.dataSet.items;
        var listContainer = this.listContainer.empty();

        this.titleElement.val(this.dataSet.name);

        if (arr.length < 1) {
            var div = $(me.itemTemplate)
                .attr('id', "noResults")
                .html("no results..")
                .appendTo(this.listContainer);
        }
        else {
            arr.sort(_app.DomHelpers.compareObjectsByName);
            arr.forEach(function(item , index){
                me.addListItem(item, false);
            });
        }

        this.setEditMode();
    }

    GroupViewController.prototype.addListItem = function (item, isNew) {

        var div = $(this.itemTemplate);
        div.hide();

        var iconType = item.items ? "group" : "person" ;
        div.find(TEMPLATE_ICON_HOLDER_CLASS)
            .text(iconType)
            .addClass(iconType);


        if (isNew) {
            div.addClass("newItem");
            div.find(TEMPLATE_DELETE_BUTTON_CLASS).remove();

            var itemName = div.find(TEMPLATE_ITEM_NAME_CLASS);
            itemName.removeAttr("disabled")
                .addClass("newItem")
                .blur(this.save.bind(this))
                .attr("id" , "item" + item.id)

            this.listContainer.prepend(div);
            //setTimeout(setFocus, 250, itemName);
            setTimeout(function(item) {
                return function() {
                    item.focus();
                };
            }(itemName), ANIMATION_DURATION);
        }
        else {
            div.find(".item")
                .click(this.directoryClickHandler.bind( this , item ))
                .addClass("clickable");

            div.find(".itemName").val(item.name)
                .addClass("clickable");

            div.find(".deleteButton")
                .click(this.directoryDeleteClickHandler.bind( this , item ))
                .addClass("clickable");

            this.listContainer.append(div);
        }

        div.fadeIn(ANIMATION_DURATION);
    }

    GroupViewController.prototype.setEditMode = function () {

        _app.ViewControllerClass.prototype.setEditMode.call(this);

        if (!this.isSearch && this.addBtn) {
            this.addBtn.removeAttr("disabled");
        }
        else if (this.addBtn) {
            this.addBtn.attr("disabled", true);
        }

        if (this.addContactBtn) {
            this.addContactBtn.unbind()
                .click(this.addContactBtnHandler.bind(this));
        }

        if (this.addGroupBtn) {
            this.addGroupBtn.unbind()
                .click(this.addGroupBtnHandler.bind(this));
        }
    }

    GroupViewController.prototype.save = function (event) {

        var currentField = $(event.currentTarget);

        if (currentField.hasClass("newItem")) {

            var id = Number(currentField.attr("id").replace(/item/, ''));
            var val = currentField.val();

            if (!val) {
                var newItem = $("li.newItem");
                newItem.fadeOut(ANIMATION_DURATION, function () {
                        $(this).remove();
                    });

                return;
            }
            if (!this.dataSet.findGroupByExactName(val)) {

                var args = {};
                args.parent = this.dataSet;
                args.name = val;
                var group = new _app.Group(args);

                this.dataSet.addItem(group);
                this.updateDOM();
            }
            else {

                var errMsg = DUPLICATE_GROUP_NAME_ERROR;
                var errSpan = this.listContainer.find(".error");
                if (!errSpan) {
                    errSpan = $('<span class="error"></span>');
                }
                errSpan.text(errMsg);
                errSpan.insertAfter(currentField);

                currentField.focus();
            }
        }
        else {

            if (currentField.val() != this.dataSet.name) {
                this.dataSet.name = currentField.val();
                EventBus.dispatch("dataChanged", this);
            }
        }
    }


    // HANDLERS //

    GroupViewController.prototype.directoryClickHandler = function(item) {
        if (!item) return;

        if (item.items) {
            this.setData(item, false, this.dataSet);
        }
        else {
            EventBus.dispatch("changeView", this, item, false, this.dataSet);
        }
    }

    GroupViewController.prototype.directoryDeleteClickHandler = function(item) {
        if (!item) return;

        var me = this;

        _app.DomHelpers.setModal("DELETE",
            "Are you sure you want to delete " + item.name + " ?")
            .then( function() {
                item.remove();
                var currentArr = me.dataSet.items;
                var ind = currentArr.indexOf(item);
                if (ind > -1 ){
                    currentArr.splice(ind, 1);
                }
                me.updateDOM();
            })
            .fail( function() {
                console.log('cancel');
            })
    }

    GroupViewController.prototype.addContactBtnHandler = function () {

        if (this.isSearch) {
            return;
        }

        var args = {};
        args.parent = this.dataSet;
        var contact = new _app.Contact(args);

        EventBus.dispatch("changeView", this, contact, true);
    }

    GroupViewController.prototype.addGroupBtnHandler = function () {

        if (this.isSearch) {
            return;
        }

        var args = {};
        args.parent = this.dataSet;
        args.items = [];

        this.addListItem(args, true);
    }

    return GroupViewController;

})(app);