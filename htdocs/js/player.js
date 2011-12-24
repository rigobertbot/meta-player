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
    this.onStartPlayingEvent = "startPlaying";
    
    this.paused = false;
    
    this.init = function () {
        var that = this;
        $('#mainPlayer').jPlayer({
            ready: function () {
                console.log("player ready");
                $('.jp-play').bind('click', function () {
                    that.paused = false;
                });
                $('.jp-pluse').bind('click', function () {
                    that.paused = true;
                })
                $('.jp-play').bind('click', function () {
                    console.log("click cought, paused", that.paused);
                    if (!that.paused) {
                        $(that).trigger(that.onStartPlayingEvent, []);
                    }
                });
                $('.jp-stop').bind('click', function () {
                    that.paused = false; 
                    console.log('media cleared, paused', that.paused);
                    $(this).jPlayer('clearMedia');
                });
            },
            swfPath: "/js",
            supplied: "mp3"
        });
    }
    
    this.play = function (node) {
        $('#mainPlayer').jPlayer("setMedia", {mp3: node.getUrl()})
                        .jPlayer("play");
        $('.jp-title').text(node.getName());
    }
    
    this.onEnded = function (callback) {
        $('#mainPlayer').bind($.jPlayer.event.ended, callback);
    }
    
    this.onStartPlaying = function (callback) {
        $(this).bind(this.onStartPlayingEvent, callback);
    }
    
    this.onNext = function (callback) {
        $('.jp-next').bind('click', callback);
    }
    
    this.onPrevious = function (callback) {
        $('.jp-previous').bind('click', callback);
    }
}

mainPlayer = new Player();
