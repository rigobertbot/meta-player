/**
 * MetaPlayer 1.0
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2010-2011 Val Dubrava [ valery.dubrava@gmail.com ] 
 * 
 */
function initMetaTree() {
    easyloader.load('treegrid', function(){
        $.extend($.fn.treegrid.defaults, {
            onBeforeLoad: beforeLoad,
            onContextMenu: function(e, row){
                e.preventDefault();
                // $(this).treegrid('unselectAll');
                // $(this).treegrid('select', row.code);
                $('#mm').menu('show', {
                    left: e.pageX,
                    top: e.pageY
                });
            }
        });
    });
}

function beforeLoad(row, node){
    if (row === null) {
        new BandRepository().list(function (resultData) {
            $('#metaTree').treegrid('loadData', resultData);
        });
    } else {
        $('#metaTree').treegrid('collapse', row.getId());
        row.loadChildren(function (resultData) {
            $('#metaTree').treegrid('append', {
                parent: row.getId(), 
                data: resultData
            });
            $('#metaTree').treegrid('expand', row.getId());
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
            if (!childNoSelected && child instanceof TrackNode) {
                playlist.push(child);
            }
            noSelected &= childNoSelected;
        }
        
        // adds all child nodes if no one node selected and if it TrackNode
        if (noSelected && node.children[0] instanceof TrackNode) {
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

function getPlaylist() {
    var playlist = mainPlaylist;
    
    var selected = $('#metaTree').treegrid('getSelections');
    var traverseToken = new Date().getTime();
    for (var index in selected) {
        var node = selected[index];
        if (node instanceof TrackNode) {
            node.traverseToken = traverseToken;
            playlist.push(node);
            continue;
        }
        recursePlaylist(node, selected, playlist, traverseToken);
    }
    return playlist;
}
            
function play() {
    var playlist = getPlaylist();
    playlist.play();
    console.log(playlist);
    // search(playlist[0], 0);
}