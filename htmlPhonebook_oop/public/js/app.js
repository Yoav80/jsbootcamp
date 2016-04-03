var app = app || {};

($(document).ready(function () {

    app.phoneBook = new app.PhoneBookClass();

    var navigationElement = $("#phoneBook-navigation");
    app.navigationCtrl = new app.NavigationController(navigationElement);

    var navigationElement2 = $("#phoneBook-navigation-drawer");
    app.navigationDrawerCtrl = new app.NavigationController(navigationElement2);

    var GroupViewData = {
        container: $('#GroupListView'),
        titleElement: $('.GroupTitle'),
        templateElement: $('#GroupTemplate'),
        dataSet: app.phoneBook.root
    };
    app.GroupViewCtrl = new app.GroupViewControllerClass(GroupViewData);

    var ContactViewData = {
        container: $('#ContactListVew'),
        titleElement: $('.ContactTitle'),
        templateElement: $('#ContactTemplate'),
        dataSet: null
    };
    app.ContactViewCtrl = new app.ContactViewControllerClass(ContactViewData);

    setHandlers();
    app.ContactViewCtrl.hideMe();
    app.GroupViewCtrl.showMe();

}));

function setHandlers() {

    EventBus.addEventListener("dataChanged", app.phoneBook.handleDataChanged, app.phoneBook);
    EventBus.addEventListener("changeView", changeView);
}

function changeView (scope, viewData, isNew, parent) {
    console.log("changeView!!" , viewData, isNew, parent);

    if (viewData.items) {
        app.GroupViewCtrl.setData( viewData, isNew, parent);

        app.ContactViewCtrl.hideMe();
        app.GroupViewCtrl.showMe();
    }

    else {
        app.ContactViewCtrl.setData(viewData , isNew, parent);

        app.GroupViewCtrl.hideMe();
        app.ContactViewCtrl.showMe();
    }
}

