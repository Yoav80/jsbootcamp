var app = app || {};

app.GroupViewControllerClass = (function (app) {

    var _app = app;

    function GroupViewController(viewData) {

        _app.ViewControllerClass.call(this, viewData);

        this.addContactBtn = this.container.find(".mdl-button.person");
        this.addContactBtn.click(this.addContactBtnHandler.bind(this));
    }

    GroupViewController.prototype = Object.create(_app.ViewControllerClass.prototype);

    GroupViewController.prototype.updateDOM = function() {

        if (!this.dataSet) {
            return;
        }

        var me = this;
        var arr = this.dataSet.items;
        var listContainer = this.listContainer.empty();

        if (arr.length < 1) {
            var div = $(me.itemTemplate)
                .attr('id', "noResults")
                .html("no results..")
                .appendTo(this.listContainer);
        }
        else {
            arr.forEach(function(item, index) {
                var div = $(me.itemTemplate);
                var iconType = item.items ? "group" : "person" ;

                var ico = div.find(".iconHolder")
                ico.text(iconType).addClass(iconType);

                div.find(".item")
                    .click(me.directoryClickHandler.bind( me , item, index ))
                    .addClass("clickable");

                div.find(".itemName").text(item.name)
                    .addClass("clickable")

                div.find(".deleteButton")
                    .click(me.directoryDeleteClickHandler.bind( me , item, index ))
                    .addClass("clickable")

                listContainer.append(div);
            });
        }

        this.titleElement.val(this.dataSet.name);
        this.titleElement.unbind();

        if (!this.parent) {

            this.backBtn.attr("disabled" , true);
            this.titleElement.attr("disabled" , true)
                .addClass("uneditable")
                .unbind();
        }
        else {

            this.backBtn.removeAttr("disabled");
            this.titleElement.removeClass("uneditable")
                .removeAttr("disabled")
                .blur(this.saveEdit.bind(this));
        }

        if (this.isSearch && this.addContactBtn) {
            this.addContactBtn.attr("disabled" , true);
            this.editModeOff();
        }
        else if (this.addContactBtn) {
            this.addContactBtn.removeAttr("disabled");
        }
    }

    //GroupViewController.prototype.editClickHandler = function () {
    //    this.titleElement.attr('disabled' , false);
    //    this.titleElement.addClass("editable");
    //    this.titleElement.focus();
    //
    //    this.editBtn.attr("disabled" , true);
    //
    //    this.titleElement.blur(this.saveEdit.bind(this));
    //}

    GroupViewController.prototype.saveEdit = function () {

        var titleChange = this.titleElement.val();

        if (titleChange && titleChange != this.dataSet.name) {

            //var confirmed = confirm("save changes for? " + titleChange);
            //if (confirmed) {
                this.dataSet.name = titleChange
                EventBus.dispatch("dataChanged", this);
            //}
        }
        //else {
        //    if (!titleChange) {
        //        this.updateDOM();
        //    }
        //}
    }

    GroupViewController.prototype.directoryClickHandler = function(item) {
        //if (!item) return;

        this.editModeOff();

        if (item.items) {
            this.setData(item, false, this.dataSet);
        }
        else {
            //todo contact click
            EventBus.dispatch("changeView", this, item, false, this.dataSet);
        }
    }

    GroupViewController.prototype.directoryDeleteClickHandler = function(item, index) {
        if (!item) return;

        item.destroy();

        var currentArr = this.dataSet.items;
        if (currentArr[index] === item) {
            currentArr.splice(index, 1);
        }

        this.updateDOM();
    }

    GroupViewController.prototype.addContactBtnHandler = function () {

        if (this.isSearch) {
            return;
        }

        this.editModeOff();

        var args = {};
        args.parent = this.dataSet;
        var contact = new _app.Contact(args);

        /**
         * item, isNew
         */
        EventBus.dispatch("changeView", this, contact, true);
    }

    return GroupViewController;

})(app);