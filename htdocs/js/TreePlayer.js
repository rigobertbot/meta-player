/**
 * MetaPlayer 1.0
 *
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2010-2011 Val Dubrava [ valery.dubrava@gmail.com ]
 *
 */


/**
 * Tree Player provide methods for playing tracks from the tree.
 */
function TreePlayer(tree, player, searcher) {
    "use strict";
    this.changeCurrentEvent = "treePlayerChangeCurrent";
    this.changeStartEvent = "treePlayerChangeStart";
    this.startNode = null;
    this.currentNode = null;

    /**
     * @type TreeGrid
     */
    this.tree = tree;
    /**
     * @type Player
     */
    this.player = player;

    /**
     * @type Searcher
     */
    this.searcher = searcher;

    this.init = function () {
        var that = this;
        this.player.bindPlay(function () {
            console.log('play');
            that.play();
        });
        this.player.bindNext(function () {
            console.log('play next');
            that.playNext(true);
        });
        this.player.bindEndPlaying(function () {
            console.log('end playing, play next');
            that.playNext(false);
        });
        this.player.bindPrevious(function () {
            console.log('play previous');
            that.playPrevious();
        });
    };

    this.bindChangeCurrent = function (handler, ns) {
        ns = ns ? '.' + ns : '';
        $(this).bind(this.changeCurrentEvent + ns, handler);
    };

    this.triggerChangeCurrent = function (lastNode, currentNode) {
        $(this).trigger(this.changeCurrentEvent, [lastNode, currentNode]);
    };

    this.bindChangeStart = function (handler, ns) {
        ns = ns ? '.' + ns : '';
        $(this).bind(this.changeStartEvent + ns, handler);
    };

    this.triggerChangeStart = function (lastNode, startNode) {
        $(this).trigger(this.changeStartEvent, [lastNode, startNode]);
    };

    this.setCurrent = function (node) {
        var lastNode = this.currentNode;
        this.currentNode = node;
        this.triggerChangeCurrent(lastNode, node);
    };

    this.startPlaying = function (node) {
        var lastNode = this.startNode;
        this.startNode = node;
        this.triggerChangeStart(lastNode, node);
        this.setCurrent(null);
        this.play(node);
    };

    this.getNextUp = function (node) {
        var parent = this.tree.getParent(node.id);
        // stops if this is a top node (we started from it)
        if (parent === this.startNode) {
            return parent;
        }
        if (parent) {
            // try to find next on the same line
            var nextParent = this.tree.getNext(parent.id);
            if (nextParent) {
                return nextParent;
            }
            this.getNextUp(parent);
        }
        return node;
    };

    this.loadLastDown = function (node, callback) {
        var that = this;
        this.tree.loadChildren(node.id, function (children) {
            if (children) {
                callback.call(that, children[children.length - 1]);
                return;
            }
            callback.call(that, node);
        });
    };

    this.loadPrevious = function (node, callback) {
        if (node === this.startNode) {
            // callback.call(this, node);
            return;
        }
        var previous = this.tree.getPrevious(node.id);
        if (previous !== null) {
            callback.call(this, previous);
            return;
        }
        var parent = this.tree.getParent(node.id);
        this.loadLastDown(parent, callback);
    };

    this.loadNext = function (node, callback) {
        var that = this;
        // gos down
        this.tree.loadChildren(node.id, function (children) {
            if (children && children.length) {
                callback.call(that, children[0]);
                return;
            }
            // stops if this is a top node
            if (node === that.startNode) {
                callback.call(that, node);
                return;
            }
            // gos next on the same line
            var nextNode = that.tree.getNext(node.id);
            if (nextNode) {
                callback.call(that, nextNode);
                return;
            }
            // gos up
            var nextUpNode = that.getNextUp(node);
            callback.call(that, nextUpNode);
        });
    };

    this.loadNextPlayable = function (node, callback) {
        var that = this;
        var loadedNext = function (current) {
            if (current === null || current === node || current.isPlayable()) {
                callback.call(that, current);
                return;
            }
            that.loadNext(current, loadedNext);
        };

        this.loadNext(node, loadedNext);
    };

    this.loadPreviousPlayable = function (node, callback) {
        var that = this;
        var loadedPrev = function (current) {
            if (current === null || current === node || current.isPlayable()) {
                callback.call(that, current);
                return;
            }
            that.loadPrevious(current, loadedPrev);
        };
        that.loadPrevious(node, loadedPrev);
    };

    /**
     * Plays the specified or current node.
     * @param callbackNext function|null
     * @param node Node|null
     */
    this.play = function (node, callbackNext) {
        if (!node) {
            node = this.currentNode;
        }

        if (!node.isPlayable()) {
            this.loadNextPlayable(node, function (nextNode) {
                if (nextNode === node) {
                    // stop playing
                    this.setCurrent(null);
                    return;
                }
                this.play(nextNode);
            });
            return;
        }

        this.setCurrent(node);
        if (!node.getAssociation()) {
            if (!node.getQuery()) {
                callbackNext.call(this);
                return;
            }
            var that = this;
            this.searcher.bindSearchSuccess(function (e, searchedNode) {
                if (node === searchedNode) {
                    that.player.play(searchedNode);
                }
            });
            this.searcher.bindSearchFailed(function (e, failedNode) {
                if (node ===  failedNode) {
                    callbackNext.call(that);
                }
            });
            return;
        }
        this.player.play(node);
    };

    /**
     * Play next node from current. Stops if the same node.
     * @param force Force next node.
     */
    this.playNext = function (force) {
        var current = this.currentNode;
        if (current === null) {
            current = this.startNode;
        }

        this.loadNextPlayable(current, function (nextNode) {
            if (nextNode === null) {
                this.setCurrent(null);
                if (!force) {
                    this.player.stop();
                    return;
                }
                nextNode = this.startNode;
            } else if (!force && nextNode === current) {
                return;
            }
            this.play(nextNode, this.playNext);
        });
    };

    this.playPrevious = function () {
        if (this.currentNode === null) {
            return;
        }
        this.loadPreviousPlayable(this.currentNode, function (prevNode) {
            if (prevNode === null) {
                this.setCurrent(null);
                return;
            }
            this.play(prevNode, this.playPrevious);
        });
    };

    this.init();
    console.log('tree player successfully initialized.');
}
