/**
 * Created by y_mil on 3/7/2016.
 */
var app = app || {};

app.DomHelpers = (function (app) {

    function getElement(parent, selector) {
        var res;

        if(selector == undefined) {
            //
            //  The caller sent only a selector without parent
            //
            selector = parent;
            res = $(selector);
        }
        else {
            //
            //  The caller sent a parent and a selector
            //
            res = parent.find(selector);
        }

        if(!res.length) {
            throw new Error("Cannot find element with selector: " + selector);
        }

        return res;
    }

    function getNativeElement(jqElement) {
        if(!jqElement.length) {
            throw new Error("jQuery element is empty");
        }

        var domElement = jqElement[0];
        return domElement;
    }

    return {
        getElement: getElement,
        getNativeElement: getNativeElement,
    };

})();