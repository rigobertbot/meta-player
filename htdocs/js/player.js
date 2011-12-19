/**
 * MetaPlayer 1.0
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2010-2011 Val Dubrava [ valery.dubrava@gmail.com ] 
 * 
 */
function Player() {
    this.init = function () {
        $('#mainPlayer').jPlayer({
            ready: function () {
                console.log("player ready");
            },
            swfPath: "/js",
            supplied: "mp3"
        });
    }
    
    this.play = function (node) {
        $('#mainPlayer').jPlayer("setMedia", {mp3: node.getUrl()});
        $('#mainPlayer').jPlayer("play");
    }
    
    this.onEnded = function (callback) {
        $('#mainPlayer').bind($.jPlayer.event.ended, callback);
    }
}

mainPlayer = new Player();
