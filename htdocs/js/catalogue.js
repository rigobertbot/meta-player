/**
 * MetaPlayer 1.0
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2010-2013 Val Dubrava [ valery.dubrava@gmail.com ]
 * 
 */
var baseUrl = 'http://www.musicbrainz.org/ws/2';
var editor = new Editor();
/**
 * @param {FavoriteBindingManager} fbm
 * @constructor
 */
function Catalogue(fbm) {
    this.tree = null;
    /**
     * @type {FavoriteBindingManager}
     * @private
     */
    this._fbm = fbm;

    this.init = function () {
        editor.start();
        editor.setInfoBar($('#statusBar'));
        var that = this;

        this.tree = new TreeGrid($('#catalogue'), {
            idField: 'id',
            treeField: 'name',
            animate: false,
            pagination: true,
            columns: [[
                {field: "name", width: 260, title: "Название"},
                {field: "type", width: 80, title: "Тип"},
                {field: "date", width: 80, title: "Дата"},
                {field: "country", width: 80, title: "Страна"},
                {field: "length", width: 80, title: "Длит.", formatter: function () { return that.durationFormatter.apply(that, arguments);} },
                {field: "name", width: 20, title: "Название", formatter: function () { return that.favoriteFormatter.apply(that, arguments);} }
            ]],
            onContextMenu: function (e, row) {
                e.preventDefault();
                var menu = null;
                switch (row['inner_type']) {
                    case 'artist':
                        menu = $('#contextMenuBand');
                        break;
                    case 'release-group':
                    case 'single':
                    case 'release':
                        menu = $('#contextMenuAlbum');
                        break;
                    case 'recording':
                        menu = $('#contextMenuTrack');
                        break;
                }
                $(menu).menu('show', {
                    left: e.pageX,
                    top: e.pageY
                }).data('row', row);
            },
            loadFilter: function () { that.loadFilter.apply(that, arguments); },
            onExpand: function (row) {
                console.log("trigger expanded", row);
                $(row).trigger("expanded", row);
            },
            onBeforeLoad: beforeLoad
        });

        $('#searchBtn').click(function (event) {
            that.tree.reload();
        });
    };

    this.durationFormatter = function (value) {
        if (!value) {
            return value;
        }
        var i = parseInt(value) / 1000;
        var seconds = Math.ceil(i % 60);
        if (seconds < 10) {
            seconds = "0" + seconds;
        }

        return Math.floor(i / 60) + ':' + seconds;
    };

    this.favoriteFormatter = function(value, rowData, rowIndex) {
        var container = $('<div></div>');

        var uid = 'favorite_' + rowIndex;
        var loader = $('<div class="icon-loading" id="' + uid + '"></div>').appendTo(container);

        switch (rowData.inner_type) {
            case 'artist':
                this._fbm.bindBand(rowData.name, function (node) {
                    console.log('bound!', node);
                    rowData.node = node;
                    $('#' + uid).text(node.getId());
                });
                break;
            case 'release':
                console.log('check favorite for release');
                //fbm.bindAlbum(rowData.name, function (node) {})
                break;
            case 'recording':
                break;
        }

        return container.html();
    };

    this.loadFilter = function(data, parentId) {
        var parentRow = this.tree.find(parentId);
        if (parentRow && !parentRow['noPaging']) {
//            console.log('paging', parentRow);
            var pages = createPages(data, parentRow);
            if (pages != null) {
                return pages;
            }
        }
        filterArtists(data, parentId);
        filterRecording(data, parentId);
        filterRelease(data, parentId);
        filterReleaseGroup(data, parentId);

//        console.log('loaded', data);
        var result = $.xml2json(data);
//        console.log('xml2json', result);

        if (result['artist_list']) {
            result = {total: result['artist_list'].count, rows: result['artist_list'].artist};
            if (!$.isArray(result.rows)) {
                result.rows = [result.rows];
            }
        } else if (result['release']) {
            var recordings = [];
            $(result['release']['medium_list']['medium']).each(function (i, medium) {
                $(medium['track_list']['track']).each(function (i, track) {
                    recordings.push(track['recording']);
                });
            });
            recordings.sort(function (r1, r2) { return r1.position - r2.position; });
            result = {total: recordings.length, rows: recordings};
        } else if (result['release_list']) {
            result = {total: result['release_list'].count, rows: result['release_list']['release']};
            if (!$.isArray(result.rows)) {
                result.rows = result.rows ? [result.rows] : [];
            }
            result.rows.sort(compareReleases);
        } else if (result['release_group_list']) {
            result = {total: result['release_group_list'].count, rows: result['release_group_list']['release_group']};
            if (!$.isArray(result.rows)) {
                result.rows = result.rows ? [result.rows] : [];
            }
            result.rows.sort(compareReleaseGroup);
        } else {
            console.log('undefined source');
            result = {total: 0, rows: []};
        }

        return result;
    };
}

function replaceNameWithTitle(element) {
    replaceAttrWithNode(element, 'name', 'title');
}

function replaceAttrWithNode(element, attrName, nodeName) {
    $(element).attr(attrName, $(element).find(nodeName).text());
    $(element).find(nodeName).remove();
}

function filterArtists(data, parentId) {
    var artists = $(data).find('artist')
        .attr('state', 'closed')
        .attr('inner_type', 'artist');
    if (parentId) {
        artists.attr('_parentId', parentId);
    }
    $('<children name="releases" url="release-group?type=album"></children>' +
        '<children name="singles" url="release-group?type=single"></children>' +
        '')
//                    '<children name="works" url="work"></children>')
        .attr('state', 'closed')
        .attr('paging', 'true')
        .attr('inner_type', 'artist-child').appendTo(artists);
    $(artists).find('children')
        .setUid()
        .each(function (i, e) {
            $(e).attr('_parentId', $(e).parent().attr('id'));
            $(e).attr('artistId', $(e).parent().attr('id'));
            $(e).attr('date', $(e).find('begin').text());
        });
}

function filterRecording(data, parentId) {
    var recordingCount = 0;
    $(data).find('medium').each (function (i, medium) {
        $(medium).find('recording').each(function (i, e) {
            var pos = parseInt($(e).parent().find('position').text());
            pos += recordingCount;
            replaceNameWithTitle(e);
            $(e).attr('_parentId', parentId)
                .attr('inner_type', 'recording')
                .attr('position', pos);
        });
        recordingCount += $(medium).find('recording').length;
    });
}

function filterRelease(data, parentId) {
    $(data).find('release').each(function (i, e) {
        replaceNameWithTitle(e);
        $(e).attr('_parentId', parentId)
            .attr('state', 'closed')
            .attr('superId', $(e).attr('id'))
            .attr('noPaging', true)
            .attr('limit', 100)
            .attr('offset', 0)
            .attr('inner_type', 'release');
    });
}

function filterReleaseGroup(data, parentId) {
    // appendEtc(data, 'release-group-list', 'release-group');

    $(data).find('release-group').each(function (i, e) {
        replaceNameWithTitle(e);
        replaceAttrWithNode(e, 'date', 'first-release-date');
        $(e).attr('_parentId', parentId)
            .attr('state', 'closed')
            .attr('superId', $(e).attr('id'))
            .attr('noPaging', true)
            .attr('limit', 100)
            .attr('offset', 0)
            .attr('inner_type', 'release-group');
    });
}

function createPages(data, parentRow) {
    var count = $(data).children().children().first().attr('count')
    var pager = $(catalogue.tree.getPager()).pagination('options');
    var pageSize = parseInt(pager.pageSize);
    if (count <= pageSize) {
        return null;
    }
    var pages = [];
    for (var i = 1; i <= count; i += pageSize) {
        var rest = Math.min(count, i + pageSize - 1);
        var page = $.extend({}, parentRow);
        page.name = '[' + i + '..' + rest + ']';
        page._parentId = parentRow.id;
        page.id = $.genUuid();
        page.limit = pageSize;
        page.offset = i - 1;
        page.state = 'closed';
        page.noPaging = true;

        pages.push(page);
    }
    return {rows: pages, total: pages.length};
}

function compareReleaseGroup(r1, r2) {
    // by type at first
    if (r1.type != r2.type) {
        return r1.type > r2.type ? 1 : -1;
    }
    // then by date (like releases)
    return compareReleases(r1, r2);
}

function compareReleases(r1, r2) {
    if (r1.date != r2.date) {
        // if empty value
        if (!r1.date || r1.date.length == 0) {
            return 1;
        } else if (!r2.date || r2.date.length == 0) {
            return -1;
        }
        // simple date compare
        return r1.date > r2.date ? 1 : -1;
    }
    // and the by name
    return r1.name == r2.name ? 0 : r1.name > r2.name ? 1 : -1;
}

function beforeLoad(row, param) {
    console.log('before load catalogue', row, param);
    if (row && row['inner_type']) {
        switch(row['inner_type']) {
            case 'artist-child':
                param['artist'] = row['artistId'];
                param.id = undefined;
                $.data(this, 'treegrid').options.url = baseUrl + '/' + row['url'];
                break;
            case 'release':
                param['inc'] = 'recordings';
                var releaseId = row['superId'];
                param.id = undefined;
                $.data(this, 'treegrid').options.url = baseUrl + '/release/' + releaseId;
                break;
            case 'release-group':
                param['release-group'] = row['superId'];
                param.id = undefined;
                $.data(this, 'treegrid').options.url = baseUrl + '/release';
                break;
            default:
                return false;
        }
        if (row['limit']) {
            param.limit = row['limit'];
            param.offset = row['offset'];
        } else {
            param.limit = param.rows;
        }
    } else {
        var q = $('#searchArtist').val();
        if (!q || !q.length) {
            return false;
        }

        param.type = 'artist';
        param.query = q;
        param.offset = param.rows * (param.page - 1);
        param.limit = param.rows;

        var opts = $.data(this, 'treegrid').options;
        opts.url = baseUrl + '/artist/';
        opts.method = 'get';
        opts.dataType = 'xml';
    }
    param.rows = undefined;
    param.page = undefined;
    return true;
}

function addAlbum(row, withTracks, onSuccess) {
    // getting first group with the same date
    if (row['inner_type'] == 'release-group' ) {
        if (!row.children || !$.isArray(row.children)) {
            $(row).bind('expanded', function (event, expandedRow) {
                if (expandedRow !== row) {
                    return;
                }
                $(row).unbind('expanded');
                addAlbum(row, withTracks, onSuccess);
            });
            catalogue.tree.expand(row.id);
            return;
        }
        for (var i in row.children) {
            var child = row.children[i];
            if (child.data == row.data || row.children.length == 1) {
                catalogue.tree.collapse(row.id);
                addAlbum(child, withTracks, onSuccess);
                return;
            }
        }
        messageService.showError("Не возможно найти подходящий альбом.");
        return;
    }

    if (withTracks && (!row.children || !$.isArray(row.children))) {
        console.log('try to expand', row);
        $(row).bind('expanded', function (event, expandedRow) {
            if (expandedRow !== row) {
                return;
            }
            $(row).unbind('expanded');
            catalogue.tree.collapse(row.id);
            addAlbum(row, withTracks, onSuccess);
        });
        catalogue.tree.expand(row.id);
        return;
    }
    var bandRow = catalogue.tree.getParentWhile(row, function (node) {
        return !node || node['inner_type'] == 'artist';
    });
    addArtist(bandRow, function (band) {
        var album = new AlbumNode();
        album.setReleaseDate($.defaultDateFormatter(new Date(row.date)))
            .setName(row.name)
            .setParentBand(band)
            .setSource(baseUrl + '/release/' + row.id);

        editor.addAlbum(album, function (albumNode) {
            messageService.showNotification("Альбом '" + row.name + "' успешно добавлен.");
            if (withTracks) {
                console.log(row.children);
                for (var i in row.children) {
                    var childRow = row.children[i];
                    addTrack(childRow, albumNode);
                }
            }
            if ($.isFunction(onSuccess)) {
                onSuccess.apply(this, arguments);
            }
        });
    });
}

function addArtist(row, onSuccess) {
    console.log('add', row);
    var band = new BandNode();
    if (row['life_span']) {
        var life = row['life_span'];
        if (life['begin']) {
            band.setFoundDate($.defaultDateFormatter(new Date(life['begin'])));
        }
        if (life['end']) {
            band.setEndDate($.defaultDateFormatter(new Date(life['end'])));
        }
    }
    band.setName(row.name);
    band.setSource(baseUrl + '/artist/' + row.id);

    editor.addBand(band, function () {
        messageService.showNotification("Группа '" + row.name + "' успешно добавлена.");
        if ($.isFunction(onSuccess)) {
            onSuccess.apply(this, arguments);
        }
    });
}

function addTrack(row, albumNode, onSuccess) {
    console.log('add track', row);

    if (!albumNode) {
        var albumRow = catalogue.tree.getParent(row.id);
        addAlbum(albumRow, false, function (albumLoadedNode) {
            addTrack(row, albumLoadedNode, onSuccess);
        });
        return;
    }

    var track = new TrackNode();
    track.setTitle(row.name)
        .setParentAlbum(albumNode)
        .setSerial(row.position)
        .setDuration(parseInt(row.length) / 1000)
        .setSource(baseUrl + '/recording/' + row.id);
    editor.addTrack(track, function() {
        messageService.showNotification("Композиция '" + row.name + "' успешно добавлена .");
        if ($.isFunction(onSuccess)) {
            onSuccess.apply(this, arguments);
        }
    });

}