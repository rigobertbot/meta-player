/**
 * MetaPlayer 1.0
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2010-2011 Val Dubrava [ valery.dubrava@gmail.com ] 
 * 
 */
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

    $.parseJSONObject = function (jsonObject) {
        if (typeof jsonObject == 'string') {
            jsonObject = $.evalJSON(jsonObject);
        }
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
    $.trace = function () {
        if (console && console.log) {
            console.log(arguments);
        }
    }
    $.objectToJSON = function (object) {
        if (object && $.isFunction(object._sleep)) {
            object = object._sleep();
        }
        return $.toJSON(object);
    }
})(jQuery);