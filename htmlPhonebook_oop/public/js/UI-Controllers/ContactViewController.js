
var app = app || {};

app.ContactViewControllerClass = (function (app) {

    var _app = app;
    var BACK_BUTTON_ELEMENT_ID = ".backBtn";
    var DELETE_BUTTON_ELEMENT_ID = ".deleteButton";
    var ADD_PHONE_BUTTON_ELEMENT_ID = ".addPhoneButton";

    function ContactViewController (viewData) {

        _app.ViewControllerClass.call(this, viewData);

        this.delBtn = this.container.find(DELETE_BUTTON_ELEMENT_ID);
        this.delBtn.click(this.DeleteContactClickHandler.bind( this ));

        this.addPhoneBtn = this.container.find(ADD_PHONE_BUTTON_ELEMENT_ID);
        this.addPhoneBtn.click(this.addPhoneClickHandler.bind( this ));
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

        //
        //arr.forEach(function(number, index) {
        //    var div = $(me.itemTemplate);
        //    var phone = div.find(".phoneNumber");
        //    phone.val(number).attr("id" , "phone" + index);
        //
        //    div.find(".callButton").click(me.phoneClickHandler.bind( me , number, index ))
        //    listContainer.append(div);
        //});

        this.titleElement.val(this.dataSet.name);
        this.editModeOn();

        if (this.isNew) {
            setTimeout(setFocus, 500, this.titleElement);
        }
    }

    function setFocus (item) {
        item.focus();
    }

    ContactViewController.prototype.addPhoneElement = function (number , index, me, listContainer) {
        var div = $(me.itemTemplate);
        var phone = div.find(".phoneNumber");
        phone.val(number).attr("id" , "phone" + index);

        div.find(".callButton").click(me.phoneClickHandler.bind( me , number, index ))
        listContainer.append(div);

        return div;
    }

    ContactViewController.prototype.editModeOn = function () {

        var allInputs = $(this.container).find("input");
        allInputs.blur(this.save.bind(this));
    }

    ContactViewController.prototype.editModeOff = function () {

        var allInputs = $(this.container).find("input");
        allInputs.unbind();
    }

    ContactViewController.prototype.save = function (e) {

        console.log("saveEdit: ", this, e);

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

                this.dataSet.parent.addItem(this.dataSet);
                this.isNew = false;
                EventBus.dispatch("dataChanged", this);

                if (this.dataSet.phoneNumbers.length < 1) {
                    this.addPhoneClickHandler();
                }
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

        this.dataSet.destroy();

        EventBus.dispatch("changeView", this, this.parent);
    }

    ContactViewController.prototype.addPhoneClickHandler = function () {
        var elem = this.addPhoneElement("", this.dataSet.phoneNumbers.length, this, this.listContainer);
        elem.find(".phoneNumber").blur(this.save.bind(this)).focus();
    }

    ContactViewController.prototype.handleBack = function() {

        if (this.isNew) {
            var isConfirmed = confirm("leave without saving?");

            if (!isConfirmed) {
                return;
            }
        }

        this.editModeOff();
        EventBus.dispatch("changeView", this, this.parent);

    }

    ContactViewController.prototype.phoneClickHandler = function() {
        console.log("number clicked");
    }

    return ContactViewController;

})(app);