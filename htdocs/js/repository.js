/**
 * MetaPlayer 1.0
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2010-2011 Val Dubrava [ valery.dubrava@gmail.com ] 
 * 
 */
/***************************************
 *********** BaseRepository ************
 ***************************************/
function BaseRepository() {
    this.url = undefined;
    this.nodeLoadedEvent = "nodeLoaded";
    this.nodeUpdatedEvent = "nodeUpdated";
    this.nodeRemovedEvent = "nodeRemoved";
    this.identityMap = [];
}

BaseRepository.prototype.constructor = BaseRepository;

BaseRepository.prototype.onLoaded = function (handler) {
    $(this).bind(this.nodeLoadedEvent, handler);
    console.log('bind', this.nodeLoadedEvent, this, handler);
}
BaseRepository.prototype.onUpdated = function (handler) {
    $(this).bind(this.nodeUpdatedEvent, handler);
    console.log('bind', this.nodeUpdatedEvent, this, handler);
}
BaseRepository.prototype.onRemoved = function (handler) {
    $(this).bind(this.nodeRemovedEvent, handler);
    console.log('bind', this.nodeRemovedEvent, handler);
}

BaseRepository.prototype.dispatch = function (data) {
    if (!$.isArray(data)) {
        data = [data];
    }
    var loaded = [];
    var updated = [];

    for (var index in data) {
        var entity = data[index];
        var identity = entity.id.toString();
        var isNew = this.identityMap[identity] == undefined;
        this.identityMap[identity] = entity;
        if (isNew) {
            loaded.push(entity);
        } else {
            updated.push(entity);
        }
    }
    if (loaded.length > 0) {
        console.log("trigger", this.nodeLoadedEvent, loaded);
        $(this).trigger(this.nodeLoadedEvent, [loaded]);
    }
    if (updated.length > 0) {
        console.log("trigger", this.nodeUpdatedEvent, updated);
        $(this).trigger(this.nodeUpdatedEvent, [updated]);
    }
}

BaseRepository.prototype.dispatchRemove = function (node) {
    var identity = node.id.toString();
    this.identityMap[identity] = undefined;
    $(this).trigger(this.nodeRemovedEvent, [node]);
}

BaseRepository.prototype.list = function (success, params) {
    var url = this.url + 'list';
    var that = this;
    $.getJSON(url, params, function (data, textStatus, jqXHR) {
        var parsedData = $.parseJSONObject(data);
        that.dispatch(parsedData);
        if ($.isFunction(success)) {
            success(parsedData);
        }
    });
}

BaseRepository.prototype.get = function (id, success) {
    var url = this.url + 'get';
    var that = this;
    $.getJSON(url, {"id": id}, function (data, textStatus, jqXHR) {
        var parsedData = $.parseJSONObject(data);
        that.dispatch(parsedData);
        if ($.isFunction(success)) {
            success(parsedData);
        }
    });
}

BaseRepository.prototype.add = function (node, success) {
    var url = this.url + 'add';
    var that = this;
    var data = $.objectToJSON(node);

    $.post(url, {"json": data}, function (result, textStatus, jqXHR) {
        var parsedData = $.parseJSONObject(result);
        that.dispatch(parsedData);
        if ($.isFunction(success)) {
            success(parsedData, node);
        }
    }, "json");
}

BaseRepository.prototype.remove = function (node, success) {
    var url = this.url + 'remove';
    var that = this;
    var id = node.getServerId();

    $.post(url, {"id": id}, function (result, textStatus, jqXHR) {
        that.dispatchRemove(node);
        if ($.isFunction(success)) {
            success(node);
        }
    })
}

/***************************************
 *********** BandRepository ************
 ***************************************/
function BandRepository() {
    this.parent();
    this.url = '/band/';
    this.counter ++;
}

BandRepository.prototype = new BaseRepository();
BandRepository.prototype.parent = BaseRepository;
BandRepository.prototype.counter = 0;
var bandRepository = new BandRepository();

/***************************************
 *********** AlbumRepository ***********
 ***************************************/
function AlbumRepository() {
    this.parent();
    this.url = '/album/';
}

AlbumRepository.prototype = new BaseRepository();
AlbumRepository.prototype.parent = BaseRepository;
var albumRepository = new AlbumRepository();

/***************************************
 *********** TrackRepository ***********
 ***************************************/
function TrackRepository() {
    this.parent();
    this.url = '/track/';
}

TrackRepository.prototype = new BaseRepository();
TrackRepository.prototype.parent = BaseRepository;
var trackRepository = new TrackRepository();
