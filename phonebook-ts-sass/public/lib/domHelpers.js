/**
 * Created by y_mil on 3/7/2016.
 */

var domHelpers = (function () {

    'use strict';

    var _dialog = jQuery('#dialog');

    console.log("dialog???? " , _dialog);

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
                _dialog[0].close();

                def.reject();
            });

        _dialog.find('button.ok')
            .unbind()
            .click(function() {
                _dialog[0].close();

                def.resolve();
            });

        _dialog[0].showModal();

        return def.promise();
    }

    return {
        setModal:setModal,
        dialog: _dialog
    }
})();