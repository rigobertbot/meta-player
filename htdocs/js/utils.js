(function($) {
    /**
     * Recource traverse the object and replace all objects with className to instance of className's objects.
     */
    function recourceParse(obj) {
        if (!obj)
            return obj;
        if (typeof obj != 'object' && typeof obj != 'array')
            return obj;
        
        var replaceObject = obj.className ? eval('new ' + obj.className + '();') : obj;
        
        for (var arrayIndex in obj) {
            replaceObject[arrayIndex] = recourceParse(obj[arrayIndex]);
        }
        
        if (obj.className && replaceObject._wakeup && typeof replaceObject._wakeup == 'function') {
            replaceObject._wakeup();
        }
        
        return replaceObject;
    }
    
    $.parseJSON = function (jsonObject) {
        return recourceParse(jsonObject);
    }
    
    $.getClassName = function (obj) {
        // get classname abstracted from
        // constructor property
        if (typeof obj !== 'object')
            return null;
        var constr = obj.constructor.toString();
        var start = constr.indexOf('function ') + 9;
        var stop = constr.indexOf('(');
        var constrName = constr.substring(start, stop);
        return constrName;
    }    
})(jQuery);