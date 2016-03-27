var app = app || {};

app.NavigationController = (function (app) {

    var _app = app;

    var SEARCH_RESULTS_TITLE = "Search results";
    var SEARCH_BUTTON_ELEMENT_ID = "site-search";
    var SEARCH_INPUT_ELEMENT_ID = "site-search";
    var RESET_DATA_BUTTON_ELEMENT_ID = "resetData";

    function NavigationController(containerElement) {

        this.containerElement = containerElement;

        var me = this;
        //search
        var searchBtn = this.containerElement.find('[id*="' + SEARCH_INPUT_ELEMENT_ID + '"]');
        if (searchBtn) {
            searchBtn.keypress(function(e) {
                if(e.which == 13) {
                    me.handleSearch.call(me , e);
                }
            });
        }

        //nav
        //this.containerElement.getElementById("addNewContact").addEventListener("click", handleNavNewContact);
        //this.containerElement.getElementById("addNewGroup").addEventListener("click", handleNavNewGroup);
        var resetBtn = this.containerElement.find('[id*="' + RESET_DATA_BUTTON_ELEMENT_ID + '"]');
        resetBtn.click(me.handleResetData.bind(me));
    }

    NavigationController.prototype.handleSearch = function() {

        var searchStr = _app.DomHelpers.getElement(this.containerElement , '[id*="' + SEARCH_INPUT_ELEMENT_ID + '"]').val();;
        //var searchStr = searchInput.val();
        var resultsArr = _app.phoneBook.root.getItemsByName(searchStr);
        console.log("handleSearch str:" + searchStr , resultsArr , this);

        var searchDataSet = {
            items: resultsArr,
            name: SEARCH_RESULTS_TITLE,
            isSearch: true,
            parent: _app.GroupViewCtrl.dataSet
        };
        //_app.GroupViewCtrl.setData(searchDataSet);

        /**
         * item, isNew
         */
        EventBus.dispatch("changeView", this, searchDataSet, false);
    }

    NavigationController.prototype.handleResetData = function() {
        console.log("reset data");
        _app.phoneBook.setData(null);
        _app.GroupViewCtrl.setData(_app.phoneBook.root);
    }

    return NavigationController;
})(app);