(function($) {
    $.fn.deserializeJSON = function () {
        var className = $(this).attr('className');
        var instance = this[0];
        var newObj = eval(className + '.prototype.constructor.call(instance);');


        var secObj = eval('new ' + className + '();');
        for (var i in this) {
            console.log(typeof this[i]);
            secObj[i] = this[i];
        }
        
        return newObj;
    }
})(jQuery);