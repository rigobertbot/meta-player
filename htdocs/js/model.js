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
    // the flag is this node belongs to user
    this.belongsToUser = false;
    // this node is currently edited
    this.edited = false;
    // key which would be shared
    this.shareId = null;
}

Node.prototype.constructor = Node;

Node.prototype._wakeup = function () {
    this.serverId = this.id;
    this.belongsToUser = true;
}
Node.prototype._sleep = function () {
    var clone = $.extend({}, this);
    clone.id = this.serverId;
    return clone;
}
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
Node.prototype.setSource = function (source) { this.source = source; return this; }
Node.prototype.getSource = function () { return this.source; }
Node.prototype.setDate = function (value) { this.date = value; return this; }
Node.prototype.setDuration = function (value) { this.duration = value; return this; }
Node.prototype.getParentId = function () { return undefined; }
Node.prototype.isBelongsToUser = function () { return this.belongsToUser; }
Node.prototype.isPlayable = function () { return false; }

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
    return this.parent.prototype._sleep.call(this);
}

BandNode.prototype.loadChildren = function (callback) {
    albumRepository.list(callback, {bandId: this.serverId});
};
BandNode.prototype.getFoundDate = function () { return this.foundDate; }
BandNode.prototype.getEndDate = function () { return this.endDate; }
BandNode.prototype.setDate = function (value) {
    this.parent.prototype.setDate.call(this, value);
    this.foundDate = value;
    return this;
}
BandNode.prototype.setFoundDate = function (value) {
    this.foundDate = value;
    this.date = value;
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
    var clone = this.parent.prototype._sleep.call(this);
    clone.bandId = this.serverBandId;
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
AlbumNode.prototype.setReleaseDate = function (value) {
    this.releaseDate = value;
    this.date = value;
    return this;
}
AlbumNode.prototype.setDate = function (value) {
    this.parent.prototype.setDate.call(this, value);
    this.releaseDate = value;
    return this;
}
AlbumNode.prototype.setTitle = function (value) {
    this.title = value;
    this.name = value;
    return this;
}
AlbumNode.prototype.setName = function (value) {
    this.parent.prototype.setName.call(this, value);
    this.title = value;
    return this;
}
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
    this.association = null;
}

TrackNode.prototype = new Node();
TrackNode.prototype.parent = Node;

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

TrackNode.prototype._sleep = function () {
    var clone = this.parent.prototype._sleep.call(this);
    clone.albumId = this.serverAlbumId;
    clone.duration = this.durationMs;
    return clone;
}

TrackNode.prototype.getDurationMs = function () {return this.durationMs;}
TrackNode.prototype.setDuration = function (durationMs) {
    this.durationMs = durationMs;
    this.duration = Math.floor(durationMs / 60) + ":" + $.format('{0:02d}', durationMs % 60);
    return this;
}


TrackNode.prototype.setUrl = function (url) {
    this.url = url;
}
TrackNode.prototype.getUrl = function () {return this.url;}
TrackNode.prototype.setParentAlbum = function (album) {
    this.albumId = 'a' + album.getServerId();
    this.serverAlbumId = album.getServerId();
    return this;
}
TrackNode.prototype.setTitle = function (value) {
    this.title = value;
    this.name = value;
    return this;
}
TrackNode.prototype.setName = function (value) {
    this.parent.prototype.setName.call(this, value);
    this.title = value;
    return this;
}
TrackNode.prototype.setSerial = function (value) { this.serial = value; return this; }
TrackNode.prototype.getSerial = function () { return this.serial; }
/**
 * Increment and return previous value.
 */
TrackNode.prototype.incSearchTries = function() { return ++ this.searchTries; }
TrackNode.prototype.getSearchTries = function () { return this.searchTries; }
TrackNode.prototype.resetSearchTries = function () { this.searchTries = 0; return this; }

TrackNode.prototype.getQuery = function (index) {
    if (index === undefined) {
        index = this.searchTries;
    }
    if (!this.queries || this.queries.length <= index) {
        return false;
    }
    return this.queries[index];
}

TrackNode.prototype.getFullName = function () { return this.getQuery(0); }
TrackNode.prototype.getShortName = function () { return this.getQuery(1); }

TrackNode.prototype.getParentId = function () { return this.albumId; }
TrackNode.prototype.isPlayable = function () { return true; }
/**
 * @return Association
 */
TrackNode.prototype.getAssociation = function () { return this.association; }
TrackNode.prototype.setAssociation = function (association) { this.association = association; return this; }

/********************************/
/********* Association **********/
/********************************/
var associationExpirationTimeMs = 8*60*60*1000; // 8h
function Association()  {
    this.className = 'Association';
    this.id = null;
//    this.trackId = null;
//    this.serverTrackId = null;
    this.socialId = null;
    this.popularity = 0;
    this.expiredOn = 0;
    this.audio = null;
    this.status = 'Social';
}

Association.prototype._wakeup = function () {
//    this.serverTrackId = this.trackId;
//    this.trackId = 't' + this.trackId;
}

Association.prototype._sleep = function () {
//    this.trackId = this.serverTrackId;
    return this;
}

//Association.prototype.setTrack = function(track) {
//    this.trackId = track.id;
//    this.serverTrackId = track.getServerId();
//    return this;
//}

Association.prototype.setSocialId = function (socialId) {
    this.socialId = socialId;
    return this;
}

Association.prototype.getSocialId = function () { return this.socialId; }

Association.prototype.resolve = function (audio) {
    this.audio = audio;
    this.expiredOn = new Date().getTime() + associationExpirationTimeMs;
    return this;
}

Association.prototype.isResolved = function() {
    return this.audio != null && new Date().getTime() <= this.expiredOn;
}

Association.prototype.getUrl = function () {
    return this.audio ? this.audio.url : null;
}

Association.prototype.getDuration = function () {
    return this.audio ? this.audio.duration : null;
}

/********************************/
/************ State *************/
/********************************/
