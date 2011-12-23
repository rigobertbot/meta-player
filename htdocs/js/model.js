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
}

Node.prototype.constructor = Node;

Node.prototype._wakeup = function () {
    this.serverId = this.id;
};
Node.prototype.loadChildren = function (callback) {}
Node.prototype.getId = function () { return this.id; }
Node.prototype.isLeaf = function () { return this.leaf; }

/***************************************
 *************** BandNode **************
 ***************************************/
function BandNode() {
    this.parent();

    this.endDate = null;
    this.foundDate = null;
}

BandNode.prototype = new Node();
BandNode.prototype.parent = Node;

BandNode.prototype._wakeup = function () {
    this.parent.prototype._wakeup.call(this);
    this.id = 'b' + this.id;
    this.date = this.foundDate;
};

BandNode.prototype.loadChildren = function (callback) {
    new AlbumRepository().list(callback, {bandId: this.serverId});
};

/***************************************
 ************** AlbumNode **************
 ***************************************/
function AlbumNode() {
    this.parent();
    
    this.bandId = null;
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
};

AlbumNode.prototype.loadChildren = function (callback) {
    new TrackRepository().list(callback, {albumId: this.serverId});
}

/***************************************
 ************** TrackNode **************
 ***************************************/
function TrackNode() {
    this.parent();
    
    this.albumId = null;
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
    this.duration = Math.floor(durationMs / 60) + ":" + durationMs % 60;
}

TrackNode.prototype.getDurationMs = function () {return this.durationMs;}

TrackNode.prototype.setUrl = function (url) {
    this.url = url;
    if (url && this.urlSetted && typeof this.urlSetted == 'function') {
        this.urlSetted.call(this);
    }
}
TrackNode.prototype.getUrl = function () {return this.url;}
TrackNode.prototype.urlSetted = function () {}
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

TrackNode.prototype._wakeup = function () {
    this.parent.prototype._wakeup.call(this);
    this.id = 't' + this.id;
    this.name = this.title;
    this.state = null;
    this.durationMs = this.duration;
    this.setDuration(this.durationMs);
    this.leaf = true;
};

