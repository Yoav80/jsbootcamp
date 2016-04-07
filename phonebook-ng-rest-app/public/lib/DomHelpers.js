/**
 * Created by y_mil on 3/7/2016.
 */
var app = app || {};

app.DomHelpers = (function (app) {

    'use strict';

    var _dialog = $('#dialog');
    if (_dialog && !_dialog[0].showModal) {
        dialogPolyfill.registerDialog(_dialog[0]);
    }

    function setModal(title , content) {

        if (!_dialog) return;

        var def = $.Deferred();

        _dialog.find(".mdl-dialog__title").text(title);
        _dialog.find(".mdl-dialog__content p").text(content);
        //mdl-dialog__actions

        _dialog.find('button.cancel')
            .unbind()
            .click(function() {
                def.reject();
                _dialog[0].close();
            });

        _dialog.find('button.ok')
            .unbind()
            .click(function() {
                def.resolve();
                _dialog[0].close();
            });

        _dialog[0].showModal();
        return def.promise();
    }

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

    function compareObjectsByName (a , b) {
        if(a.name < b.name) return -1;
        if(a.name > b.name) return 1;
        return 0;
    }

    return {
        compareObjectsByName: compareObjectsByName,
        getElement: getElement,
        getNativeElement: getNativeElement,
        setModal: setModal,
        dialog: _dialog
    };

})();