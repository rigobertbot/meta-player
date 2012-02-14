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
 * Wrapper for treegrid element.
 * @param element DOM element.
 */
function TreeGrid(element, options) {
    this.element = $(element);

    /**
     * Merge existing options with the specified.
     * @param options
     */
    this.setOptions = function (options) {
        this.element.treegrid(options);
        return this;
    }

    if (options) {
        this.setOptions(options);
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
    }

    /**
     * Remove a node and it's children nodes.
     * @param nodeId
     */
    this.remove = function (nodeId) {
        this.element.treegrid('remove', nodeId);
        return this;
    }
    /**
     * Find the specifed node and return the node data.
     * @param nodeId
     * @return Node|null
     */
    this.find = function (nodeId) {
        return this.element.treegrid('find', nodeId);
    }

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
}
