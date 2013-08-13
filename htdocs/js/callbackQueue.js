/**
 * MetaPlayer 1.0
 *
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2010-2013 Val Dubrava [ valery.dubrava@gmail.com ]
 *
 */
/**
 * The callback queue provides methods for calling one async function and register a several callbacks for it (after calling).
 * It can handle sync functions but it causes to little overhead.
 * @constructor
 */
function CallbackQueue() {
    this._taskMap = {};
}
/**
 * Register async function with callback using the specified id.
 * If async function with the specified id already registered it just add callback to callback queue.
 * @param {string} id
 * @param {Function} asyncFunction
 * @param {Function} callback
 */
CallbackQueue.prototype.register = function (id, asyncFunction, callback) {
    if (this._taskMap[id] === undefined) {
        this._registerNewTask(id, asyncFunction, callback);
    } else {
        this._registerCallback(this._taskMap[id], callback);
    }
};

/**
 * @param {string} id
 * @param {Function} asyncFunction
 * @param {Function} callback
 */
CallbackQueue.prototype._registerNewTask = function (id, asyncFunction, callback) {
    var that = this;
    var task = new CallbackTask(asyncFunction, callback, function () {
        that._taskMap[id] = undefined;
    });
    this._taskMap[id] = task;
    task.execute();
};

/**
 * @param {CallbackTask} task
 * @param {Function} callback
 * @private
 */
CallbackQueue.prototype._registerCallback = function (task, callback) {
    task.addCallback(callback);
};

/**
 * Task with callback list.
 * @param {Function} asyncFunction Any async function which is waited by callbacks.
 * @param {Function} callback A first callback function.
 * @param {Function} endCallback
 * @constructor
 */
function CallbackTask(asyncFunction, callback, endCallback) {
    /**
     * @type {Function}
     * @private
     */
    this._asyncFunction = asyncFunction;
    /**
     * @type {Function[]}
     * @private
     */
    this._callbacks = [callback];
    /**
     * @type {Function}
     * @private
     */
    this._endCallback = endCallback;
}

CallbackTask.prototype.addCallback = function (callback) {
    this._callbacks.push(callback);
};

CallbackTask.prototype.execute = function () {
    var that = this;
    this._asyncFunction.call(this, function () {
        for (var index in that._callbacks) {
            //noinspection JSUnfilteredForInLoop
            var callback = that._callbacks[index];
            callback.apply(this, arguments);
        }
        that._endCallback.call(this);
    });
};

