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
 * Player facade.
 */
function Player() {
    /**
     * When player started playing.
     */
    this.startPlayingEvent = "startPlaying";
    /**
     * When user clicks play.
     */
    this.playEvent = "play";
    
    this.paused = false;
    
    this.init = function () {
        //bodyLoading.setStatus('initializing player');
        var that = this;
        $('#mainPlayer').jPlayer({
            ready: function () {
                //bodyLoading.resetStatus('player is ready');
                $('.jp-pause').bind('click', function () {
                    that.paused = true;
                    console.log("pause caught, paused", that.paused);
                });
                $('.jp-play').bind('click', function () {
                    console.log("click caught, paused", that.paused);
                    if (!that.paused) {
                        $(that).trigger(that.playEvent, []);
                    }
                    that.paused = false;
                });
                $('.jp-stop').bind('click', function () {
                    that.paused = false; 
                    console.log('media cleared, sopped', that.paused);
                    $(this).jPlayer('clearMedia');
                });
            },
            swfPath: "/js",
            supplied: "mp3"
        });
    }

    /**
     * Start playing the specified node.
     * @param node
     */
    this.play = function (node) {
        $('.jp-title').text(node.getName());
        associationManager.resolve(node.getAssociation(), function (association) {
            $('#mainPlayer').jPlayer("setMedia", {mp3: association.getUrl()})
                .jPlayer("play");
        });
    }

    /**
     * Stops the playing.
     */
    this.stop = function () {
        $('#mainPlayer').jPlayer('stop');
    }

    /**
     * Subscribes to end playing.
     * @param callback
     */
    this.bindEndPlaying = function (callback) {
        $('#mainPlayer').bind($.jPlayer.event.ended, callback);
    }

    /**
     * Subscribe to start playing.
     * @param handler
     */
    this.bindStartPlaying = function (handler) {
        $(this).bind($.jPlayer.event.play, handler);
    }

    /**
     * Subscribe to event caused when user click 'next'.
     * @param handler
     */
    this.bindNext = function (handler) {
        $('.jp-next').bind('click', handler);
    }

    /**
     * Subscribe to event caused when user click 'previous'.
     * @param handler
     */
    this.bindPrevious = function (handler) {
        $('.jp-previous').bind('click', handler);
    }

    /**
     * Subscribe to event caused when user click 'play'.
     * @param handler
     */
    this.bindPlay = function (handler) {
        $(this).bind(this.playEvent, handler);
    }
}

mainPlayer = new Player();
