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
    
    this.push = function(track) {
        this.playlist.push(track);
        addToSearch(track);
    }
    
    this.play = function () {
        $('#playlist').datagrid('loadData', this.playlist);
        console.log("play!!!!");
    }
}

mainPlaylist = new Playlist();

