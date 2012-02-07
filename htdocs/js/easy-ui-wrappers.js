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
    }

    /**
     * Cancel editing a node.
     * @param nodeId
     */
    this.cancelEdit = function (nodeId) {
        this.element.treegrid('cancelEdit', nodeId);
    }

    /**
     * Begin editing a node.
     * @param nodeId
     */
    this.beginEdit = function (nodeId) {
        this.element.treegrid('beginEdit', nodeId);
    }

    /**
     * Refresh the specified node.
     * @param nodeId
     */
    this.refresh = function (nodeId) {
        this.element.treegrid('refresh', nodeId);
    }

    /**
     * Display loading status.
     */
    this.loading = function () {
        this.element.treegrid('loading');
    }

    /**
     * Hide loading status.
     */
    this.loaded = function () {
        this.element.treegrid('loaded');
    }

    /**
     * Display the specified column.
     * @param field
     */
    this.showColumn = function (field) {
        this.element.treegrid('showColumn', field);
    }

    /**
     * Hide the specified column.
     * @param field
     */
    this.hideColumn = function (field) {
        this.element.treegrid('hideColumn', field);
    }
}
