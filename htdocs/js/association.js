/**
 * MetaPlayer 1.0
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2010-2011 Val Dubrava [ valery.dubrava@gmail.com ] 
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
    }

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

function Audio(aid, url, artist, title, duration) {
    this.id = aid;
    this.url = url;
    this.artist = artist;
    this.title = title;
    this.duration = duration;
    this.lyricsId = null;
}

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
    this.associations = [];
    this.loaded = [];
    this.offsetMap = {};

    this.init = function () {
        $(this.grid).data('associationGrid', this);
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
        this.grid.datagrid('getColumnOption', 'lyrics').formatter = function () {return that.lyricsFormatter.apply(that, arguments);}
        this.grid.datagrid('getColumnOption', 'duration').formatter = function () {return that.durationFormatter.apply(that, arguments);}
    }

    this.processData = function (data) {
        var result = {total: 1<<30, rows: []};

        if (data && data.length) {
            result.rows = this.processFirstResult(data);
            var opt = this.grid.datagrid('options');
            opt.url = '/nop.json';
        }

        return result;
    }

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
                if (audio.id in that.associations) {
                    row.status = 'Social/Server';
                }
                row.refreshAudio();
                that.grid.datagrid('appendRow', row);
                that.loaded.push(row);
            });

            if (result.tracks.length < limit) {
                that.appendSearchResult();
                return;
            }
        });
    }

    this.processFirstResult = function (data) {
        var associations = $.parseJSONObject(data);
        this.offsetMap[associations.length] = 0;
        var result = [];
        var that = this;
        $(associations).each(function(i, association) {
            that.associations[association.getSocialId()] = association;
            var row = new AudioRow(association);
//            if (that.track.getAssociation() && that.track.getAssociation().getSocialId() == row.id) {
//            }
            associationManager.resolve(association, function () {
                row.refreshAudio();
                that.grid.datagrid('refreshRow', i);
            });
            result.push(row);
        });
        return result;
    }

    this.lyricsFormatter = function(value, rowData, rowIndex) {
        if (!value) {
            return value;
        }
        var container = $('<div></div>');
        var btn = $('<div class="tip-icon" onclick="showLyrics(\'' + value + '\')"></div>').appendTo(container);

        return $(container).html();
    }

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
    }

    this.updateSelectedAssociation = function() {
        var selected = this.grid.datagrid('getSelected');
        var track = this.track;
        if (track.getAssociation() && track.getAssociation().getSocialId() == selected.id) {
            return;
        }
        associationRepository.associate(track, selected.association, function () {
            messageService.showNotification('Association successfully changed for track "' + track.getName() + '".');
        });
    }

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