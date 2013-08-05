/**
 * MetaPlayer 1.0
 *
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2010-2013 Val Dubrava [ valery.dubrava@gmail.com ]
 *
 */
/**
 * Player wrapper for jPlayer.
 * @param element
 * @constructor
 */
function PlayerWrapper(element) {
    this.player = $(element);
    this.paused = false;


    this.play = function (url, callback) {
        this.stop();
        this.player.jPlayer("setMedia", {
            mp3: url
        });
        this.player.jPlayer("play");
        this.paused = false;

        this.player.unbind($.jPlayer.event.playing + '.inner');
        if (callback) {
            console.log('PlayerWrapper.play', 'callback presents', callback);
            var that = this;
            this.player.bind($.jPlayer.event.playing + '.inner', function (event) {
                console.log('PlayerWrapper.play', 'event occurs', event);
                that.player.unbind($.jPlayer.event.playing + '.inner');
                callback.apply(that, arguments);
            });
        }
    };

    this.stop = function () {
        this.player.jPlayer('clearMedia');
    };

    this.playPause = function () {
        if (this.paused) {
            this.player.jPlayer('play');
            this.paused = false;
        } else {
            this.player.jPlayer('pause');
            this.paused = true;
        }
    };

    this._bind = function (event, handler, ns) {
        if (ns && ns.length) {
            if (ns[0] == '.') {
                event += ns;
            } else {
                event = event + '.' + ns;
            }
        }
        return this.player.bind(event, handler)
    };

    this._unbind = function (event, ns) {
        if (ns && ns.length) {
            if (ns[0] == '.') {
                event += ns;
            } else {
                event = event + '.' + ns;
            }
        }
        return this.player.unbind(event);
    };

    this.bindEnded = function (handler, ns) {
        return this._bind($.jPlayer.event.ended, handler, ns);
    };

    this.unbindEnded = function (ns) {
        return this._unbind($.jPlayer.event.ended, ns);
    };

    // constructor
    this.player.jPlayer({
        supplied: "mp3",
        swfPath: "/js"
    });

}