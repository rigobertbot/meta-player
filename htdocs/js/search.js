/**
 * MetaPlayer 1.0
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2010-2011 Val Dubrava [ valery.dubrava@gmail.com ] 
 * 
 */
var maximumSearchTries = 5;

function search(track, it, callback) {
    var query = track.getQuery(it);
    if (query === false) {
        console.log("Nothing found: all queries are runing out.");
        return;
    }
    VK.api(
        'audio.search', {
            q: query,
            auto_complete: 0,
            count: 30,
            test_mode: 1
        }, function(data) {
            data = data.response;
            if (!data || !$.isArray(data) || data.length < 2) {
                console.log("Search failed", track, data);
                addToSearch(track);
                return;
            }

            var count = data.shift();
            if (count == 0) {
                console.log("Empty result for query", it, query);
                search(it + 1);
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
            
            track.setUrl(nearestResult.url);
            track.setDuration(nearestResult.duration);
            //track.setResult(nearestResult);
            
            //console.log(data);
            //console.log(nearestResult);
            if (callback && typeof callback === 'function') {
                callback.call(this, track, it);
            }
        })
}

var searchQueue = [];

setInterval(function () {
    var track = searchQueue.shift();
    if (track) {
        var url = track.getUrl();
        if (!url || url === null) {
            search(track, 0);
        }
        // track = searchQueue.shift();
    }
}, 500);

function addToSearch (track) {
    var url = track.getUrl();
    if (!url || url === null) {
        if (track.incSearchTries() > maximumSearchTries) {
            console.log("Maximum search tries reached", track);
            return;
        }
        searchQueue.push(track);
    }
}

