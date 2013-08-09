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
 * Identity map persists whole domain objects in tree and plain format. It provides tee and plain (by id) access methods.
 * @constructor
 */
function IdentityMap() {
    "use strict";
    /** TreeNode by id */
    this.identityMap = {};
    this.tree = [];
    this.bandRepository = new BandRepository();
    this.albumRepository = new AlbumRepository();
    this.trackRepository = new TrackRepository();
    this.repositories = [this.bandRepository, this.albumRepository, this.trackRepository];

    this.init = function () {
        var that = this;
        var handlerLoaded = function (nodes) {
            that._onNodesLoaded(nodes);
        };
        var handlerRemoved = function (nodes) {
            that._onNodeRemoved(nodes);
        };
        $(this.repositories).each(function (index, repo) {
            repo.bindOnLoaded(handlerLoaded);
            repo.bindOnRemoved(handlerRemoved);
        });
    };

    this._onNodesLoaded = function (nodes) {
        for (var index in nodes) {
            if (!nodes.hasOwnProperty(index)) continue;
            var node = nodes[index];

            var treeNode = null;
            if (node.getParentId() === null) {
                treeNode = new TreeNode(node, null, null);
                this.tree.push(treeNode);
                this.identityMap[node.getId()] = treeNode;
            } else {
                var parentTreeNode = this.identityMap[node.getParentId()];
                if (parentTreeNode === null) {
                    throw "Identity map does not have parent (" + node.getParentId() + ") of loaded node (" + node.getId() + ").";
                }
                treeNode = new TreeNode(node, parentTreeNode, null);
                parentTreeNode.addChild(treeNode);
                this.identityMap[node.getId()] = treeNode;
            }
        }
    };

    this._onNodeRemoved = function (nodes) {
        for (var index in nodes) {
            if (!nodes.hasOwnProperty(index)) continue;
            var node = nodes[index];
            var treeNode = this.identityMap[node.getId()];
            if (treeNode === null) {
                throw "Identity map does not have removed node (" + node.getId() + ").";
            }
            treeNode.setRemoved(true);
            //TODO: possible recursive removed required.
        }
    };

    /**
     * @param callback function(Node[]);
     * @return {IdentityMap}
     */
    this.getRootNodes = function (callback) {
        if (this.tree.length != 0) {
            var nodes = [];
            for (var index in this.tree) {
                if (!this.tree.hasOwnProperty(index)) continue;

                var treeNode = this.tree[index];
                nodes.push(treeNode.getNode());
            }
            callback(nodes);
            return this;
        }
        var that = this;
        this.bandRepository.list(function () {
            if (that.tree.length == 0) {
                callback([]);
                return;
            }
            that.getRootNodes(callback);
        });
        return this;
    };

    /**
     * @param parentNode Node
     * @return {IdentityMap}
     * @param callback function(Node[]);
     */
    this.getChildren = function (parentNode, callback) {
        var treeNode = this.identityMap[parentNode.getId()];
        if (treeNode === null) {
            throw "Identity map does not have the specified parent node (" + parentNode.getId() + ").";
        }
        if (treeNode.getChildrenTreeNodes() !== null) {
            callback(treeNode.getChildren());
            return this;
        }
        var that = this;
        treeNode.getNode().loadChildren(function () {
            if (treeNode.getChildrenTreeNodes() === null) {
                callback([]);
            }
            that.getChildren(parentNode, callback);
        });
        return this;
    };
}

/**
 * Tree node definition (node holder).
 * @constructor
 * @param node Node
 * @param childTreeNodes TreeNode[]|null
 * @param parentTreeNode TreeNode|null
 */
function TreeNode(node, parentTreeNode, childTreeNodes) {
    /**
     * @type {Node}
     * @private
     */
    this._node = node;
    /**
     * @type {TreeNode}
     * @private
     */
    this._parentTreeNode = parentTreeNode;
    /**
     * @type {TreeNode}
     * @private
     */
    this._childTreeNodes = childTreeNodes;
    /**
     * @type {boolean}
     * @private
     */
    this._removed = false;
}

/**
 * @returns {Node}
 */
TreeNode.prototype.getNode = function () { return this._node; };
/**
 * @returns {Node}
 */
TreeNode.prototype.getParent = function () { return this._parentTreeNode ? this._parentTreeNode.getNode() : null; };
/**
 * @param treeNode {TreeNode}
 * @returns {TreeNode}
 */
TreeNode.prototype.addChild = function (treeNode) {
    if (this._childTreeNodes === null) {
        this._childTreeNodes = [];
    }
    this._childTreeNodes.push(treeNode);
    return this;
};
/**
 * @returns {TreeNode[]|null}
 */
TreeNode.prototype.getChildrenTreeNodes = function () { return this._childTreeNodes; };
/**
 * @returns {Node[]|null}
 */
TreeNode.prototype.getChildren = function () {
    if (this._childTreeNodes === null) {
        return null;
    }
    var nodes = [];
    for (var index in this._childTreeNodes) {
        if (!this._childTreeNodes.hasOwnProperty(index)) continue;
        var treeNode = this._childTreeNodes[index];
        nodes.push(treeNode.getNode());
    }
    return nodes;
};
/**
 * @returns {TreeNode}
 */
TreeNode.prototype.getParentTreeNode = function () { return this._parentTreeNode; };
/**
 * @returns {boolean}
 */
TreeNode.prototype.isRemoved = function () { return this._removed; };
/**
 * @param isRemoved {boolean}
 */
TreeNode.prototype.setRemoved = function (isRemoved) {
    if (isRemoved === null) isRemoved = true;
    this._removed = isRemoved;
};