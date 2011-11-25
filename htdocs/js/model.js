function Node() {
    this.id = null;
    this.name = null;
    this.date = null;
    this.state = "closed";
}

Node.prototype.constructor = Node;

Node.prototype._wakeup = function () {
}

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
}