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

        if ($.isArray(obj)) {
            // through only indexes.
            for (var arrayIndex = 0; arrayIndex < obj.length; arrayIndex ++) {
                replaceObject[arrayIndex] = recourceParse(obj[arrayIndex]);
            }
        } else {
            // through any fields except methods.
            for (var objectField in obj) {
                // ignore functions
                if ($.isFunction(obj[objectField])) {
                    continue;
                }
                replaceObject[objectField] = recourceParse(obj[objectField]);
            }
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
    $.fn.outer = function() {
        return $('<div></div>').append($(this)).html();
    }
    $.defaultDateFormatter = function (dateDate) {
        return $.format.date(dateDate, "yyyy-MM-dd");
    }
    $.getCallStack = function () {
        try { throw Error('') } catch(err) {
//            var caller_line = err.stack.split("\n")[4];
//            var index = caller_line.indexOf("at ");
//            var clean = caller_line.slice(index+2, caller_line.length);
            return err.stack;
        }
    }
    $.fn.setUid = function() {
        return $(this).each(function (id, el) {
            $(el).attr('id', $.genUuid());
        });
    }

    $.genUuid = function() {
        var uuid = "", i, random;
        for (i = 0; i < 32; i++) {
            random = Math.random() * 16 | 0;

            if (i == 8 || i == 12 || i == 16 || i == 20) {
                uuid += "-"
            }
            uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
        }
        return uuid;
    }
})(jQuery)