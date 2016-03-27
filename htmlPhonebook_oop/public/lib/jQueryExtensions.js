(function() {

    jQuery.fn.outerHtml = function() {
        if(!this.length) {
            throw new Error("jQuery element is empty");
        }

        var domElement = this[0];

        var res = domElement.outerHTML;
        return res;
    }

})();
