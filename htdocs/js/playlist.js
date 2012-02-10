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
    this.firstPlaying = true;

    this.init = function () {
        var that = this;
        mainPlayer.bindEndPlaying(function () {
            that.playNext(true);
        });
        mainPlayer.bindNext(function () {
            that.playNext(true);
        });
        mainPlayer.bindPrevious(function () {
            that.playPrevious();
        });
        mainPlayer.bindPlay(function () {
            that.play();
        });
        searcher.bindSearchSuccess(function (e, track) {
            var index = $('#playlist').datagrid('getRowIndex', track.getId());
            $('#playlist').datagrid('refreshRow', index);
        });

        easyloader.load('datagrid', function () {
            $('#playlist').datagrid({
                columns: [[
                    {field: 'name', title: 'Название', width: 250},
                    {field: 'duration', title: 'Длит.', width: 30}
                ]],
                rowStyler: function (rowIndex, rowData) {
                    return that.getRowStyle(rowData);
                }
            });
        });
    }
   
    this.push = function(track) {
        if (this.index[track.getId()]) {
            return;
        }
        this.playlist.push(track);
        this.index[track.getId()] = track;
        if (!track.getUrl()) {
            searcher.schedule(track);
        }
    }
    
    this.clear = function () {
        this.playlist = [];
        this.index = [];
    }

    /**
     * Fills playlist with the specified tracks.
     * @param tracks
     */
    this.reload = function (tracks) {
        this.clear();
        for (var i = 0; i < tracks.length; i++) {
            this.push(tracks[i]);
        }
        $('#playlist').datagrid('loadData', this.playlist).datagrid('selectRow', 0);
        this.firstPlaying = true;
    }

    /**
     * Begins playing of the new playlist.
     */
    this.play = function () {
    }

    /**
     * Plays selected node.
     * @return returns true if there is selected songs, otherwise false.
     */
    this.playSelected = function () {
        var selectedNode = $('#playlist').datagrid('getSelected');
        if (!selectedNode) {
            return false;
        }
        console.log('selected ', selectedNode);
        // skip unloaded tracks
        if (!selectedNode.getUrl()) {
            this.playNext(false);
        } else {
            mainPlayer.play(selectedNode);
        }
        return true;
    }
    
    this.playPrevious = function () {
        this.playShift(-1, true);
    }
    
    this.playShift = function (shift, cyclically) {
        if (this.playlist.length <= 0)
            return;
        
        var selectedNode = $('#playlist').datagrid('getSelected');
        var rowIndex = $('#playlist').datagrid('getRowIndex', selectedNode);
        $('#playlist').datagrid('unselectRow', rowIndex);
        rowIndex += shift;
        if (rowIndex < 0 && cyclically) {
            rowIndex = this.playlist.length - 1;
        }
        // exit if not cyclically playing
        if (rowIndex >= this.playlist.length && !cyclically) {
            return;
        }

        if (rowIndex >= this.playlist.length && cyclically) {
            rowIndex = 0;
        }
        $('#playlist').datagrid('selectRow', rowIndex);
        this.playSelected();
        
    }
    
    this.playNext = function (cyclically) {
        this.playShift(+1, cyclically);
    }
    
    this.getRowStyle = function (node) {
        node.urlSetted = function () {
            var index = $('#playlist').datagrid('getRowIndex', this);
            $('#playlist').datagrid('refreshRow', index);
        }
        return node.getUrl() ? '' : 'background:red';
    }

    /**
     * Start playing playlist.
     */
    this.play = function () {
        if (this.playlist.length == 0) {
            messageService.showWarning('Плейлист пуст. Проигрывание с каталога еще не реализовано.');
        }

        if (this.firstPlaying) {
            this.firstPlaying = false;

            // custom case: wait until track url loaded
            var firstNode = this.playlist[0];
            if (!firstNode.getUrl()) {
                var that = this;
                searcher.bindSearchSuccess(function (e, track) {
                    if (track != firstNode)
                        return;
                    that.play();
                });
                return;
            }
        }
        this.playSelected();
    }
    
}

mainPlaylist = new Playlist();
