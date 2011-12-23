/**
 * MetaPlayer 1.0
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2010-2011 Val Dubrava [ valery.dubrava@gmail.com ] 
 * 
 */
function Tree() {
    this.loadSuccessEvent =  "loadSuccess";//$.Event("loadSuccess");
    this.expandedEvent = "expanded";
}

mainTree = new Tree();

function initMetaTree() {
    easyloader.load('treegrid', function(){
        $.extend($.fn.treegrid.defaults, {
            onBeforeLoad: beforeLoad,
            onContextMenu: function(e, row){
                e.preventDefault();
                // $(this).treegrid('unselectAll');
                // $(this).treegrid('select', row.code);
                $('#treeMenu').menu('show', {
                    left: e.pageX,
                    top: e.pageY
                });
            },
            onLoadSuccess: function (row, data) {
                // load is ovverided in the beforLoad method, and it has own 'loadSuccess' event.
                // $(mainTree).trigger(mainTree.loadSuccessEvent, [row, data]);
            },
            onExpand: function (row) {
                $(mainTree).trigger(mainTree.expandedEvent, [row]);
            }
        });
    });
}

function beforeLoad(row, node){
    if (row === null) {
        $(this).treegrid('loading');
        new BandRepository().list(function (resultData) {
            $('#metaTree')
                .treegrid('loadData', resultData)
                .treegrid('loaded');
            //console.log("root node loaded");
            $(mainTree).trigger(mainTree.loadSuccessEvent, [null, resultData]);
        });
    } else {
        $('#metaTree').treegrid('collapse', row.getId());
        $(this).treegrid('loading');
        row.loadChildren(function (resultData) {
            $('#metaTree')
                .treegrid('append', {
                    parent: row.getId(), 
                    data: resultData
                })
                .treegrid('expand', row.getId())
                .treegrid('loaded');
            
            //console.log("data appended", resultData);
            $(mainTree).trigger(mainTree.loadSuccessEvent, [row, resultData]);
        });
    }
    return false;
}

function recursePlaylist(node, selected, playlist, traverseToken) {
    if (node.traverseToken === traverseToken)
        return null;
    node.traverseToken = traverseToken;
    var noSelected = true;
    if (node.children && $.isArray(node.children) && node.children.length > 0) {
        for (var childIndex in node.children) {
            var child = node.children[childIndex];
            var childNoSelected = recursePlaylist(child, selected, playlist, traverseToken); 
            if (childNoSelected === null) {
                continue;
            }
            if (!childNoSelected && child.isLeaf()) {
                playlist.push(child);
            }
            noSelected &= childNoSelected;
        }
        
        // adds all child nodes if no one node selected and if it TrackNode
        if (noSelected && node.children[0].isLeaf()) {
            $(node.children).each(function (index, child) {
                playlist.push(child);
            });
        }
    } 

    if (!noSelected) {
        return false;
    }

    return $.inArray(node, selected) === -1; // it means no selected = true
}

function fillPlaylist(playlist) {
    var selected = $('#metaTree').treegrid('getSelections');
    var traverseToken = new Date().getTime();
    for (var index in selected) {
        var node = selected[index];
        //$('#metaTree').treegrid('expandAll', node.getId());
        if (node.isLeaf()) {
            node.traverseToken = traverseToken;
            playlist.push(node);
            continue;
        }
        recursePlaylist(node, selected, playlist, traverseToken);
    }
}

var loadingCounter = 0;

function recurseLoad(node, onLoadedCallback) {
    if (node.isLeaf())
        return;
    
    if (node.children && $.isArray(node.children)) {
        $(node.children).each(function (i, child) {
            loadingCounter ++;
            recurseLoad(child, onLoadedCallback);
            loadingCounter --;
        });
        if (loadingCounter === 0) {
            onLoadedCallback();
        }
    } else {
        $(mainTree).bind(mainTree.loadSuccessEvent + ".recurseExpand" + node.getId(), function (event, parent, loadedNodes) {
            // i want catch only event's of top context node
            if (parent !== node) {
                return;
            }
            loadingCounter --;
            
            //console.log("collapse ", node.getId());
            $('#metaTree').treegrid('collapse', node.getId());

            $(loadedNodes).each(function (i, child) {
                recurseLoad(child, onLoadedCallback);
            });
            $(mainTree).unbind(mainTree.loadSuccessEvent + ".recurseExpand" + node.getId());

            if (loadingCounter === 0) {
                onLoadedCallback();
            }
        });
        //console.log("expand ", node.getId());
        loadingCounter ++;
        $('#metaTree').treegrid('expand', node.getId());
    }
    
    
}

function loadSelected(onLoadedCallback) {
    loadingCounter = 0;
    var selected = $('#metaTree').treegrid('getSelections');
    $(selected).each(function(i, node) {
        recurseLoad(node, onLoadedCallback);
    });
}

function play() {
    loadSelected(function() {
        mainPlaylist.clean();
        fillPlaylist(mainPlaylist);
        mainPlaylist.play();
        $('#bodyAccordion').accordion('select', 'Плейлист');
    });
}