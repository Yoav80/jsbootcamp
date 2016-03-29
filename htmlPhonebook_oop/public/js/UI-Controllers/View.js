var app = app || {};

app.ViewControllerClass = (function (app) {

    var _app = app;
    var BACK_BUTTON_ELEMENT_ID = ".backBtn";

    function View( viewData ) {

        this.container = viewData.container;
        this.titleElement = viewData.titleElement;
        this.templateElement = viewData.templateElement;
        this.itemTemplate = null;
        this.backBtn = this.container.find(BACK_BUTTON_ELEMENT_ID);

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

        var templateElement = _app.DomHelpers.getElement(this.container , this.templateElement);

        this.listContainer = $(templateElement).parent();
        this.itemTemplate = templateElement.outerHtml();

        templateElement.remove();
    }

    View.prototype.handleBack = function() {

        if (this.parent) {
            this.setData(this.parent);
        }
    }

    View.prototype.setEditMode = function () {

        if (this.backBtn) {
            this.backBtn.unbind();
            this.backBtn.click(this.handleBack.bind(this));
        }

        if (this.parent) {
            this.backBtn.attr("disabled", false);
            this.titleElement.removeClass("uneditable")
                .removeAttr("disabled")
                .unbind()
                .blur(this.save.bind(this));

            var me = this;
            this.titleElement.keyup(function(e){
                if (e.keyCode == 13) {
                    e.preventDefault();
                    me.save.bind(this , e);
                }
            });
        }
        else {
            this.backBtn.attr("disabled", true);
            this.titleElement.removeClass("editable")
                .addClass("uneditable")
                .attr("disabled" , true)
                .unbind();
        }
    }

    View.prototype.save = function () {

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