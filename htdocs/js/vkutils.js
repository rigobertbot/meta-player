/**
 * MetaPlayer 1.0
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2010-2013 Val Dubrava [ valery.dubrava@gmail.com ]
 * 
 */
// main iframe size
var mainWidth = 650;
var appUrl = 'http://vk.com/app2720671_335243';

VK.init(function() {
    VK.api('getUserSettings', {test_mode: 1}, function(data) {
        if ((data.response & 8) !== 8) {
            VK.callMethod('showSettingsBox', 8);
        }
    });
    
    VK.Widgets.Comments('vk_comments', {
        limit: 25, 
        width: mainWidth, 
        autoPublish: 0
    });
    
//    VK.Widgets.Group("vk_groups", {
//        mode: 0, 
//        width: mainWidth, 
//        height: "290"
//    }, 33532766)
});


function mainResize(height) {
    VK.callMethod('resizeWindow', mainWidth, height);
}

function convertAudio(vkAudio) {
    var audio = new Audio(
        vkAudio['owner_id'] + '_' + vkAudio['aid'],
        vkAudio.url,
        vkAudio.artist,
        vkAudio.title,
        vkAudio.duration
    );


    audio.lyricsId = vkAudio['lyrics_id'];

    return audio;
}
function getSearchResult(query, offset, limit, handler) {
    VK.api('audio.search', {
        q: query,
        auto_complete: 0,
        count: limit,
        offset: offset,
        test_mode: 1
    }, function(data) {
        if (!data.response || !$.isArray(data.response)) {
            console.log('vk search failed!', query, offset, limit, handler);
            handler(null);
            return;
        }

        var result = new SearchResult(data.response.shift());

        for (var index in data.response) {
            var info = data.response[index];
            var track = convertAudio(info);
            result.tracks.push(track);
        }

        handler(result);
    });
}

function getLyrics(id, handler) {
    VK.api('audio.getLyrics', {lyrics_id: id, test_mode: 1}, function (data) {
        if (!data.response) {
            console.log('vk get lyrics failed', id, data);
            handler(data.error['error_msg']);
            return;
        }
        console.log(data.response);
        handler(data.response.text);
    });
}

function selfPost(nodeId, message, handler) {
    var attachment = appUrl + '#' + nodeId;
    VK.api('wall.post', {
        message: message,
        attachments: attachment,
        test_mode: 1
    }, function (data) {
        if (!data.response) {
            console.log("vk self post failed, ", nodeId, message, data);
            return;
        }
        handler(data.response);
    });
}

function resolveAudio(aid, handler) {
    VK.api('audio.getById', {audios: aid, test_mode: 1}, function (data) {
        if (!data.response) {
            console.log('vk resolve audio failed', data, aid. handler);
        }
        var vkAudio = data.response.pop();
        handler(convertAudio(vkAudio));
    });
}

window.setInterval(function () {
    // resize widgets
    var totalHeight = $('#mainHeader').outerHeight();
    totalHeight += $('#mainPlayerControls').outerHeight();
    totalHeight += $('#bodyAccordion').outerHeight();
    totalHeight += $('#vk_comments').outerHeight();
    totalHeight += $('#vk_groups').outerHeight();
    totalHeight += $('#mainFooter').outerHeight();
    mainResize(totalHeight);
}, 500);
