/**
 * MetaPlayer 1.0
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2010-2011 Val Dubrava [ valery.dubrava@gmail.com ] 
 *
 */

mailru.loader.require('api', function() {
    mailru.app.init('2966cbd30280bf5ad7e9fc2483f59f15');

    mailru.app.users.requireInstallation();
});

function getSearchResult(query, offset, limit, handler) {
    mailru.common.audio.search(function (result) {
        if (!result || typeof result.total  == undefined) {
            console.log('my search failed!', query, offset, limit, handler);
            handler(null);
        }

        var response = new SearchResult(result.total);
        for (var index in result.result) {
            var info = result.result[index];
            var track = new SearchTrack(info.mid, info.artist, info.title, info.duration, info.link);
            response.tracks.push(track);
        }
        handler(response);
    }, query, offset, limit);
}


function mainResize(height) {
    mailru.app.utils.setHeight(height);
}