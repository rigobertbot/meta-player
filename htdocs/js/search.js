/**
 * MetaPlayer 1.0
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2010-2011 Val Dubrava [ valery.dubrava@gmail.com ] 
 * 
 */
function Searcher() {
    this.maximumSearchTries = 5;
    this.searchQueue = [];
    this.searchSuccessEvent = "searchSuccess";

    this.bindSearchSuccess = function (handler) {
        $(this).bind(this.searchSuccessEvent, handler);
    }
    this.triggerSearchSuccess = function (track) {
        $(this).trigger(this.searchSuccessEvent, [track]);
    }

    var that = this;

    setInterval(function () {
        var track = that.searchQueue.shift();
        if (track) {
            var url = track.getUrl();
            if (!url || url === null) {
                that.search(track, 0);
            }
        }
    }, 500);

    this.search = function (track, it) {
        var query = track.getQuery(it);
        if (query === false) {
            console.log("Nothing found: all queries are runing out.");
            return;
        }
        var that = this;
        VK.api('audio.search', {
                q: query,
                auto_complete: 0,
                count: 30,
                test_mode: 1
            }, function(data) {
                data = data.response;
                if (!data || !$.isArray(data) || data.length < 2) {
                    console.log("Search failed", track, data);
                    that.schedule(track);
                    return;
                }

                var count = data.shift();
                if (count == 0) {
                    console.log("Empty result for query", it, query);
                    that.search(track, it + 1, callback);
                    return;
                }
                var nearestDelta = 4294967295;
                var nearestResult = null;
                for (var index in data) {
                    var result = data[index];
                    var delta =  Math.abs(result.duration - track.getDurationMs());
                    if (delta < nearestDelta) {
                        nearestDelta = delta;
                        nearestResult = result;
                        if (delta === 0) {
                            break;
                        }
                    }
                }
                console.log('search binding complete, delta:', nearestDelta, 'result:', nearestResult, 'but results were:', data);

                track.setUrl(nearestResult.url);
                track.setDuration(nearestResult.duration);

                that.triggerSearchSuccess(track);
            }
        );
    }

    this.schedule = function (track) {
        var url = track.getUrl();
        if (!url || url === null) {
            if (track.incSearchTries() > this.maximumSearchTries) {
                console.log("Maximum search tries reached", track);
                return;
            }
            this.searchQueue.push(track);
        }
    }}

/**
 * The instance of searcher singleton.
 */
var searcher = new Searcher();





