

var app = app || {};

app.ContactViewControllerClass = (function (app) {

    var _app = app;
    var BACK_BUTTON_ELEMENT_ID = ".backBtn";
    var DELETE_BUTTON_ELEMENT_ID = ".deleteButton";
    var ADD_PHONE_BUTTON_ELEMENT_ID = ".addPhoneButton";

    function ContactViewController (viewData) {

        _app.ViewControllerClass.call(this, viewData);

        this.delBtn = this.container.find(DELETE_BUTTON_ELEMENT_ID);
        this.addPhoneBtn = this.container.find(ADD_PHONE_BUTTON_ELEMENT_ID);

    }
    ContactViewController.prototype = Object.create(_app.ViewControllerClass.prototype);


    ContactViewController.prototype.updateDOM = function() {

        var me = this;
        var arr = this.dataSet.phoneNumbers || [];
        var listContainer = this.listContainer.empty();

        if (arr.length) {
            arr.forEach(function (number, index) {
                me.addPhoneElement(number, index, me, listContainer);
            });
        }

        this.titleElement.val(this.dataSet.name || "" );
        this.setEditMode();

        if (this.isNew) {
            setTimeout(setFocus, 500, this.titleElement);
        }

        this.setEditMode();
    }

    function setFocus (item) {
        item.focus();
    }

    ContactViewController.prototype.setEditMode = function () {

        _app.ViewControllerClass.prototype.setEditMode.call(this);

        var allInputs = $(this.container).find("input.phoneNumber");

        if (allInputs.length > 0) {
            allInputs.unbind()
                .blur(this.save.bind(this))
                .keyup(function(e){
                    if (e.keyCode == 13) {
                        e.preventDefault();
                        e.currentTarget.blur();
                    }
                });
        }

        if (this.delBtn && !this.isNew) {
            this.delBtn.unbind()
                .click(this.DeleteContactClickHandler.bind(this));
        }

        if (this.addPhoneBtn) {
            this.addPhoneBtn.unbind()
                .click(this.addPhoneClickHandler.bind( this ));
        }
    }

    ContactViewController.prototype.addPhoneElement = function (number , index, me, listContainer) {
        var div = $(me.itemTemplate);
        var phone = div.find(".phoneNumber");
        phone.val(number).attr("id" , "phone" + index);

        div.find(".callButton").click(me.phoneClickHandler.bind( me , number, index ))
        listContainer.append(div);

        return div;
    }

    ContactViewController.prototype.save = function (e) {

        var currentField = $(e.currentTarget);
        if (currentField.hasClass("phoneNumber")) {

            var arr = this.dataSet.phoneNumbers;
            var id = Number(currentField.attr("id").replace(/phone/, ''));
            var val = currentField.val();

            console.log("array: " , arr, "item:"+arr[id]);

            if (!val){
                console.log("phone input " + id + " is empty, deleting:" + arr[id]);

                //TODO phone validation
                if (arr[id] != undefined) {

                    arr.splice(id , 1);
                    EventBus.dispatch("dataChanged", this);
                }
            }
            else if (val != arr[id]) {

                arr[id] = val;
                EventBus.dispatch("dataChanged", this);
            }
        }
        else {

            var titleChange = this.titleElement.val();
            if (titleChange && titleChange != this.dataSet.name) {


                this.dataSet.name = titleChange;
                var nameArr = titleChange.split(" ");
                this.dataSet.firstName = nameArr.shift();
                this.dataSet.lastName = nameArr.join(" ");

                if (this.isNew) {
                    this.dataSet.parent.addItem(this.dataSet);
                }

                if (this.dataSet.phoneNumbers.length < 1) {
                    this.addPhoneClickHandler();
                }

                this.isNew = false;
                EventBus.dispatch("dataChanged", this);
            }
            else {
                if (!titleChange) {
                    //this.titleElement.attr("disabled", true);
                    //this.updateDOM();
                    //TODO title invalid
                }
            }
        }
    }

    ContactViewController.prototype.DeleteContactClickHandler = function() {
        var me = this;

        _app.DomHelpers.setModal("DELETE",
            "Are you sure you want to delete " + this.dataSet.name + " ?")
            .then(function () {
                item.remove();
                EventBus.dispatch("changeView", me, item.parent);
            })
            .fail(function() {
                console.log('cancel');
            })
    }

    ContactViewController.prototype.addPhoneClickHandler = function () {
        var me = this;
        var elem = this.addPhoneElement("", this.dataSet.phoneNumbers.length, this, this.listContainer);
        elem.find(".phoneNumber").blur(this.save.bind(this))
            .focus()
            .keyup(function(e){
                if (e.keyCode == 13) {
                    e.preventDefault();
                    e.currentTarget.blur();
                }
            });
    }

    ContactViewController.prototype.handleBack = function() {

        var me = this;
        if (this.isNew) {
            _app.DomHelpers.setModal("New Contact", "Contact was not saved, leave anyway?")
                .then(function () {
                    me.isNew = false;
                    EventBus.dispatch("changeView", me, me.parent);
                })
        }
        else {
            EventBus.dispatch("changeView", this, this.parent);
        }
    }

    ContactViewController.prototype.phoneClickHandler = function() {
        console.log("number clicked");
    }

    return ContactViewController;

})(app);