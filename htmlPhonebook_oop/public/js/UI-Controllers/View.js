var app = app || {};

app.ViewControllerClass = (function (app) {

    var _app = app;
    var BACK_BUTTON_ELEMENT_ID = ".backBtn";
    var EDIT_BUTTON_ELEMENT_ID = ".editBtn";
    var ADD_BUTTON_ELEMENT_ID = ".addBtn";

    function View( viewData ) {

        this.container = viewData.container;
        this.titleElement = viewData.titleElement;
        this.templateElement = viewData.templateElement;
        this.itemTemplate = null;

        this.backBtn = this.container.find(BACK_BUTTON_ELEMENT_ID);
        if (this.backBtn) {
            this.backBtn.click(this.handleBack.bind(this));
        }

        this.editBtn = this.container.find(EDIT_BUTTON_ELEMENT_ID);
        if (this.editBtn) {
            this.editBtn.click(this.editClickHandler.bind( this ));
        }

        this.addBtn = this.container.find(ADD_BUTTON_ELEMENT_ID);
        if (this.addBtn) {
            this.addBtn.click(this.editClickHandler.bind( this ));
        }

        this.loadTemplate();
        this.setData(viewData.dataSet);
    }

    View.prototype.setData = function(dataSet, isNew, parent) {

        if (!dataSet) {
            return false;
        }

        this.isNew = isNew || false;
        this.parent = parent || dataSet.parent;
        this.dataSet = dataSet;
        this.isSearch = dataSet.isSearch || false;

        this.updateDOM();
    }

    View.prototype.loadTemplate = function() {

        var templateElement = _app.DomHelpers.getElement(this.container , this.templateElement)

        this.listContainer = $(templateElement).parent();
        this.itemTemplate = templateElement.outerHtml();

        templateElement.remove();
    }

    View.prototype.handleBack = function() {

        if (this.parent) {
            this.setData(this.parent);
            this.editModeOff();
        }
    }

    View.prototype.editModeOff = function () {
        this.titleElement.attr("disabled" , true);
        this.titleElement.removeClass("editable");
        this.titleElement.unbind();
    }

    View.prototype.updateDOM = function () {

    }

    View.prototype.editClickHandler = function () {

    }

    View.prototype.showMe = function() {
        this.container
            .css("display", "flex")
            .hide()
            .delay(150)
            .fadeIn(150);
    }

    View.prototype.hideMe = function() {
        this.container.fadeOut(150);

    }

    return View;

})(app);