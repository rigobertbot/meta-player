/**
 * MetaPlayer 1.0
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2010-2011 Val Dubrava [ valery.dubrava@gmail.com ] 
 * 
 */
function Playlist() {
    this.playlist = [];
    this.index = [];

    this.init = function () {
        var that = this;
        mainPlayer.onEnded(function () {
            that.playNext();
        });
    }
   
    this.push = function(track) {
        if (this.index[track.getId()]) {
            return;
        }
        this.playlist.push(track);
        this.index[track.getId()] = track;
        addToSearch(track);
    }
    
    this.clean = function () {
        this.playlist = [];
        this.index = [];
    }
    
    this.play = function () {
        $('#playlist').datagrid('loadData', this.playlist).datagrid('selectRow', 0);
        // custom case: wait until track url loaded
        if (this.playlist.length > 0) {
            var firstNode = this.playlist[0];
            if (firstNode.getUrl()) {
                mainPlayer.play(firstNode);
            } else {
                var previous = firstNode.urlSetted;
                firstNode.urlSetted = function () {
                    mainPlayer.play(this);
                    previous.call(this);
                }
            }
        }
    }
    
    this.playSelected = function () {
        var selectedNode = $('#playlist').datagrid('getSelected');
        // skip unloaded tracks
        if (!selectedNode.getUrl()) {
            this.playNext();
            return;
        }
        mainPlayer.play(selectedNode);
    }
    
    this.playNext = function () {
        if (this.playlist.length <= 0)
            return;
        
        var selectedNode = $('#playlist').datagrid('getSelected');
        var rowIndex = $('#playlist').datagrid('getRowIndex', selectedNode);
        $('#playlist').datagrid('unselectRow', rowIndex);
        rowIndex ++;
        if (rowIndex >= this.playlist.length) {
            // cicle playing
            rowIndex = 0;
        }
        $('#playlist').datagrid('selectRow', rowIndex);
        this.playSelected();
    }
    
    this.getRowStyle = function (node) {
        node.urlSetted = function () {
            var index = $('#playlist').datagrid('getRowIndex', this);
            $('#playlist').datagrid('refreshRow', index);
        }
        return node.getUrl() ? '' : 'background:red';
    }
    
}

mainPlaylist = new Playlist();

easyloader.load('datagrid', function () {
    $.extend($.fn.datagrid.defaults, {
        rowStyler: function (rowIndex, rowData) {
            switch ($(this).attr('id')) {
                case 'playlist':
                    return mainPlaylist.getRowStyle(rowData);
                    break;
                default:
                    return null;
                    break;
            }
        }
    });
});
