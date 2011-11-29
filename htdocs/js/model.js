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
    this.name = null;
    this.date = null;
    this.state = "closed";
}

Node.prototype.constructor = Node;

Node.prototype._wakeup = function () {};
Node.prototype.loadChildren = function (callback) {};

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
    this.date = this.foundDate;
    this.parent.prototype._wakeup.call(this);
};

BandNode.prototype.loadChildren = function (callback) {
    new AlbumRepository().list(callback, {"bandId": this.id});
};

/***************************************
 ************** AlbumNode **************
 ***************************************/
function AlbumNode() {
    this.parent();
    
    this.bandId = null;
    this.title = null     
}

AlbumNode.prototype = new Node();
AlbumNode.prototype.parent = Node;