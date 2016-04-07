var app = app || {};

app.NavigationController = (function (app) {

    var _app = app;

    var SEARCH_RESULTS_TITLE = "Search results";
    var SEARCH_BUTTON_ELEMENT_CLASS = ".site-search-button";
    var SEARCH_INPUT_ELEMENT_CLASS = ".site-search-input";
    var RESET_DATA_BUTTON_ELEMENT_ID = "resetData";

    function NavigationController(containerElement) {

        this.containerElement = containerElement;

        var me = this;
        //search
        //this.searchBtn = this.containerElement.find(SEARCH_BUTTON_ELEMENT_CLASS);
        //this.searchBtn.click(this.handleSearch.bind(this));
        this.searchInput = this.containerElement.find(SEARCH_INPUT_ELEMENT_CLASS);
        if (this.searchInput) {
            this.searchInput.keypress(function(e) {
                if(e.which == 13) {
                    me.handleSearch.call(me);
                }
            });
        }

        //nav
        var resetBtn = this.containerElement.find('[id*="' + RESET_DATA_BUTTON_ELEMENT_ID + '"]');
        resetBtn.click(me.handleResetData.bind(me));
    }

    NavigationController.prototype.handleSearch = function() {

        var searchStr = this.searchInput.val();
        var resultsArr = _app.phoneBook.root.getItemsByName(searchStr);
        console.log("handleSearch str:" + searchStr , resultsArr , this);
        var parent = _app.GroupViewCtrl.dataSet.name ==
            SEARCH_RESULTS_TITLE ? _app.GroupViewCtrl.dataSet.parent : _app.GroupViewCtrl.dataSet;

        var searchDataSet = {
            items: resultsArr,
            name: SEARCH_RESULTS_TITLE,
            isSearch: true,
            parent: parent
        };
        EventBus.dispatch("changeView", this, searchDataSet, false);
    }

    NavigationController.prototype.handleResetData = function() {

        _app.phoneBook.setData(null);
        _app.GroupViewCtrl.setData(_app.phoneBook.root);
    }

    return NavigationController;
})(app);