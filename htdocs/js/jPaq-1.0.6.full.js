/**@preserve jPaq - A fully customizable JavaScript/JScript library
 * http://jpaq.org/
 *
 * Copyright (c) 2011 Christopher West
 * Licensed under the MIT license.
 * http://jpaq.org/license/
 *
 * Version: 1.0.6.$$$$$
 * Revised: April 6, 2011
 */
(function() {
// The object used to retrieve private data.
var jPaqKey = {};
// The function responsible for making private data accessible to internal
// functions.
function _(obj, privateData) {
	obj._ = function(aKey) {
		if(jPaqKey === aKey)
			return privateData;
	};
}
function parseArray(objArray) {
	/// <summary>Converts an array like object into an array.</summary>
	/// <param name="objArray" type="Object">An array-like object.</param>
	/// <returns type="Array">
	///   Returns a shallow copy of "objArray" as a JavaScript array.  If a
	///   non-array-like object was passed, an empty array will be returned.
	/// </returns>
	if(!objArray || !isFinite(objArray.length || "a") || objArray.length < 0)
		return [];
	try {
		return Array.prototype.slice.call(objArray);
	}
	catch(e) {
		for(var arr = [], i = objArray.length - 1; i >= 0; i--)
			arr[i] = objArray[i];
		return arr;
	}
}
jPaq = {
	extend : function(objToExtend, objExtras, fnFilter) {
		/// <summary>
		///   Adds properties that exist in one object to another object.
		/// </summary>
		/// <param name="objToExtend" type="Object">
		///   The object which will receive the extra properties.
		/// </param>
		/// <param name="objExtras" type="Object">
		///   The object which contains the properties that may be attached to
		///   "objToExtend".
		/// </param>
		/// <param name="fnFilter" type="Function" optional="true">
		///   Optional.  The function that will be used to filter out unwanted
		///   properties.  The first parameter passed to this will be the property
		///   that may be attached to "objToExtend".  The second parameter will be
		///   the name of the property.  The third parameter will be the current
		///   value for the specified property of "objToExtend".  The fourth
		///   parameter will be a reference to "objToExtend".
		/// </param>
		if(typeof fnFilter != "function")
			fnFilter = function(){return true;};
		for(var i in objExtras)
			if(fnFilter(objExtras[i], i, objToExtend[i], objToExtend))
				objToExtend[i] = objExtras[i];
	},
	parseArray : parseArray,
	/// <summary>
	///   An object containing all of the values passed from a form with the
	///   method set to "GET".
	/// </summary>
	GET : 0,
	escape : function(str, forApp) {
		/// <summary>
		///   Encodes a Uniform Resource Identifier (URI) component by replacing
		///   each instance of certain characters by one, two, three, or four escape
		///   sequences representing the UTF-8 encoding of the character (will only
		///   be four escape sequences for characters composed of two "surrogate"
		///   characters).  This strictly adheres to RFC 3986 by encoding "!", "'",
		///   "(", ")", and "*".
		/// </summary>
		/// <param name="str" type="String">
		///   A string to be encoded for use after submitting a request or response
		///   via the GET or POST method.
		/// </param>
		/// <param name="forApp" type="Boolean" optional="true">
		///   Optional.  Replaces all of the spaces with "+" as is expected when the
		///   content type is "application/x-www-form-urlencoded" (which is the
		///   default).  The default value is false.
		/// </param>
		/// <returns type="String">
		///   Returns the encoded string.
		/// </returns>
		return encodeURIComponent(str).replace(/[\u0027-\u002A]/g , function(a) {
			return "%" + a.charCodeAt(0).toString(16);
		}).replace(/%20/g, forApp ? "+" : "%20");
	},
	unescape : function(str, forApp){
		/// <summary>
		///   Replaces each escape sequence in the encoded URI component with the
		///   character that it represents.
		/// </summary>
		/// <param name="str" type="String">
		///   A string that was encoded by jPaq.escape() or encodeURIComponent().
		/// </param>
		/// <param name="forApp" type="Boolean" optional="true">
		///   Optional.  Replaces each "+" character with a with space character.
		///   This may be used when decoding URI's encoded for the
		///   "application/x-www-form-urlencoded" content type.  The default value
		///   is false.
		/// </param>
		/// <returns type="String">
		///   Returns the decoded string.
		/// </returns>
		return decodeURIComponent(str.replace(/\+/g, forApp ? "%20" : "+"));
	},
	toString : function() {
		/// <summary>
		///   Get a brief description of this library.
		/// </summary>
		/// <returns type="String">
		///   Returns a brief description of this library.
		/// </returns>
		return "jPaq - A fully customizable JavaScript/JScript library created by Christopher West.";
	}
};
(function() {
	var objGET = {}, arr = location.search.substring(1).split("&");
	for(var parts, i = 0, len = arr.length; i < len; i++) {
		if(!(parts = arr[i].match(/^(.*?)=(.*)$/)) || parts.length < 3)
			continue;
		parts[2] = jPaq.unescape(parts[2], true);
		if((parts[1] = jPaq.unescape(parts[1], true)) in objGET)
			if(objGET[parts[1]] instanceof Array)
				objGET[parts[1]].push(parts[2]);
			else
				objGET[parts[1]] = [objGET[parts[1]], parts[2]];
		else
			objGET[parts[1]] = parts[2];
	}
	jPaq.GET = objGET;
})();
// Source:  https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/keys
Object.keys = Object.keys || function(obj) {
	/// <summary>
	///   Gets an array of all the enumerable properties that belong to the
	///   specified object.
	/// </summary>
	/// <param name="obj" type="Object">
	///   The object whose property names are to be returned.
	/// </param>
	/// <returns type="Array">
	///   Returns an array of all the enumerable properties that belong to the
	///   specified object.  The order will be the same as is given via a for...in
	///   loop.
	/// </returns>
	var keys = [];
	for(var key in obj)
		if(obj.hasOwnProperty(key))
			keys.push(key);
	return keys;
};
function List() {}
List.prototype = new Array();
// This was inspired by the Python range function.
List.range = function(start, stop, step) {
	/// <summary>
	///   Creates an array from the specified range of numbers.
	/// </summary>
	/// <param name="start" type="Number">
	///   If the "stop" parameter is given, this is the first number that may
	///   appear in the array.  If the "stop" parameter is omitted, this value
	///   will be assigned to "stop" while zero will be assigned to this
	///   parameter.
	/// </param>
	/// <param name="stop" type="Number" optional="true">
	///   Optional.  If "step" is positive, the last element is the largest
	///   number where "start + i * step" is less than stop; if step is negative,
	///   the last element is the smallest number where "start + i * step" is
	///   greater than stop.  If omitted, this will default to the value of
	///   "start".
	/// </param>
	/// <param name="step" type="Number" optional="true">
	///   Optional.  The difference between one element and the next.  If omitted
	///   and "start" is less than "stop", this will default to 1.  If omitted and
	///   "stop" is less than "start", this will default to 1.
	/// </param>
	/// <returns type="Array">
	///   Returns an array from the specified range of numbers.
	/// </returns>
	if(arguments.length == 1) {
		stop = start;
		start = 0;
	}
	for(var ret = [], negativeStep = (step = step || 1) < 0;
	negativeStep ? start > stop : (start < stop); start += step)
		ret.push(start);
	return ret;
};
List.prototype.uniquify = function() {
	/// <summary>
	///   Creates a copy of this array without any duplicate elements.
	/// </summary>
	/// <returns type="Array">
	///   Returns a copy of this array without any duplicate elements.
	/// </returns>
	for(var arr = this.slice(0), i = 0, jLen = arr.length, iLen = jLen - 1; i < iLen; i++)
		for(var j = i + 1; j < jLen; j++)
			if(arr[i] === arr[j]) {
				arr.splice(j--, 1);
				jLen = iLen--;
			}
	return arr;
};
List.prototype.clone = function() {
	/// <summary>Creates a shallow copy of this array.</summary>
	/// <returns type="Array">Returns a shallow copy of this array.</returns>
	return this.slice(0);
};
// Returns all elements that are in this array but not in arrOther.
List.prototype.subtract = function(arrOther) {
	/// <summary>
	///   Gets a new array which contains all of the elements that are in this
	///   array but not another one.
	/// </summary>
	/// <param name="arrOther" type="Array">
	///   The array whose elements will not be found in the returned array.
	/// </param>
	/// <returns type="Array">
	///   Returns a new array which contains all of the elements that are in this
	///   array but not in arrOther.
	/// </returns>
	if(!(arrOther instanceof Array))
		return [];
	var j, i = 0, difference = [], arrOtherFound = [];
	for(; i < this.length; i++) {
		for(j = 0; j < arrOther.length; j++) {
			if(arrOtherFound[j] != true && arrOther[j] === this[i]) {
				arrOtherFound[j] = true;
				break;
			}
		}
		if(j == arrOther.length)
			difference.push(this[i]);
	}
	return difference;
}
// Returns all elements that are common to this array and arrOther.
List.prototype.intersect = function(arrOther) {
	/// <summary>
	///   Gets a new array of all of the elements that are in this array and
	///   another array.
	/// </summary>
	/// <param name="arrOther" type="Array">
	///   The array that will be intersected with this one.
	/// </param>
	/// <returns type="Array">
	///   Returns a new array of all of the elements that are in this array and
	///   arrOther.
	/// </returns>
	// A - B = C
	// A - C = A & B
	if(!(arrOther instanceof Array))
		return [];
	return this.subtract(this.subtract(arrOther));
}
// Returns all elements that are in the first array and the second (not
// including duplicates).
List.prototype.union = function(arrOther) {
	/// <summary>
	///   Gets a new array which contains all of the elements that are in this
	///   array and the other one.  Any elements found in the other array that are
	///   already in this one will not be added to this array.
	/// </summary>
	/// <param name="arrOther" type="Array">
	///   The array that will be unioned with this array.
	/// </param>
	/// <returns type="Array">
	///   Returns a new array with all elements that are in this array and the
	///   other one (not including duplicates).
	/// </returns>
	// B - A = C
	// A + C = A | B
	if(!(arrOther instanceof Array))
		return [];
	return this.concat(arrOther.subtract(this));
};
Function.prototype.curry = function() {
	/// <summary>
	///   Takes one or more arguments and stores them to be used when the
	///   returned function is called.
	/// </summary>
	/// <returns type="Function">
	///   Returns a new function with the specified arguments already filled in.
	/// </returns>
	var me = this, args = parseArray(arguments);
	return function() {
		return me.apply(this, args.concat(parseArray(arguments)));
	};
};
// Source:  https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/forEach
List.prototype.every = Array.prototype.every || function(fnCallback, objThis) {
	/// <summary>
	///   Tests whether all elements in the array pass the test implemented by the
	///   provided function.
	/// </summary>
	/// <param name="fnCallback" type="Function">
	///   The function that will test all of the elements in the array.  The first
	///   parameter passed will be the element to be tested.  The second will be
	///   the index of the element.  The third will be this array.  Something that
	///   evaulates to true must be returned in order to test the next element.
	/// </param>
	/// <param name="objThis" type="Object" optional="true">
	///   Optional.  The object that is referred to by the "this" keyword within
	///   fnCallback.
	/// </param>
	/// <returns type="Boolean">
	///   Returns false if fnCallback returns a value that evaluates to false.
	///   Otherwise, true is returned.
	/// </returns>
	if(typeof fnCallback != "function")
		throw new TypeError();
	for(var i = 0, len = this.length >>> 0; i < len; i++)
		if(i in this && !fnCallback.call(objThis, this[i], i, this))
			return false;
	return true;
};
// Source:  https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/forEach
List.prototype.forEach = Array.prototype.forEach || function(fn, objThis) {
	/// <summary>
	///   Calls a function for each element in the array.
	/// </summary>
	/// <param name="fn" type="Function">
	///   The function that will be executed for every element within the array.
	///   The first parameter passed will be the element within the array that is
	///   being examined.  The second parameter is the index of the element.  The
	///   third parameter is a reference to the array.  The keyword "this" will
	///   refer to whatever is passed in as "objThis".
	/// </param>
	/// <param name="objThis" type="Object" optional="true">
	///   Optional.  If specified, the "this" keyword will refer to this
	///   parameter.
	/// </param>
	if(typeof fn != "function")
		throw new TypeError();
	for(var i = 0, len = this.length >>> 0; i < len; i++)
		if(i in this)
			fn.call(objThis, this[i], i, this);
};
// Source:  https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/filter
List.prototype.filter = Array.prototype.filter || function(fn, objThis) {
	/// <summary>
	///   Creates a new array with all of the elements of this array for which the
	///   provided filtering function returns true.
	/// </summary>
	/// <param name="fn" type="Function">
	///   The filtering function that will be called for all of the elements
	///   within the array.  The first parameter is the element that will be
	///   checked against this function.  The second parameter is the index of the
	///   element.  The third parameter is a reference to this array.  To keep the
	///   specified element in the filtered array, a value which evaulates to true
	///   must be returned.
	/// </param>
	/// <param name="objThis" type="Object" optional="true">
	///   Optional.  The object to which the "this" keyword will refer for each
	///   invocation of the filtering function.  If this is not specified, "this"
	///   will refer to the global object of the filtering function.
	/// </param>
	/// <returns type="Array">
	///   Returns a new array of the filtered items.
	/// </returns>
	if(typeof fn != "function")
		throw new TypeError();
	for(var val, res = [], i = 0, len = this.length >>> 0; i < len; i++)
		if(i in this && fn.call(objThis, val = this[i], i, this))
			res.push(val);
	return res;
};
// Source:  https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/indexOf
List.prototype.indexOf = Array.prototype.indexOf || function(target, start) {
	/// <summary>
	///   Identifies the first position of the specified target element by using
	///   strict equality to find a match.
	/// </summary>
	/// <param name="target" type="Object">
	///   The element to locate within the array.
	/// </param>
	/// <param name="start" type="Number" optional="true">
	///   Optional.  The index to start the search at.  If this number is
	///   negative, it is taken as the offset from the end of the array.  If
	///   omitted, this value defaults to zero.
	/// </param>
	/// <returns type="Number">
	///   If the target element is found, the first index of its match will be
	///   returned.  If not, -1 is returned.
	/// </returns>
	var len = this.length >>> 0;
	start = Number(start) || 0;
	if((start = (start < 0) ? Math.ceil(start) : Math.floor(start)) < 0)
		start += len;
	for(; start < len; start++)
		if(start in this && this[start] === target)
			return start;
	return -1;
};
// Source:  https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/lastIndexOf
List.prototype.lastIndexOf = Array.prototype.lastIndexOf || function(target, start) {
	/// <summary>
	///   Identifies the last position of the specified target element by using
	///   strict equality to find a match.
	/// </summary>
	/// <param name="target" type="Object">
	///   The element to locate within the array.
	/// </param>
	/// <param name="start" type="Number" optional="true">
	///   Optional.  The index to start the search at.  If this number is
	///   negative, it is taken as the offset from the end of the array.  If
	///   omitted, this value defaults to zero.
	/// </param>
	/// <returns type="Number">
	///   If the target element is found, the last index of its match will be
	///   returned.  If not, -1 is returned.
	/// </returns>
	var len = this.length;
	start = (isNaN(start = Number(start)) ? len - 1 : ((start = (start < 0) ? Math.ceil(start) : Math.floor(start)) < 0 ? start + len : (start >= len ? len - 1 : start)));
	for(; start > -1; start--)
		if(start in this && this[start] === target)
			return start;
	return -1;
};
// Source:  https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/map
List.prototype.map = Array.prototype.map || function(fnCallback, objThis) {
	/// <summary>
	///   Creates a new array of the same size, with each element being the value
	///   that is returned by the specified function.
	/// </summary>
	/// <param name="fnCallback" type="Function">
	///   The function that will be called for each element within the original
	///   array.  The first parameter passed will be the element to be examined.
	///   The second will be the index of the element.  The third will be a
	///   reference to this array.  This function should return the value that
	///   will stored in the corresponding index of the array that will be
	///   returned from the call to the map function.
	/// </param>
	/// <param name="objThis" type="Object" optional="true">
	///   Optional.  The object that is referred to by the "this" keyword within
	///   fnCallback.
	/// </param>
	/// <returns type="Array">
	///   The array of elements that are returned after calling the specified
	///   function for each element in the original array.
	/// </returns>
	if(typeof fnCallback != "function")
		throw new TypeError();
	var len = this.length >>> 0;
	for(var res = new Array(len), i = 0; i < len; i++)
		if (i in this)
			res[i] = fnCallback.call(objThis, this[i], i, this);
	return res;
};
// Source:  https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
List.isArray = Array.isArray || function(obj) {
	/// <summary>
	///   Indicates whether or not the specified object is an array.
	/// </summary>
	/// <param name="obj" type="Object">The object to be tested.</param>
	/// <returns type="Boolean">
	///   Returns a boolean value indicating whether or not the specified object
	///   is an array.
	/// </returns>
	return Object.prototype.toString.call(obj) === "[object Array]";
};
// Source:  https://developer.mozilla.org/En/Core_JavaScript_1.5_Reference/Global_Objects/Array/Reduce
List.prototype.reduce = Array.prototype.reduce || function(fnCallback, initial) {
	/// <summary>
	///   Accumulate the values of an array (from left-to-right) in order to reduce
	///   it to a single value.
	/// </summary>
	/// <param name="fnCallback" type="Function">
	///   The accumulator function.  The first parameter is the value that has
	///   been accumulated so far.  If the "initial" value is, the first parameter
	///   will be "initial" the first time this is called.  Otherwise, the first
	///   value will be the value of the first element in the array.  The second
	///   parameter will be the value that needs to be accumulated (or added) to
	///   the first parameter.  The third will be the index of this parameter
	///   within the array.  The fourth will be a reference to this array.  This
	///   function should return the result of accumulating the current value
	///   (parameter two) to the previous value (parameter one).
	/// </param>
	/// <param name="initial" type="Object" optional="true">
	///   Optional.  The value of the first parameter passed to the first call to
	///   the accumulator function.
	/// </param>
	/// <returns type="Object">
	///   The result of accumulating all of the values within the array.
	/// </returns>
	if(typeof fnCallback != "function")
		throw new TypeError();
	// no value to return if no initial value and an empty array
	var len = this.length >>> 0, aLen = arguments.length;
	if(len == 0 && aLen == 1)
		throw new TypeError();
	var i = 0;
	if(aLen < 2)
		do {
			if (i in this) {
				initial = this[i++];
				break;
			}
			// if array contains no values, no initial value to return
			if(++i >= len)
				throw new TypeError();
		} while(1);
	for(; i < len; i++)
		if(i in this)
			initial = fnCallback.call(undefined, initial, this[i], i, this);
	return initial;
};
// Source:  https://developer.mozilla.org/En/Core_JavaScript_1.5_Reference/Global_Objects/Array/ReduceRight
List.prototype.reduceRight = Array.prototype.reduceRight || function(fnCallback, initial) {
	/// <summary>
	///   Accumulate the values of an array (from right-to-left) in order to
	///   reduce it to a single value.
	/// </summary>
	/// <param name="fnCallback" type="Function">
	///   The accumulator function.  The first parameter is the value that has
	///   been accumulated so far.  If the "initial" value is, the first parameter
	///   will be "initial" the first time this is called.  Otherwise, the first
	///   value will be the value of the last element in the array.  The second
	///   parameter will be the value that needs to be accumulated (or added) to
	///   the first parameter.  The third will be the index of this parameter
	///   within the array.  The fourth will be a reference to this array.  This
	///   function should return the result of accumulating the current value
	///   (parameter two) to the previous value (parameter one).
	/// </param>
	/// <param name="initial" type="Object" optional="true">
	///   Optional.  The value of the first parameter passed to the first call to
	///   the accumulator function.
	/// </param>
	/// <returns type="Object">
	///   The result of accumulating all of the values within the array.
	/// </returns>
	if(typeof fnCallback != "function")
		throw new TypeError();
	// no value to return if no initial value, empty array
	var len = this.length >>> 0, aLen = arguments.length;
	if(len == 0 && aLen == 1)
		throw new TypeError();
	var i = len - 1;
	if(aLen < 2)
		do {
			if (i in this) {
				initial = this[i--];
				break;
			}
			// if array contains no values, no initial value to return
			if(--i < 0)
				throw new TypeError();
		} while(true);
	for(; i >= 0; i--)
		if(i in this)
			initial = fnCallback.call(undefined, initial, this[i], i, this);
	return initial;
};
// Source:  https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/some
List.prototype.some = Array.prototype.some || function(fnCallback, objThis) {
	/// <summary>
	///   Tests whether some element in the array passes the test implemented by
	///   the provided function.
	/// </summary>
	/// <param name="fnCallback" type="Function">
	///   Function to test for each element.
	/// </param>
	/// <param name="objThis" type="Object" optional="true">
	///   Optional.  The object that is referred to by the "this" keyword within
	///   fnCallback.
	/// </param>
	/// <returns type="Boolean">
	///   Returns true if at least one of the elements passes the test.
	///   Otherwise, false is returned.
	/// </returns>
	if (typeof fnCallback != "function")
		throw new TypeError();
	for (var i = 0, len = this.length >>> 0; i < len; i++)
		if (i in this && fnCallback.call(objThis, this[i], i, this))
			return true;
	return false;
};
// A class to represent a color.
(Color = function(rValue, gValue, bValue) {
	/// <summary>Creates mutable 24-bit color object.</summary>
	/// <param name="rValue" type="Object" optional="true">
	///   Optional.  This may either be a number or a string.  If this is a string
	///   it must be a three or six digit hexadecimal code, or a CSS
	///   representation of a RGB parameters.  If this is a string and the
	///   "gValue" or "bValue" parameters are set, this parameter will default to
	///   0.  If this is a number, it must be an integer representing how much red
	///   will be in the color.  If this is a number, it must be greater than or
	///   equal to zero and less than or equal to 255.  Otherwise, this value will
	///   default to 0.
	/// </param>
	/// <param name="gValue" type="Number" optional="true">
	///   Optional.  The amount of green that will compose the color.  This value
	///   must be an integer greater than or equal to 0 and less than or equal to
	///   255.  If omitted, this value will be inferred from the "rValue".
	///   value.
	/// </param>
	/// <param name="bValue" type="Number" optional="true">
	///   Optional.  The amount of blue that will compose the color.  This value
	///   must be an integer greater than or equal to 0 and less than or equal to
	///   255.  If omitted, this value will be inferred from "rValue".
	/// </param>
	// Initialize the color.
	_(this, {r : 0, g : 0, b : 0});
	this.setTo.apply(this, arguments);
}).prototype = {
	setTo : function(rValue, gValue, bValue) {
		/// <summary>Creates mutable 24-bit color object.</summary>
		/// <param name="rValue" type="Object" optional="true">
		///   Optional.  This may either be a number or a string.  If this is a
		///   string, it must be a three or six digit hexadecimal code, or a CSS
		///   representation of a RGB parameters.  If this is a string and the
		///   "gValue" or "bValue" parameters are set, this parameter will default
		///   to 0. If this is a number, it must be an integer representing how much
		///   red will be in the color.  If this is a number, it must be greater
		///   than or equal to zero and less than or equal to 255.  Otherwise, this
		///   value will default to 0.
		/// </param>
		/// <param name="gValue" type="Number" optional="true">
		///   Optional.  The amount of green that will compose the color.  This
		///   value must be an integer greater than or equal to 0 and less than or
		///   equal to 255.  If omitted, this value will be inferred from "rValue".
		/// </param>
		/// <param name="bValue" type="Number" optional="true">
		///   Optional.  The amount of blue that will compose the color.  This value
		///   must be an integer greater than or equal to 0 and less than or equal
		///   to 255.  If omitted, this value will be inferred from "rValue".
		/// </param>
		var me = this;
		if(arguments.length == 1) {
			var m = /^#?(([\dA-F]{3}){1,2})$/i.exec(rValue + "");
			if(m) {
				var hexCode = m[1];
				if(hexCode.length == 3)
					hexCode = hexCode.replace(/(.)/g, "$1$1");
				me.r(parseInt(hexCode.substring(0, 2), 16))
					.g(parseInt(hexCode.substring(2, 4), 16))
					.b(parseInt(hexCode.substring(4, 6), 16));
			}
			else if(m = /^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i.exec(rValue + ""))
				me.r(m[1]).g(m[2]).b(m[3]);
			else
				me.r(rValue);
		}
		else
			me.r(rValue).g(gValue).b(bValue);
		return me;
	},
	getHexCode : function() {
		/// <summary>
		///   Gives the six digit hexadecimal code for the color that this object
		///   represents.
		/// </summary>
		/// <returns type="String">
		///   Returns the six digit hexadecimal code for the color that this object
		///   represents.  This string will start with the "#" characters.
		/// </returns>
		return "#" + [
			this.r().toString(16),
			this.g().toString(16),
			this.b().toString(16)
		].join(",").replace(/\b(\w)\b/gi, "0$1").toUpperCase().replace(/,/g, "");
	},
	combine : function(secondColor, strength) {
		/// <summary>Merges this color the the specified color.</summary>
		/// <param name="secondColor" type="Color">
		///   The color that will be merged or combined with this one.
		/// </param>
		/// <param name="strength" type="Number" optional="true">
		///   Optional.  A number inclusively ranging from 0 to 100 which represents
		///   how much of "secondColor" will appear in the new color.  If this is
		///   omitted, this will default to 50.
		/// </param>
		/// <returns type="Color">
		///   Returns a new color object which represents the merging of this color
		///   with "secondColor".
		/// </returns>
		if(isNaN(strength = +strength))
			strength = 50;
		var percent2 = Math.max(Math.min(strength, 100), 0) / 100;
		var percent1 = 1 - percent2;
		return new Color((this.r() * percent1 + secondColor.r() * percent2),
			this.g() * percent1 + secondColor.g() * percent2,
			this.b() * percent1 + secondColor.b() * percent2);
	},
	// Returns a color that can be displayed well on the specified color.
	getSafeColor : function() {
		/// <summary>
		///   Produces a new color object representing black or white.  If this
		///   color is closer to white, black will be returned.  If this color is
		///   closer to black, white will be returned.
		/// </summary>
		/// <returns type="Color">
		///   Returns a new color object which represents black or white.
		/// </returns>
		var i = this.getLuminance() < 128 ? 255 : 0;
		return new Color(i, i, i);
	},
	getLuminance : function() {
		/// <summary>Gets the luminance of the color.</summary>
		/// <returns type="Number">
		///   Returns a number inclusively ranging from 0 to 255 which represents
		///   the luminance of the color.
		/// </returns>
		with(this){return .299 * r() + .587 * g() + .114 * b();}
	},
	// Gets an approximation of the grayscale version of the color.
	toGrayscale : function() {
		/// <summary>
		///   Gets an approximation of the grayscale version of the color.
		/// </summary>
		/// <returns type="Color">
		///   Returns an approximation of the grayscale version of this color as a
		///   new color object.
		/// </returns>
		var i = Math.round(this.getLuminance());
		return new Color(i, i, i);
	},
	// Gets the opposite color.
	getOpposite : function() {
		/// <summary>Gets the opposite color.</summary>
		/// <returns type="Color">
		///   Returns a new color object that represents the opposite of this color.
		/// </returns>
		with(this){return new Color(255 - r(), 255 - g(), 255 - b());}
	},
	// Gives the user the ability to get a lighter version of a color.
	getLighter : function(strength) {
		/// <summary>
		///   Gets a lighter version of this color by mixing it with white.
		/// </summary>
		/// <param name="strength" type="Number" optional="true">
		///   Optional.  A number inclusively ranging from 0 to 100 which represents
		///   how much white will appear in the new color.  If this is omitted, this
		///   will default to 30.
		/// </param>
		/// <returns type="Color">
		///   Returns a lighter version of this color as a new color object.
		/// </returns>
		return this.combine(white, strength != null ? strength >>> 0 : 30);
	},
	// Gives the user the ability to get a darker version of a color.
	getDarker : function(strength) {
		/// <summary>
		///   Gets a darker version of this color by mixing it with white.
		/// </summary>
		/// <param name="strength" type="Number" optional="true">
		///   Optional.  A number inclusively ranging from 0 to 100 which represents
		///   how much black will appear in the new color.  If this is omitted, this
		///   will default to 30.
		/// </param>
		/// <returns type="Color">
		///   Returns a darker version of this color as a new color object.
		/// </returns>
		return this.combine(black, strength != null ? strength >>> 0 : 30);
	}
};
// Create the jQuery-like getter/setter functions for the RGB values.
for(var arr = ["r","g","b"], i = 0; i < 3; i++) {
	(function(name) {
		Color.prototype[name] = function(value) {
			var privateData = this._(jPaqKey);
			if(!arguments.length)
				return privateData[name];
			privateData[name] = Math.min(Math.max(value >>> 0, 0), 255);
			return this;
		};
	})(arr[i]);
}
// Shortcuts for black and white.
var black = new Color(), white = new Color(255, 255, 255);
// Gives the user the ability to see the color in the form of a string.
// This is an alias for getHexCode().
Color.prototype.toString = Color.prototype.getHexCode;
Color.random = function(r, g, b) {
	/// <summary>
	///   Produces a random color based on the specified criteria.  Each of the
	///   parameters may be a number or an array of numbers.  To specify a
	///   specific value, the numeric value must be in an array by itself.  To
	///   specify a range, the values must be given in an array where the first
	///   element is the minimum value and the second element is the maximum
	///   value.  To produce an independently random value, 0 or null should be
	///   specified.  To produce a random value that must be greater than one or
	///   both of the other two non-zero parameters, you must enter a larger
	///   number.  To produce a random value that is smaller than one or both of
	///   the other two non-zero parameters, you must enter a smaller number.
	/// </summary>
	/// <param name="r" type="Object" optional="true">
	///   Optional.  Used to specify the amount of red that may appear in the
	///   color.
	/// </param>
	/// <param name="g" type="Object" optional="true">
	///   Optional.  Used to specify the amount of green that may appear in the
	///   color.
	/// </param>
	/// <param name="b" type="Object" optional="true">
	///   Optional.  Used to specify the amount of blue that may appear in the
	///   color.
	/// </param>
	/// <returns type="Color">
	///   A color object based on the specified parameters.
	/// </returns>
	for(var c = [[r || 0, 0], [g || 0, 1], [b || 0, 2]].sort(function(a, b) {
		return a[0] <= b[0] ? a[0] < b[0] ? -1 : 0 : 1;
	}), ret = [], lastIndex, lastVal, i = 0; i < 3; i++) {
		if(c[i][0] instanceof Array)
			ret[c[i][1]] = c[i][0].length == 1
				? c[i][0][0]
				: Math.randomIn.apply(null, c[i][0]);
		else {
			if(c[i][0] != lastIndex || lastIndex == 0)
				lastVal = Math.round(Math.randomIn(lastIndex > 0 ? lastVal : 0, 255));
			lastIndex = c[i][0];
			ret[c[i][1]] = lastVal;
		}
	}
	return new Color(ret[0], ret[1], ret[2]);
};
Math.randomIn = function(min, max) {
	/// <summary>Generates a random number.</summary>
	/// <param name="min" type="Number" optional="true">
	///   Optional.  The minimum number that can be returned.  The default value
	///   is zero.
	/// </param>
	/// <param name="max" type="Number" optional="true">
	///   Optional.  The returned random number will always be less than this
	///   number.  The default value is one.
	/// </param>
	/// <returns type="Number">
	///   Returns a number that is greater than or equal to "min" and less than
	///   "max".
	/// </returns>
	min = min == null ? 0 : min;
	return Math.random() * ((max == null ? 1 : max) - min) + min;
};
RegExp.fromWildExp = function(pat, opts) {
	/// <summary>
	///   Generates a regular expression from the given wildcard string.
	/// </summary>
	/// <param name="pat" type="String">
	///   A string that may contain wildcard characters, which will later be
	///   used to test another string:
	///       To match zero or more characters either "*" or "%" may be used.
  ///       To match a single digit "#" may be used.
  ///       To match a character with special meaning, you must precede it
	///         with "~".  The "~" also serves as the escape character.
  ///       To match one of a specific list of characters, you may surround
	///         the character with square brackets.
  ///       To match any character but what is in the list, you must place a
	///         "!" after the opening square bracket ("[").
  ///       Use the ""
	///         symbol to indicate the end of one.
	/// </param>
	/// <param name="opts" type="String" optional="true">
	///   Optional.  The string of characters, each representing a single option:
	///       "a" specifies that the pattern must match the entire string.
	///       "b" specifies that the pattern must match the beginning of the string.
	///       "e" specifies that the pattern must match the end of the string.
	///       "g" specifies that the expression will be used to match every part of the string that matches the pattern.
	///       "i" specifies that letter casing will be ignored.
	///       "l" causes the expression to match the longest strings possible.
	///       "m" changes the meaning of using the "a", "b", and "e" options so that the endpoints will pertain to lines  instead of the entire string.
	///       "o" causes the curly braces to represent how many times the preceeding character or group may appear.
	///       "p" causes parentheses to serve a grouping indicators.
	/// </param>
	/// <returns type="RegExp">
	///   A regular expression, equivalent to the specified wildcard string.
	/// </returns>
	var oOpt = opts && opts.indexOf("o") > -1;
	var i, m, p = "", sAdd = (opts && opts.indexOf("l") > -1 ? "" : "?");
	var re = new RegExp("~.|\\[!|" + (oOpt ? "{\\d+,?\\d*\\}|[" : "[")
		+ (opts && opts.indexOf("p") > -1 ? "" : "\\(\\)")
		+ "\\{\\}\\\\\\.\\*\\+\\?\\:\\|\\^\\$%_#<>]");
	while((i = pat.search(re)) > -1 && i < pat.length) {
		p += pat.substring(0, i);
		if((m = pat.match(re)[0]) == "[!")
			p += "[^";
		else if(m.charAt(0) == "~")
			p += "\\" + m.charAt(1);
		else if(m == "*" || m == "%")
			p += ".*" + sAdd;
		else if(m == "?" || m == "_")
			p += ".";
		else if(m == "#")
			p += "\\d";
		else if(oOpt && m.charAt(0) == "{")
			p += m + sAdd;
		else if(m == "<")
			p += "\\b(?=\\w)";
		else if(m == ">")
			p += "(?:\\b$|(?=\\W)\\b)";
		else
			p += "\\" + m;
		pat = pat.substring(i + m.length);
	}
	p += pat;
	if(opts) {
		if(/[ab]/.test(opts))
			p = "^" + p;
		if(/[ae]/.test(opts))
			p += "$";
	}
	return new RegExp(p, opts ? opts.replace(/[^gim]/g, "") : "");
};
// Find one or more substrings which match the specified wildcard expression.
String.prototype.findPattern = function(pat, opts) {
	/// <summary>
	///   Find one or more substrings which match the specified wildcard
	///   expression.
	/// </summary>
	/// <param name="pat" type="String">
	///   The wildcard expression used to find one or more matching substrings.
	/// </param>
	/// <param name="opts" type="String" optional="true">
	///   Optional.  A string of characters, each representing an option.
	/// </param>
	/// <returns type="Object">
	///   If the "g" option is supplied, an array of all the matching substrings
	///   is returned.  Otherwise, the first matching substring is returned.  If
	///   no matching substrings have been found, null is returned.
	/// </returns>
	var arr = this.match(RegExp.fromWildExp(pat, opts));
	return arr != null && (opts || "").indexOf("g") < 0 ? arr[0] : arr;
};
// Find one or more indices which match the specified wildcard expression.
String.prototype.indexOfPattern = function(pat, opts) {
	/// <summary>
	///   Find one or more indices which match the specified wildcard expression.
	/// </summary>
	/// <param name="pat" type="String">
	///   The wildcard expression used to find the starting position of one or
	///   more matching substrings.
	/// </param>
	/// <param name="opts" type="String" optional="true">
	///   Optional.  A string of characters, each representing an option.
	/// </param>
	/// <returns type="Object">
	///   If the "g" option is supplied, an array of all the matching substrings'
	///   starting positions is returned.  Otherwise, the index of the first
	///   matching substring is returned.  If no matching substrings have been
	///   found, null is returned.
	/// </returns>
  var ret = [];
  this.replace(RegExp.fromWildExp(pat, opts), function() {
    ret.push(arguments[arguments.length - 2]);
  });
	return ((opts || "").indexOf("g") < 0 || !ret.length)
		? ret[0] || null
		: ret;
};
// Find and replace one or more substrings which match the specified wildcard
// expression.
String.prototype.replacePattern = function(pat, opts, rep) {
	/// <summary>
	///   Find one or more occurrences which match the specified wildcard
	///   expression and replace it with another string or expression.
	/// </summary>
	/// <param name="pat" type="String">
	///   The wildcard expression used to find the starting position of one or
	///   more matching substrings.
	/// </param>
	/// <param name="opts" type="String">
	///   A string of characters, each representing an option.  If no options are
	///   needed, pass null.
	/// </param>
	/// <param name="rep" type="Object">
	///   This may be either a string or a callback function.  This serves the
	///   same purpose as the second parameter of String.prototype.replace(...).
	/// </param>
	/// <returns type="Object">
	///   If the "g" option is supplied, all of the found occurrences will be
	///   replaced.  If the "g" flag isn't supplied, only replace the first
	///   occurrence with the replacement expression.
	/// </returns>
	return this.replace.apply(this, [RegExp.fromWildExp(pat, opts), rep]);
};
String.prototype.trim = String.prototype.trim || function() {
	/// <summary>
	///   Gets this string without whitespace characters at the beginning and
	///   end.
	/// </summary>
	/// <returns type="String">
	///   Returns this string without whitespace characters at the beginning and
	///   end.
	/// </returns>
	return this.trimLeft().trimRight();
};
String.prototype.trimLeft = String.prototype.trimLeft || function() {
	/// <summary>Gets this string without whitespace characters at the beginning.</summary>
	/// <returns type="String">
	///   Returns this string without whitespace characters at the beginning.
	/// </returns>
	return this.replace(/^[\s\u00A0]+/, "");
};
String.prototype.trimRight = String.prototype.trimRight || function() {
	/// <summary>Gets this string without whitespace characters at the end.</summary>
	/// <returns type="String">
	///   Returns this string without whitespace characters at the end.
	/// </returns>
	return this.replace(/[\s\u00A0]+$/, "");
};
String.prototype.padLeft = function(numOfChars, padding) {
	/// <summary>
	///   Adds the character(s) in padding to the left iteratively until the
	///   string is as long as numOfChars.
	/// </summary>
	/// <param name="numOfChars" type="Number">
	///   The maximum number of characters that can appear in the string after
	///   the padding is added.  If this string is already longer than
	///   numOfChars, just the string will be returned.
	/// </param>
	/// <param name="padding" type="String" optional="true">
	///   Optional.  By default, this value is the space character.  The
	///   character or sequence of characters that will be continually appended
	///   to the beginning of the string until the string is of length
	///   numOfChars.
	/// </param>
	/// <returns type="String">
	///   Returns this string with padding added iteratively to the beginning of
	///   the string until the string has numOfChars characters in it.
	/// </returns>
	if(!padding || padding.constructor !== String)
			padding = " ";
	var m = Math.max(Math.ceil((numOfChars - this.length) / padding.length), 0);
	return new Array(m + 1).join(padding).slice(this.length - numOfChars) + this;
};
String.prototype.padRight = function(numOfChars, padding) {
	/// <summary>
	///   Adds the character(s) in padding to the end iteratively until the
	///   string is as long as numOfChars.
	/// </summary>
	/// <param name="numOfChars" type="Number">
	///   The maximum number of characters that can appear in the string after
	///   the padding is added.  If this string is already longer than
	///   numOfChars, just the string will be returned.
	/// </param>
	/// <param name="padding" type="String" optional="true">
	///   Optional.  By default, this value is the space character.  The
	///   character or sequence of characters that will be continually appended
	///   to the end of the string until the string is of length numOfChars.
	/// </param>
	/// <returns type="String">
	///   Returns this string with padding added iteratively to the end of
	///   the string until the string has numOfChars characters in it.
	/// </returns>
	if(!padding || padding.constructor !== String)
			padding = " ";
	var m = Math.max(Math.ceil((numOfChars - this.length) / padding.length), 0);
	return this + (new Array(m + 1).join(padding).slice(0, numOfChars - this.length));
}
String.prototype.padCenter = function(numOfChars, padding, rightDominant) {
	/// <summary>
	///   Adds the character(s) in padding to the beginning and end iteratively
	///   until the string is as long as numOfChars.
	/// </summary>
	/// <param name="numOfChars" type="Number">
	///   The maximum number of characters that can appear in the string after
	///   the padding is added.  If this string is already longer than
	///   numOfChars, just the string will be returned.
	/// </param>
	/// <param name="padding" type="String" optional="true">
	///   Optional.  By default, this value is the space character.  The
	///   character or sequence of characters that will be continually appended
	///   to the end of the string until the string is of length numOfChars.
	/// </param>
	/// <param name="rightDominant" type="Boolean" optional="true">
	///   Optional.  By default, this value is true.  The character or sequence
	///   of characters that will be continually added to the beginning and end
	///   of the string until the string is of length numOfChars.
	/// </param>
	/// <returns type="String">
	///   Returns this string with padding added iteratively to the end of the
	///   string until the string has numOfChars characters in it.
	/// </returns>
	if(!padding || padding.constructor !== String)
			padding = " ";
	return this.padLeft(Math[rightDominant ? "ceil" : "floor"]((this.length + numOfChars) / 2), padding).padRight(numOfChars, padding);
}
var div = document.createElement("DIV"), textAttr = ("innerText" in div) ? "innerText" : "textContent";
String.prototype.toHTML = function() {
	/// <summary>
	///   Gets a copy of this string with the characters that have special meaning
	///   in HTML converted to their HTML entities.
	/// </summary>
	/// <returns type="String">
	///   Returns a copy of this string with the special characters converted to
	///   HTML entities.
	/// </returns>
	div[textAttr] = this;
	return div.innerHTML.replace(/  /g, " &nbsp;");
};
String.prototype.fromHTML = function() {
	/// <summary>
	///   Gets a copy of this string with HTML entities converted to the
	///   characters that they represent.
	/// </summary>
	/// <returns type="String">
	///   Returns a copy of this string with all HTML entities converted to the
	///   characters that they represent.
	/// </returns>
	div.innerHTML = this;
	return div[textAttr];
};
String.prototype.tag = function(tagName, attributes) {
	/// <summary>
	///   Gets this string wrapped in the specified tag, with the specified
	///   attributes attached.
	/// </summary>
	/// <param name="tagName" type="String">
	///   The maximum number of characters that can appear in the string after
	///   the padding is added.  If this string is already longer than
	///   numOfChars, just the string will be returned.
	/// </param>
	/// <param name="attributes" type="Object" optional="true">
	///   Optional.  The attributes that you would like to add in an object
	///   literal.  Each attribute must be appear as a key-value pair.
	/// </param>
	/// <returns type="String">
	///   Returns this string wrapped in the specified tag with the specified
	///   attributes.
	/// </returns>
	var arr = [tagName];
	for(var name in attributes || {})
		arr.push(name + '="' + attributes[name].replace(/"/g, "&quot;") + '"');
	return "<" + arr.join(" ") + ">" + this.toHTML() + "</" + tagName + ">";
};
String.prototype.toProperCase = function() {
	/// <summary>
	///   Gets a copy of this string in which the first letter and the each letter
	///   after a whitespace character will be capitalized.
	/// </summary>
	/// <returns type="String">
	///   Returns a copy of this string in which the first letter and the each
	///   letter after a whitespace character will be capitalized.
	/// </returns>
	return this.replace(/(^|[\u00A0\s])\S/g, function(a) {
		return a.toUpperCase();
	});
};
String.prototype.compareTo = function(subject, caseSensitive) {
	/// <summary>
	///   Compares this string to another one.
	/// </summary>
	/// <param name="subject" type="String">
	///   The string to compare this string to.
	/// </param>
	/// <param name="caseSensitive" type="Boolean" optional="true">
	///   Optional.  By default, this value false.  The value which indicates
	///   whether or not the casing of the characters should influence the
	///   returned value.
	/// </param>
	/// <returns type="Number">
	///   Returns -1 if this string comes before subject, 1 if this string comes
	///   after subject, or 0 if this string is the same as subject.
	/// </returns>
	var me = !caseSensitive ? this.toUpperCase() : this;
	subject = !caseSensitive ? (subject + "").toUpperCase() : subject + "";
	return me < subject ? -1 : me > subject ? 1 : 0;
};
var shortDays = "Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(",");
var fullDays = "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(",");
var shortMonths = "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(",");
var fullMonths = "January,February,March,April,May,June,July,August,September,October,November,December".split(",");
function getOrdinalFor(intNum) {
	return (((intNum = Math.abs(intNum) % 100) % 10 == 1 && intNum != 11) ? "st"
		: (intNum % 10 == 2 && intNum != 12) ? "nd" : (intNum % 10 == 3
		&& intNum != 13) ? "rd" : "th");
}
function getISO8601Year(aDate) {
	var d = new Date(aDate.getFullYear() + 1, 0, 4);
	if((d - aDate) / 86400000 < 7 && (aDate.getDay() + 6) % 7 < (d.getDay() + 6) % 7)
		return d.getFullYear();
	if(aDate.getMonth() > 0 || aDate.getDate() >= 4)
		return aDate.getFullYear();
	return aDate.getFullYear() - (((aDate.getDay() + 6) % 7 - aDate.getDate() > 2) ? 1 : 0);
}
function getISO8601Week(aDate) {
	// Get a day during the first week of the year.
	var d = new Date(getISO8601Year(aDate), 0, 4);
	// Get the first monday of the year.
	d.setDate(d.getDate() - (d.getDay() + 6) % 7);
	return parseInt((aDate - d) / 604800000) + 1;
}
Date.prototype.format = function(format) {
	/// <summary>
	///   Gets a string for this date, formatted according to the given format
	///   string.
	/// </summary>
	/// <param name="format" type="String">
	///   The format of the output date string.  The format string works in a
	///   nearly identical way to the PHP date function which is highlighted here:
	///   http://php.net/manual/en/function.date.php.
	///   The only difference is the fact that "u" signifies milliseconds
	///   instead of microseconds.  The following characters are recognized in
	///   the format parameter string:
	///     d - Day of the month, 2 digits with leading zeros
	///     D - A textual representation of a day, three letters
	///     j - Day of the month without leading zeros
	///     l (lowercase 'L') - A full textual representation of the day of the week
	///     N - ISO-8601 numeric representation of the day of the week (starting from 1)
	///     S - English ordinal suffix for the day of the month, 2 characters st,
	///         nd, rd or th. Works well with j.
	///     w - Numeric representation of the day of the week (starting from 0)
	///     z - The day of the year (starting from 0)
	///     W - ISO-8601 week number of year, weeks starting on Monday
	///     F - A full textual representation of a month, such as January or March
	///     m - Numeric representation of a month, with leading zeros
	///     M - A short textual representation of a month, three letters
	///     n - Numeric representation of a month, without leading zeros
	///     t - Number of days in the given month
	///     L - Whether it's a leap year
	///     o - ISO-8601 year number. This has the same value as Y, except that if
	///         the ISO week number (W) belongs to the previous or next year, that
	///         year is used instead.
	///     Y - A full numeric representation of a year, 4 digits
	///     y - A two digit representation of a year
	///     a - Lowercase Ante meridiem and Post meridiem
	///     A - Uppercase Ante meridiem and Post meridiem
	///     B - Swatch Internet time
	///     g - 12-hour format of an hour without leading zeros
	///     G - 24-hour format of an hour without leading zeros
	///     h - 12-hour format of an hour with leading zeros
	///     H - 24-hour format of an hour with leading zeros
	///     i - Minutes with leading zeros
	///     s - Seconds, with leading zeros
	///     u - Milliseconds
	/// </param>
	/// <returns type="String">
	///   Returns the string for this date, formatted according to the given
	///   format string.
	/// </returns>
	// If the format was not passed, use the default toString method.
	if(typeof format !== "string" || /^\s*$/.test(format))
		return this + "";
	var jan1st = new Date(this.getFullYear(), 0, 1);
	var me = this;
	return format.replace(/[dDjlNSwzWFmMntLoYyaABgGhHisu]/g, function(option) {
		switch(option) {
			// Day of the month, 2 digits with leading zeros
			case "d": return ("0" + me.getDate()).replace(/^.+(..)$/, "$1");
			// A textual representation of a day, three letters
			case "D": return shortDays[me.getDay()];
			// Day of the month without leading zeros
			case "j": return me.getDate();
			// A full textual representation of the day of the week
			case "l": return fullDays[me.getDay()];
			// ISO-8601 numeric representation of the day of the week
			case "N": return (me.getDay() + 6) % 7 + 1;
			// English ordinal suffix for the day of the month, 2 characters
			case "S": return getOrdinalFor(me.getDate());
			// Numeric representation of the day of the week
			case "w": return me.getDay();
			// The day of the year (starting from 0)
			case "z": return Math.ceil((jan1st - me) / 86400000);
			// ISO-8601 week number of year, weeks starting on Monday
			case "W": return ("0" + getISO8601Week(me)).replace(/^.(..)$/, "$1");
			// A full textual representation of a month, such as January or March
			case "F": return fullMonths[me.getMonth()];
			// Numeric representation of a month, with leading zeros
			case "m": return ("0" + (me.getMonth() + 1)).replace(/^.+(..)$/, "$1");
			// A short textual representation of a month, three letters
			case "M": return shortMonths[me.getMonth()];
			// Numeric representation of a month, without leading zeros
			case "n": return me.getMonth() + 1;
			// Number of days in the given month
			case "t": return new Date(me.getFullYear(), me.getMonth() + 1, -1).getDate();
			// Whether it's a leap year
			case "L": return new Date(me.getFullYear(), 1, 29).getDate() == 29 ? 1 : 0;
			// ISO-8601 year number. This has the same value as Y, except that if the
			// ISO week number (W) belongs to the previous or next year, that year is
			// used instead.
			case "o": return getISO8601Year(me);
			// A full numeric representation of a year, 4 digits
			case "Y": return me.getFullYear();
			// A two digit representation of a year
			case "y": return (me.getFullYear() + "").replace(/^.+(..)$/, "$1");
			// Lowercase Ante meridiem and Post meridiem
			case "a": return me.getHours() < 12 ? "am" : "pm";
			// Uppercase Ante meridiem and Post meridiem
			case "A": return me.getHours() < 12 ? "AM" : "PM";
			// Swatch Internet time
			case "B": return Math.floor((((me.getUTCHours() + 1) % 24) + me.getUTCMinutes() / 60 + me.getUTCSeconds() / 3600) * 1000 / 24);
			// 12-hour format of an hour without leading zeros
			case "g": return me.getHours() % 12 != 0 ? me.getHours() % 12 : 12;
			// 24-hour format of an hour without leading zeros
			case "G": return me.getHours();
			// 12-hour format of an hour with leading zeros
			case "h": return ("0" + (me.getHours() % 12 != 0 ? me.getHours() % 12 : 12)).replace(/^.+(..)$/, "$1");
			// 24-hour format of an hour with leading zeros
			case "H": return ("0" + me.getHours()).replace(/^.+(..)$/, "$1");
			// Minutes with leading zeros
			case "i": return ("0" + me.getMinutes()).replace(/^.+(..)$/, "$1");
			// Seconds, with leading zeros
			case "s": return ("0" + me.getSeconds()).replace(/^.+(..)$/, "$1");
			// Milliseconds
			case "u": return me.getMilliseconds();
		}
	});
};
})();