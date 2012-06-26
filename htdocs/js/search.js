/**
 * MetaPlayer 1.0
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2010-2011 Val Dubrava [ valery.dubrava@gmail.com ] 
 * 
 */
function SearchResult(count) {
    this.count = count;
    this.tracks = [];
}

function SearchTrack(id, band, track, duration, url) {
    this.id = id;
    this.band = band;
    this.track = track;
    this.duration = duration;
    this.url = url;
}


function Searcher() {
    this.searchQueue = [];
    this.searchSuccessEvent = "searchSuccess";
    this.searchFailedEvent = "searchFailed";

    this.bindSearchFailed = function (handler, ns) {
        ns = ns ? "." + ns : '';
        $(this).bind(this.searchFailedEvent + ns, handler);
    }
    this.triggerSearchFailed = function (track) {
        $(this).trigger(this.searchFailedEvent, [track]);
    }
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
            var association = track.getAssociation();
            if (!association || association === null) {
                that.search(track);
            }
        }
    }, 500);

    this.search = function (track) {
        var query = track.getQuery();
        if (query === false) {
            console.log("Nothing found: all queries are running out.");
            return;
        }
        var that = this;

        getSearchResult(query, 0, 30, function (result) {
            if (!result) {
                console.log('search failed, try again later', track);
                that.schedule(track);
                return;
            }
            if (result.count === 0) {
                console.log('search failed, empty result, try again soon', track);
                that.schedule(track, true);
                return;
            }

            var nearestDelta = 134217728;
            var nearestResult = null;
            for (var index in result.tracks) {
                var searchTrack = result.tracks[index];
                if (!track.getDurationMs()) {
                	nearestResult = searchTrack;
                	console.log('track does not have a duration');
                	break;
                }
                var delta = Math.floor(Math.abs(searchTrack.duration - track.getDurationMs()));
                if (delta < nearestDelta) {
                    nearestDelta = delta;
                    nearestResult = searchTrack;
                    if (delta === 0) {
                        break;
                    }
                }
            }
            console.log('search binding complete, delta:', nearestDelta, 'result:', nearestResult, 'but results were:', result);

            var association = new Association();
            association.setSocialId(nearestResult.id);
            associationRepository.associate(track, association, function () {
                var serverAssociation = track.getAssociation();
                serverAssociation.resolve(nearestResult);
                that.triggerSearchSuccess(track);
            });
        });
    }

    this.schedule = function (track, priority) {
        var association = track.getAssociation();
        if (!association || association === null) {
            if (!track.getQuery()) {
                console.log("Maximum search tries reached", track);
                this.triggerSearchFailed(track);
                return;
            }
            track.incSearchTries();
            if (priority) {
                this.searchQueue.unshift(track)
            } else {
                this.searchQueue.push(track);
            }

        }
    }
}
