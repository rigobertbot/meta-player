/**
 * MetaPlayer 1.0
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2010-2013 Val Dubrava [ valery.dubrava@gmail.com ]
 * 
 */
function AssociationManager() {
    this.resolve = function (association, handler) {
        if (!association.isResolved()) {
            resolveAudio(association.getSocialId(), function (audio) {
                association.resolve(audio);
                handler(association);
            });
            return;
        }
        handler(association);
    };

    this.init = function () {
        $('#showLyricsWindow').window({
            left: 125,
            top: 25,
            width: 400,
            height: 500,
            closed: true
        });
    }

}

var associationManager = new AssociationManager();

/**
 * Resolved audio track.
 * @param aid
 * @param url
 * @param artist
 * @param title
 * @param duration
 * @constructor
 */
function Audio(aid, url, artist, title, duration) {
    this.id = aid;
    this.url = url;
    this.artist = artist;
    this.title = title;
    this.duration = duration;
    this.lyricsId = null;
}

/**
 * Grid row pased on association.
 * @param association
 * @constructor
 */
function AudioRow (association) {
    this.id = association.getSocialId();
    this.status = association.id ? 'Server' : 'Social';
    this.association = association;
    this.popularity = association.id ? association.popularity : undefined;

    this.refreshAudio = function () {
        this.title = this.association.audio.title;
        this.artist = this.association.audio.artist;
        this.duration = this.association.audio.duration;
        this.lyrics = this.association.audio.lyricsId;
    }
}

function AssociationGrid(id, track) {
    this.grid = $('#' + id);
    this.track = track;
    /**
     * Server association.
     * @type AudioRow[]
     */
    this.serverAudioRows = [];
    this.loaded = [];
    this.offsetMap = {};
    /**
     * @type PlayerWrapper
     */
    this.player = null;
    /** @type string current preview played song social id */
    this.currentPlayed = null;

    this.init = function () {
        $(this.grid).data('associationGrid', this);
        this.player = new PlayerWrapper('#associationWindowPlayer');

        var that = this;
        this.grid.datagrid({
            url: '/association/list',
            queryParams: {trackId: this.track.getServerId()},
            loadFilter: function (data) {
                return that.processData(data);
            },
            onBeforeLoad: function (param) {
                return true;
            },
            onLoadSuccess: function (data) {
                $(data.rows).each(function (i, row) {that.loaded.push(row);});
                that.appendSearchResult();
                if (that.track.getAssociation()) {
                    that.grid.datagrid('selectRecord', that.track.getAssociation().getSocialId());
                }
            }
        });
        var pager = this.grid.datagrid('getPager');
        $(pager).pagination({
            afterPageText: '',
            displayMsg: 'Displaying {from} to {to}',
            total: 1<<30
        });
        this.grid.datagrid('getColumnOption', 'lyrics').formatter = function () {return that.lyricsFormatter.apply(that, arguments);};
        this.grid.datagrid('getColumnOption', 'duration').formatter = function () {return that.durationFormatter.apply(that, arguments);};
        this.grid.datagrid('getColumnOption', 'play').formatter = function() {return that.playFormatter.apply(that, arguments);};
    };

    this.processData = function (data) {
        var result = {total: 1<<30, rows: []};

        if (data && data.length) {
            result.rows = this.processFirstResult(data);
            var opt = this.grid.datagrid('options');
            opt.url = '/nop.json';
        }

        return result;
    };

    this.appendSearchResult = function () {
        var pager = this.grid.datagrid('getPager');
        var pagerOpts = $(pager).pagination('options');
        var limit = parseInt(pagerOpts.pageSize);
        var offset = limit * (parseInt(pagerOpts.pageNumber) - 1);
        var nextOffset = offset + limit;
        var that = this;

        // return back
        if (nextOffset <= this.loaded.length) {
            var rows = this.loaded.slice(offset, nextOffset);
            $(rows).each(function (i, row) {
                that.grid.datagrid('appendRow', row);
            });
            $(pager).pagination({total: nextOffset + limit});
            return;
        }

        var queryIndex = null;
        var existingItems = 0;
        // try to find current query index
        for (var key in this.offsetMap) {
            if (nextOffset > key) {
                queryIndex = this.offsetMap[key];
                existingItems = parseInt(key);
            } else {
                break;
            }
        }
        if (queryIndex === null || !this.track.getQuery(queryIndex)) {
            return;
        }
        var existingOnCurrentPage = existingItems - offset;
        if (existingOnCurrentPage > 0) {
            limit -= existingOnCurrentPage;
        }
        if (existingItems < offset) {
            offset -= existingItems;
        }

        getSearchResult(this.track.getQuery(queryIndex), offset, limit, function (result) {
            if (!result) {
                return;
            }

            var total = parseInt(result.count) + existingItems;
            that.offsetMap[total] = queryIndex + 1;
            $(pager).pagination({total: total});

            $(result.tracks).each(function (i, audio) {
                var association = new Association();
                association.setSocialId(audio.id);
                association.resolve(audio);
                var row = new AudioRow(association);
                if (audio.id in that.serverAudioRows) {
                    var serverAssocIndex = that.grid.datagrid('getRowIndex', audio.id);
                    var serverAssocRow = that.serverAudioRows[audio.id];
                    serverAssocRow.status = 'Social/Server';
                    that.grid.datagrid('refreshRow', serverAssocIndex);
                    return;
                }
                row.refreshAudio();
                that.grid.datagrid('appendRow', row);
                that.loaded.push(row);
            });

            if (result.tracks.length < limit) {
                that.appendSearchResult();
            }
        });
    };

    this.processFirstResult = function (data) {
        var associations = $.parseJSONObject(data);
        this.offsetMap[associations.length] = 0;
        var result = [];
        var that = this;
        $(associations).each(function(i, association) {
            var row = new AudioRow(association);
            associationManager.resolve(association, function () {
                row.refreshAudio();
                that.grid.datagrid('refreshRow', i);
            });
            that.serverAudioRows[association.getSocialId()] = row;
            result.push(row);
        });
        return result;
    };

    this.lyricsFormatter = function(value, rowData, rowIndex) {
        if (!value) {
            return value;
        }
        var container = $('<div></div>');
        var btn = $('<div class="tip-icon" onclick="showLyrics(\'' + value + '\')"></div>').appendTo(container);

        return $(container).html();
    };

    this.durationFormatter = function (value) {
        if (!value) {
            return value;
        }

        var min = Math.floor(parseInt(value) / 60);
        var sec = parseInt(value) % 60;
        if (sec < 10) {
            sec = '0' + sec;
        }

        return min + ":" + sec;
    };

    this.playFormatter = function (value, rowData, rowIndex) {
        var container = $('<div></div>');
        var playBtn = $('<div class="play-icon association-player" onclick="previewPlayAssociation(this, \'' + rowData.id + '\')"></div>').appendTo(container);
        return $(container).html();
    };

    this.previewPlay = function(id, callbackPlay, callbackEnd) {
        console.log('previewPlay', id);
        if (this.currentPlayed == id) {
            console.log('previewPlay', 'this track current played');
            this.player.playPause();
            if (callbackPlay) { callbackPlay(); }
            return;
        }

        var rowIndex = this.grid.datagrid('getRowIndex', id);
        var rows = this.grid.datagrid('getRows');
        var row = rows[rowIndex];

        var association = row.association;
        var that = this;
        associationManager.resolve(association, function (resolved) {
            console.log('previewPlay', 'resolved');
            that.currentPlayed = id;
            that.player.unbindEnded('previewPlay');
            that.player.bindEnded(function () {
                that.player.unbindEnded('previewPlay');
                callbackEnd();
            }, 'previewPlay');
            that.player.play(resolved.getUrl(), callbackPlay);
        });
    };

    this.previewPause = function (id) {
        if (this.currentPlayed != id) {
            console.log('previewPause', 'track with ' + id + ' is not playing now!');
            return;
        }
        this.player.playPause();
    };

    this.updateSelectedAssociation = function() {
        var selected = this.grid.datagrid('getSelected');
        var track = this.track;
        if (track.getAssociation() && track.getAssociation().getSocialId() == selected.id) {
            return;
        }
        associationRepository.associate(track, selected.association, function () {
            messageService.showNotification('Association successfully changed for track "' + track.getName() + '".');
        });
    };

    this.init();
}

function showLyrics(lyricsId) {
    $('#showLyricsWindow').window({closed: false});
    getLyrics(lyricsId, function (text) {
        $('#lyrics').text(text);
    });
}

function associationOk() {
    var associationGrid = $('#associations').data('associationGrid');
    associationGrid.updateSelectedAssociation();
    associationCancel();
}

function associationCancel() {
    $('#associationWindow').window({closed: true});
}

function previewPlayAssociation(element, id) {
    console.log('previewPlayAssociation', element, id);
    var associationGrid = $('#associations').data('associationGrid');
    if ($(element).hasClass('pause-icon')) {
        console.log('previewPlayAssociation', 'played, pause');
        associationGrid.previewPause(id);
        $(element).removeClass('pause-icon').addClass('play-icon');
    } else /* if($(element).hasClass('.play-icon')) */ {
        // other icon set to play
        $('.association-player.pause-icon').removeClass('pause-icon').addClass('play-icon');

        // this icon set to loading
        $(element).removeClass('play-icon').addClass('loading-icon');

        associationGrid.previewPlay(id, function () {
            // this icon set to pause
            $(element).removeClass('play-icon').addClass('pause-icon');
        }, function () {
            $(element).removeClass('pause-icon').addClass('play-icon');
        });
    }
}