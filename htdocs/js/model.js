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
 ***************** Node ****************
 ***************************************/
function Node() {
    this.className = 'Node';
    this.id = null;
    this.serverId = null;
    this.name = null;
    this.date = null;
    this.duration = null;
    this.state = "closed";
    this.checked = false;
    this.traverseToken = null;
    // Means node has no children.
    this.leaf = false;
    // for editing node: information source
    this.source = null;
}

Node.prototype.constructor = Node;

Node.prototype._wakeup = function () {
    this.serverId = this.id;
};
Node.prototype.loadChildren = function (callback) {}
Node.prototype.getId = function () { return this.id; }
Node.prototype.setId = function (value) { this.id = value; return this; }
Node.prototype.isLeaf = function () { return this.leaf; }
Node.prototype.getName = function () { return this.name; }
Node.prototype.setName = function (value) {
    this.name = value;
    return this;
}
Node.prototype.getServerId = function () { return this.serverId; }
Node.prototype.setServerId = function (value) { this.serverId = value; return this; }
Node.prototype.setSource = function (source) { this.source = source; }
Node.prototype.setDate = function (value) { this.date = value; return this; }
Node.prototype.setDuration = function (value) { this.date = value; return this; }
Node.prototype.getParentId = function () { return undefined; }

/***************************************
 *************** BandNode **************
 ***************************************/
function BandNode() {
    this.parent();
    this.className = 'BandNode';

    this.endDate = null;
    this.foundDate = null;
}

BandNode.prototype = new Node();
BandNode.prototype.parent = Node;

BandNode.prototype._wakeup = function () {
    this.parent.prototype._wakeup.call(this);
    this.id = 'b' + this.id;
    this.setDate(this.foundDate);
};
BandNode.prototype._sleep = function () {
    return this;
}

BandNode.prototype.loadChildren = function (callback) {
    albumRepository.list(callback, {bandId: this.serverId});
};
BandNode.prototype.getFoundDate = function () { return this.foundDate; }
BandNode.prototype.getEndDate = function () { return this.endDate; }
BandNode.prototype.setFoundDate = function (value) {
    this.foundDate = value;
    this.setDate(this.foundDate);
    return this;
}
BandNode.prototype.setEndDate = function (value) {
    this.endDate = value;
    return this;
}

/***************************************
 ************** AlbumNode **************
 ***************************************/
function AlbumNode() {
    this.parent();
    this.className = 'AlbumNode';
    
    this.bandId = null;
    this.serverBandId = null;
    this.title = null;
    this.releaseDate = null;
}

AlbumNode.prototype = new Node();
AlbumNode.prototype.parent = Node;

AlbumNode.prototype._wakeup = function () {
    this.parent.prototype._wakeup.call(this);
    this.id = 'a' + this.id;
    this.date = this.releaseDate;
    this.name = this.title;
    this.serverBandId = this.bandId;
    this.bandId = 'b' + this.bandId;
}

AlbumNode.prototype._sleep = function () {
    var clone = $.extend({}, this);
    clone.bandId = this.serverBandId;
    clone.id = this.serverId;
    return clone;
}
/**
 * Sets parent band server id.
 * @param value Band server id.
 */
AlbumNode.prototype.setParentBand = function (band) {
    this.serverBandId = band.getServerId();
    this.bandId = 'b' + band.getServerId();
    return this;
}

AlbumNode.prototype.loadChildren = function (callback) {
    trackRepository.list(callback, {albumId: this.serverId});
}

AlbumNode.prototype.getReleaseDate = function () { return this.releaseDate; }
AlbumNode.prototype.setReleaseDate = function (value) { this.releaseDate = value; this.setDate(value); return this; }
AlbumNode.prototype.setTitle = function (value) { this.title = value; this.setName(value); return this; }
AlbumNode.prototype.getParentId = function () { return this.bandId; }

/***************************************
 ************** TrackNode **************
 ***************************************/
function TrackNode() {
    this.parent();
    this.className = 'TrackNode';
    
    this.albumId = null;
    this.serverAlbumId = null;
    this.title = null;
    this.serial = null;
    this.durationMs = null;
    this.queries = null;
    this.url = null;
    this.searchTries = 0;
}

TrackNode.prototype = new Node();
TrackNode.prototype.parent = Node;

TrackNode.prototype.setDuration = function (durationMs) {
    this.durationMs = durationMs;
    this.duration = Math.floor(durationMs / 60) + ":" + durationMs % 60;
}

TrackNode.prototype._wakeup = function () {
    this.parent.prototype._wakeup.call(this);
    this.id = 't' + this.id;
    this.name = this.title;
    this.state = null;
    this.durationMs = this.duration;
    this.setDuration(this.durationMs);
    this.leaf = true;
    this.serverAlbumId = this.albumId;
    this.albumId = 'a' + this.albumId;
};
TrackNode.prototype.getDurationMs = function () {return this.durationMs;}

TrackNode.prototype.setUrl = function (url) {
    this.url = url;
    if (url && this.urlSetted && typeof this.urlSetted == 'function') {
        this.urlSetted.call(this);
    }
}
TrackNode.prototype.getUrl = function () {return this.url;}
TrackNode.prototype.urlSetted = function () {}
//TrackNode.prototype.set
TrackNode.prototype.setParentAlbum = function (album) {
    this.albumId = 'a' + album.getServerId();
    this.serverAlbumId = album.getServerId();
    return this;
}
TrackNode.prototype.setTitle = function (value) { this.title = value; this.setName(value); return this; }
TrackNode.prototype.setSerial = function (value) { this.serial = value; return this; }
/**
 * Increment and return previous value.
 */
TrackNode.prototype.incSearchTries = function() { return this.searchTries ++; }


TrackNode.prototype.getQuery = function (strictLevel) {
    if (!this.queries || this.queries.length <= strictLevel) {
        return false;
    }
    return this.queries[strictLevel];
}


TrackNode.prototype.getParentId = function () { return this.albumId; }

