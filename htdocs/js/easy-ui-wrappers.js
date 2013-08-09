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
 * Wrapper for treegrid element.
 * @param element DOM element.
 */
function TreeGrid(element, options) {
    this.expandedEvent = "treeGridExpanded";

    this.element = $(element);
    this.lastExpanedNodeId = null;

    /**
     * Merge existing options with the specified.
     * @param options
     */
    this.setOptions = function (options) {
        this.element.treegrid(options);
        return this;
    }

    if (options) {
        if (!options) {
            return;
        }
        var that = this;
        options.onExpand = function (row) {
            if (that.lastExpanedNodeId == row.id) {
                that.lastExpanedNodeId = null;
                $(that).trigger(that.expandedEvent, [row]);
            }
        }
        this.setOptions(options);
    }

    // events
    this.bindExpanded = function (handler, ns) {
        ns = ns ? "." + ns : '';
        $(this).bind(this.expandedEvent + ns, handler);
    }

    this.unbindExpanded = function (ns) {
        ns = ns ? "." + ns : '';
        $(this).unbind(this.expandedEvent + ns);
    }

    /**
     * Return the options object.
     */
    this.getOptions = function () {
        return this.element.treegrid('options');
    }

    /**
     * End editing a node.
     * @param nodeId
     */
    this.endEdit = function (nodeId) {
        this.element.treegrid('endEdit', nodeId);
        return this;
    }

    /**
     * Cancel editing a node.
     * @param nodeId
     */
    this.cancelEdit = function (nodeId) {
        this.element.treegrid('cancelEdit', nodeId);
        return this;
    }

    /**
     * Begin editing a node.
     * @param nodeId
     */
    this.beginEdit = function (nodeId) {
        this.element.treegrid('beginEdit', nodeId);
        return this;
    }

    /**
     * Refresh the specified node.
     * @param nodeId
     */
    this.refresh = function (nodeId) {
        this.element.treegrid('refresh', nodeId);
        return this;
    };

    /**
     * Remove a node and it's children nodes.
     * @param nodeId
     */
    this.remove = function (nodeId) {
        this.element.treegrid('remove', nodeId);
        return this;
    };

    /**
     * Find the specifed node and return the node data.
     * @param nodeId
     * @return Node|null
     */
    this.find = function (nodeId) {
        return this.element.treegrid('find', nodeId);
    };

    /**
     * Display loading status.
     */
    this.loading = function () {
        this.element.treegrid('loading');
        return this;
    }

    /**
     * Hide loading status.
     */
    this.loaded = function () {
        this.element.treegrid('loaded');
        return this;
    }

    /**
     * Display the specified column.
     * @param field
     */
    this.showColumn = function (field) {
        this.element.treegrid('showColumn', field);
        return this;
    }

    /**
     * Hide the specified column.
     * @param field
     */
    this.hideColumn = function (field) {
        this.element.treegrid('hideColumn', field);
        return this;
    }

    /**
     * Collapse a node.
     * @param nodeId
     */
    this.collapse = function (nodeId) {
        this.element.treegrid('collapse', nodeId);
        return this;
    }

    /**
     * Expand a node.
     * @param nodeId
     */
    this.expand = function (nodeId) {
        this.lastExpanedNodeId = nodeId;
        this.element.treegrid('expand', nodeId);
        return this;
    }

    /**
     * Get all selected nodes.
     */
    this.getSelections = function () {
        return this.element.treegrid('getSelections');
    }

    /**
     * Load the treegrid data.
     * @param data
     */
    this.loadData = function (nodes) {
        this.element.treegrid('loadData', nodes);
        return this;
    }

    /**
     * Append nodes to a parent node.
     * @param parentId Might be null.
     * @param nodes
     */
    this.append = function (parentId, nodes) {
        this.element.treegrid('append', {
            parent: parentId,
            data: nodes
        });
        return this;
    }

    /**
     * Gets parent of the specified node.
     * @param nodeId
     * @return Node
     */
    this.getParent = function (nodeId) {
        return this.element.treegrid('getParent', nodeId);
    }

    /**
     * Gets parent on the specified level from current node.
     * @param node
     * @param levels
     * @return node
     */
    this.getParentRecursive = function (node, levels) {
        if (!node) {
            return node;
        }
        if (!levels) {
            return node;
        }
        return this.getParentRecursive(this.getParent(node.id), levels - 1);
    }

    /**
     * Gets parent while condition is not return true.
     * @param node
     * @param condition
     * @return Node
     */
    this.getParentWhile = function (node, condition) {
        if (condition(node)) {
            return node;
        }
        return this.getParentWhile(this.getParent(node.id), condition);
    }

    /**
     * Get the root nodes, return node array.
     * @return Node[]
     */
    this.getRoots = function () {
        return this.element.treegrid('getRoots');
    }

    /**
     * Get the children nodes.
     * @param nodeId
     * @return Node[]
     */
    this.getChildren = function (nodeId) {
        return this.element.treegrid('getChildren', nodeId);
    }

    this.getNode = function (nodeId) {
        return this.element.treegrid('find', nodeId);
    }

    /**
     * Loads children node. Return true if load begun. False, if children already loaded (or if invalid node id).
     * @param nodeId int
     * @param callback Function
     */
    this.loadChildren = function (nodeId, callback) {
        var node = this.getNode(nodeId);
        if (!node) {
            callback.call(this, null);
            return;
        }
        if ($.isArray(node.children)) {
            callback.call(this, node.children);
            return;
        }
        if (node.state != 'closed') {
            // this node hasn't children at all
            callback.call(this, null);
            return;
        }
        var ns = 'local' + Math.random();
        var that = this;
        this.bindExpanded(function (event, expandedNode) {
            if (expandedNode !== node) {
                return;
            }
            this.unbindExpanded(ns);
            callback.call(that, node.children);
        }, ns);
        this.expand(nodeId);
    }

    /**
     * Gets next sublining node or null if it's the last node.
     * @param nodeId
     * @return Node
     */
    this.getNext = function (nodeId) {
        var children = [];
        var parent = this.getParent(nodeId);
        if (parent == null) {
            children = this.getRoots();
        } else {
            children = parent.children;
        }
        var returnNext = false;
        for (var i in children) {
            var child = children[i];
            if (returnNext) {
                return child;
            }
            if (child.id == nodeId) {
                returnNext = true;
            }
        }
        if (returnNext) {
            return null;
        }
        throw "The specified node is not present in child list of its parent. Or not a root node.";
    }

    /**
     * Gets previous sublining node or null if it's the first node.
     * @param nodeId
     * @return Node
     */
    this.getPrevious = function (nodeId) {
        var children = [];
        var parent = this.getParent(nodeId);
        if (parent == null) {
            children = this.getRoots();
        } else {
            children = this.getChildren(parent.id);
        }
        var previous = null;
        for (var i in children) {
            var child = children[i];
            if (child.id == nodeId) {
                return previous;
            }
            previous = child;
        }
        throw "The specified node is not present in child list of its parent. Or not a root node.";
    };

    /**
     * Reload data.
     */
    this.reload = function () {
        this.element.treegrid('reload');
        return this;
    };

    /**
     * Get pager.
     * @return {*}
     */
    this.getPager = function () {
        return this.element.treegrid('getPager');
    }
}
