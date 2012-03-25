/**
 * MetaPlayer 1.0
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2010-2011 Val Dubrava [ valery.dubrava@gmail.com ] 
 * 
 */
using('vkutils.js');

var indexInit = function () {
    $.ajaxSetup({
        timeout: 30000 //30 seconds
    });

    bodyLoading.setStatus('main initializing');
    new QueueLoader(['player.js', 'tree.js', 'playlist.js', 'messager', 'combobox', 'form', 'datebox', 'messager.js', 'accordion'], function (){
        mainPlayer.init();
        mainTree.init();
        mainPlaylist.init();

        $(document).ajaxError(function (event, jqXHR, ajaxSettings, thrownError) {
            messageService.showError('Произошла ошибка на сервере:<br />' + thrownError);
        });

        $.extend($.fn.validatebox.defaults.rules, {
            checkSelected: {
                validator: function(value, param){
                    var mode = param[0];
                    var combobox = param[1];
                    if (getEditMode() == mode) {
                        return true;
                    }
                    if (getSelectedNode(combobox) != null) {
                        return true;
                    }
                    return false;
                },
                message: 'Выберите любое значени из списка.'
            }
        });
        $('#bandList').combobox({
            onSelect: function (record) {
                console.log('onSelect', record);
                $('#bandFoundDate').datebox('setValue', record.getFoundDate());
                $('#bandEndDate').datebox('setValue', record.getEndDate());
                record.loadChildren(function (data) {
                    $('#albumList').combobox('loadData', data);
                });

                if (record.getSource() &&
                    record.getSource().length > 0 &&
                    record.getSource().indexOf('http://musicbrainz.org/ws/2/') == 0
                    ) {
                    extLoadAlbums(record.getSource());
                }
            }
        });
        $('#bandSearch').combobox({
            delay: 1000,
            onSelect: function (value) {
                console.log(value);
                $('#bandFoundDate').datebox('setValue', value.foundDate);
                $('#bandEndDate').datebox('setValue', value.endDate);
                $('#editSource').val(value.source);

                extLoadAlbums(value.source);
                $('#editLoadTracks').attr('disabled', 'true');
            },
            onChange: function (newValue, oldValue) {
                if (newValue == oldValue)
                    return;

                var oldData = $(this).combobox('getData');

                for (var i = 0; i < oldData.length; i ++ ){
                    if (oldData[i].id == newValue) {
                        return;
                    }
                }

                q = newValue;
                console.log('query', q);
                if (q.length >= 3) {
//                    q = q.toLowerCase();
//                    if (q.indexOf('*') === -1) {
//                        q = $.trim(q) + '*';
//                    }
//                    if (q.indexOf('the') === -1) {
//                        q += ' OR the ' + q;
//                    }
                    q = 'artist:' + q;

                    $.get('http://musicbrainz.org/ws/2/artist/', {query: q}, function (data) {
                        var result = [];
                        $(data).find('artist').each(function (index, artist) {
                            result.push({
                                id: $(artist).attr('id'),
                                name: $(artist).find('name:first').text(),
                                source: 'http://musicbrainz.org/ws/2/artist/' + $(artist).attr('id'),
                                foundDate: $.defaultDateFormatter(new Date($(artist).find('life-span begin').text())),
                                endDate: $.defaultDateFormatter(new Date($(artist).find('life-span end').text()))
                            });
                        });
                        $('#bandSearch').combobox('loadData', result);
                            //.combobox('setValue', q);
                    }, 'xml');
                } else {
                    //$(this).combobox('hidePanel');
                }
            }
        });

        $('#albumSearch').combobox({
            onSelect: function (value) {
                console.log(value);
                $('#albumReleaseDate').datebox('setValue', value.releaseDate);
                $('#editSource').val(value.source);
                $('#editLoadTracks').removeAttr('disabled');

                $('#editCellTrackList').append($('#editDivTrackSearch'));
                $('#hiddenFormElements').append($('#editDivTrackList'));

                extLoadTracks(value.source);
            },
            onChange: function (newValue, oldValue) {

            }
        });

        $('#albumList').combobox({
            onSelect: function (record) {
                $('#albumReleaseDate').datebox('setValue', record.getReleaseDate());

                console.log('selected', record);
                if (record.getSource() &&
                    record.getSource().length > 0 &&
                    record.getSource().indexOf('http://musicbrainz.org/ws/2/') == 0
                    ) {
                    $('#editSource').val(record.getSource());
                    $('#editCellTrackList').append($('#editDivTrackSearch'));
                    $('#hiddenFormElements').append($('#editDivTrackList'));

                    extLoadTracks(record.getSource(), function (data) {
                        var result = [];
                        $(data).find('track').each(function (index, track) {
                            result.push({
                                id: $(track).find('recording:first').attr('id'),
                                title: $(track).find('title:first').text(),
                                duration: Math.floor(parseInt($(track).find('length:first').text()) / 1000),
                                serial: $(track).find('position:first').text(),
                                source: record.getSource()
                            });
                        });

                        console.log('load tracks', result);
                        $('#trackSearch').combobox('loadData', result);
                    });
                } else {
                    $('#editCellTrackList').append($('#editDivTrackList'));
                    $('#hiddenFormElements').append($('#editDivTrackSearch'));
                }
            }
        });

        $('#trackSearch').combobox({
            delay: 2148456,
            onSelect: function (record) {

                console.log('selected', record);
                $('#trackDurationMM').numberspinner('setValue', Math.floor(parseInt(record.duration) / 60));
                $('#trackDurationSS').numberspinner('setValue', Math.floor(parseInt(record.duration) % 60));
                $('#trackDuration').val(record.duration);
                $('#trackList').val(record.title);

                $('#trackSerial').numberspinner('setValue', record.serial);
            },
            onChange: function (newValue, oldValue) {
                $('#trackList').val(newValue);
            }
        });

        $('#editCellTrackList').append($('#editDivTrackList'));
        $('#hiddenFormElements').append($('#editDivTrackSearch'));

        bandRepository.bindOnLoaded(function (e, nodes) {
            appendNodesToList($('#bandList'), nodes);
        });
        bandRepository.bindOnRemoved(function (e, node) {
            removeNodeFromList($('#bandList'), node);
        });
        bandRepository.bindOnUpdated(function (e, node) {
            refreshList($('#bandList'));
        });

        albumRepository.bindOnLoaded(function (e, nodes) {
            appendNodesToList($('#albumList'), nodes);
        });
        albumRepository.bindOnRemoved(function (e, node) {
            removeNodeFromList($('#albumList'), node);
        });
        albumRepository.bindOnUpdated(function (e, node) {
            refreshList($('#albumList'));
        });

        $('#editTreeForm').form({
            onSubmit: function () {
                // clean wrong values

                // recalculate track duration
                $('#trackDuration').val(parseInt($('#trackDurationMM').val()) * 60 + parseInt($('#trackDurationSS').val()));

                if ($(this).form('validate')) {
                    submitForm(this);
                }
                return false;
            }
        });

        editTypeChanged($('#editTypeBand'));

        $('#bandFoundDate,#bandEndDate,#albumReleaseDate').datebox({
            formatter: $.defaultDateFormatter
        });

        $('#editTreeForm input').bind('keyup', function () {
            if (event.keyCode == 13) {
                $('#editSubmit').click();
            }
        });

        $('#bodyAccordion').accordion({onSelect: function (title) {
            $(this).trigger('onSelect', [title]);
        }});

        $('#bodyAccordion').bind('onSelect', function (event, title) {
            var panel = $('#bodyAccordion').accordion('getPanel', title);
            if ($(panel).attr('id') == 'editTreeAccordion') {
                $('#editModeAccordion').accordion({});
            }
        });

        // auto export

        $('#editBandSearch').keyup(function (event) {
            var value = $('#editBandSearch').val();
            if (!value || value.length < 3) {
                return;
            }
            $.get('http://musicbrainz.org/ws/2/artist', {query: value, limit: 30}, function (data) {
                $('#editBandSearchVariant').empty();
                $('#editBandSearchVariant').append('<option value="null">Выберите</option>');
                $(data).find('artist[type=Group]').each(function (index, value) {
                    $('#editBandSearchVariant').append('<option value="' + $(value).attr('id') + '">' + $(value).find('name:first').text() + '</option>');
                });
            }, 'xml');
        });

        $('#editBandSearchVariant').change(function () {
            var name = $('#editBandSearchVariant option:selected').text();
            if (confirm('Вы уверены что хотите загрузить группу "' + name + '", все ее альбомы и композиции?')) {
                var extLoading = new Loading($('#editExport'));
                var value = $('#editBandSearchVariant').val();
                extUploadBand(value, extLoading);
            }
        });

        bodyLoading.resetStatus('ready');
    }).load();
}

function extLoadAlbums(source) {

    var bandId = source.substr('http://musicbrainz.org/ws/2/artist/'.length);

    $.get('http://musicbrainz.org/ws/2/release-group', {artist: bandId, type: 'album', limit: 100}, function (data) {
        var result = [];
        $(data).find('release-group').each(function (index, release) {
            result.push({
                id: $(release).attr('id'),
                title: $(release).find('title').text(),
                releaseDate: $.defaultDateFormatter(new Date($(release).find('first-release-date').text())),
                source: 'http://musicbrainz.org/ws/2/release-group/' + $(release).attr('id')
            });
        });
        console.log('album load', result);
        $('#albumSearch').combobox('loadData', result);
    }, "xml");
}

function extLoadTracks(source, callback) {
    var albumId = source.substr('http://musicbrainz.org/ws/2/release-group/'.length);

    $.get('http://musicbrainz.org/ws/2/release/', {'release-group': albumId, inc: 'recordings', limit: 1}, function (data) {
        // medium correction: some tracks has several 'mediums'. Inside mediums tracks have the quals positions.
        $(data).find('medium-list[count!=1] medium').each(function (index, medium) {
            var pos = $(medium).find('position:first').text();
            $(medium).find('track').each (function (index2, track) {
                // prepand medium id to position
                $(track).find('position').text(pos + $(track).find('position').text()); //string concutination
            });
        });

        if ($.isFunction(callback)) {
            callback(data);
        }
    }, 'xml');
}

function extUploadBand(id, loader) {
    loader.setStatus('загрузка альбомов...');
    var source = 'http://musicbrainz.org/ws/2/artist/' + id;

    $.get(source, {inc: 'releases'}, function (artist) {
        loader.resetStatus('альбомы загружены');
        var band = new BandNode();
        band.setName($(artist).find('name:first').text())
            .setFoundDate($.defaultDateFormatter(new Date($(artist).find('life-span begin').text())))
            .setEndDate($(artist).find('life-span end').length != 0 ? $.defaultDateFormatter(new Date($(artist).find('life-span end').text())) : null)
            .setSource(source);

        loader.setStatus('сохраняем группу "' + band.getName() + '" на сервер...');
        bandRepository.add(band, function (loadedBand) {
            loader.resetStatus('группа успешно сохранена');
            console.log('loaded to the server', loadedBand);

            albumQueue = $(artist).find('release').toArray();

            var album = albumQueue.pop();
            extUploadAlbum(loadedBand, album, loader);
        });
    }, 'xml');
}

var albumQueue = [];

function extUploadAlbum(band, loader) {
    if (albumQueue.length > 0) {
        var release = albumQueue.shift();
        var album = new AlbumNode();
        var id = $(release).attr('id');
        var source = 'http://musicbrainz.org/ws/2/release/' + id;
        album.setTitle($(release).find('title:first').text())
            .setReleaseDate($.defaultDateFormatter(new Date($(release).find('date:first').text())))
            .setParentBand(band)
            .setSource(source);
        loader.setStatus('сохраняем альбом "' + album.getName() + '" на сервер...');
        albumRepository.add(album, function (loadedAlbum) {
            loader.resetStatus('альбом успешно сохранен');

            loader.setStatus('загрузка композиций...');
            extLoadTracks(source, function (data) {
                loader.resetStatus('композиции загружены');
                trackQueue = $(data).find('track').toArray();
                console.log('tracks loaded', data, trackQueue);
                extUploadTrack(band, loadedAlbum, loader, source);
            });
        });
    }
}

var trackQueue = [];

function extUploadTrack(band, album, loader, source) {
    if (trackQueue.length > 0) {
        var track = trackQueue.shift();
        console.log('exporting', track);
        var trackNode = new TrackNode();
        if ($(track).find('title').length == 0 || $(track).find('length').length == 0) {
            messageService.showWarning('Композиция "' + $(track).find('title:first').text() + '" (' + $(track).find('recording').attr('id') + ') не содержит необходимых полей и не будет добавлена.');
            extUploadTrack(band, album, loader, source);
            return;
        }

        trackNode.setTitle($(track).find('title:first').text())
            .setParentAlbum(album)
            .setDuration(Math.floor(parseInt($(track).find('length:first').text()) / 1000))
            .setSerial($(track).find('position:first').text())
            .setSource(source);
        loader.setStatus('сохраняем композицию "' + trackNode.getName() + '" на сервер...');
        trackRepository.add(trackNode, function () {
            loader.resetStatus('композиция успешно сохранена');
            extUploadTrack(band, album, loader, source);
        });
    } else if (albumQueue.length > 0) {
        extUploadAlbum(band, loader);
    } else {
        loader.loaded();
    }
}

function appendNodesToList(combobox, nodes) {
    if (!nodes.length) {
        return;
    }
    var oldData =  $(combobox).combobox('getData');
    $(combobox).combobox('loadData', [].concat(oldData, nodes));
    console.log('nodes appended', nodes, combobox);
}

function refreshList(combobox) {
    var data =  $(combobox).combobox('getData');
    $(combobox).combobox('loadData', data);
}

function removeNodeFromList(combobox, node) {
    var oldData =  $(combobox).combobox('getData');
    var newData = [];
    for (var index in oldData) {
        var oldNode = oldData[index];
        if (oldNode.getId() == node.getId())
            continue;
        newData.push(oldNode);
    }
    $(combobox).combobox('loadData', newData);
}

function getSelectedNode(combobox) {
    var value = $(combobox).combobox('getValue');
    if (typeof value == undefined)
        return null;

    var data = $(combobox).combobox('getData');
    for (var index in data) {
        var obj = data[index];
        if (obj.getId() == value) {
            return obj;
        }
    }

    return null;
}

/**
 * Returns current edit mode. Available values band, album or track.
 */
function getEditMode() {
    var mode = $('#editTreeForm').find('input:checked').val();
    return mode;
}

function submitForm(form) {
    var mode = getEditMode();
    var node = null;
    var repository = null;
    //var list = '#' + mode + 'List';
    switch (mode) {
        case 'band':
            node = new BandNode();
            repository = bandRepository;

            node.setFoundDate($('#bandFoundDate').combo('getValue'))
                .setEndDate($('#bandEndDate').combo('getValue'))
                .setName($('#bandSearch').combo('getText'));
            break;
        case 'album':
            node = new AlbumNode();
            repository = albumRepository;
            var band = getSelectedNode($('#bandList'));
            node.setParentBand(band)
                .setTitle($('#albumSearch').combo('getText'))
                .setReleaseDate($('#albumReleaseDate').combo('getValue'));
            break;
        case 'track':
            node = new TrackNode();
            repository = trackRepository;
            var album = getSelectedNode($('#albumList'));
            node.setParentAlbum(album)
//                .setTitle($('#trackList').combo('getValue'))
                .setTitle($('#trackList').val())
                .setDuration($('#trackDuration').val())
                .setSerial($('#trackSerial').val());

            $('#trackSerial').numberspinner('setValue', parseInt($('#trackSerial').val()) + 1);
            break;
    }
    var source = $('#editSource').val();
    node.setSource(source);

    //console.log("save", mode, node);
    repository.add(node, successfulAdded);
    messageService.showNotification(getEntityName(node).toProperCase() + '"' + node.getName() + '" поставлен(а) в очередь на добавление...');
}

function getEntityName(node) {
    switch (node.className) {
        case 'BandNode':
            return 'группа';
        case 'AlbumNode':
            return 'альбом';
        case 'TrackNode':
            return 'композиция';
    }
}

function successfulAdded(result, node) {
    var message = getEntityName(node).toProperCase() + '"' + node.getName() + '" был(а) успешно добавлен(а)!';
    messageService.showNotification(message, 'Успех');

    switch (result.className) {
        case 'BandNode':
            $('#bandList').combobox('select', result.getId());
            break;
        case 'AlbumNode':
            $('#albumList').combobox('select', result.getId());
            console.log('album uploaded');
            if ($('#editLoadTracks').is(':checked')) {
                console.log('ready to load tracks');
                var loader = new Loading($('#editTreeAccordion'));
                loader.setStatus('загрузка композиций...');

                extLoadTracks(result.getSource(), function (data) {
                    loader.setStatus('композиции загружены'); // note: I did set status special

                    trackQueue = $(data).find('track').toArray();
                    console.log('tracks loaded', data);

                    extUploadTrack(null, result, loader, result.getSource());
                });
            }
            break;
    }

    console.log("added", node, result);
}

function editTypeChanged(radio) {
    switch ($(radio).val()) {
        case 'band':
            $('#hiddenFormElements').append($('#editDivBandList'));
            $('#editCellBandList').append($('#editDivBandSearch'));

            $('#editCellAlbum').fadeOut(function () {
                $('#hiddenFormElements').append($('#editCellAlbum'));
            });
            $('#editCellTrack').fadeOut(function () {
                $('#hiddenFormElements').append($('#editCellTrack'));
            });
            break;
        case 'album':
            $('#hiddenFormElements').append($('#editDivBandSearch'));
            $('#editCellBandList').append($('#editDivBandList'));

            $('#hiddenFormElements').append($('#editDivAlbumList'));
            $('#editCellAlbumList').append($('#editDivAlbumSearch'));

            $('#editRowAlbum').append($('#editCellAlbum'));
            $('#editCellAlbum').fadeIn();
            $('#editCellTrack').fadeOut(function() {
                $('#hiddenFormElements').append($('#editCellTrack'));
            });
            break;
        case 'track':
            $('#hiddenFormElements').append($('#editDivBandSearch'));
            $('#editCellBandList').append($('#editDivBandList'));
            $('#hiddenFormElements').append($('#editDivAlbumSearch'));
            $('#editCellAlbumList').append($('#editDivAlbumList'));

            $('#editRowAlbum').append($('#editCellAlbum'));
            $('#editCellAlbum').fadeIn();
            $('#editRowTrack').append($('#editCellTrack'));
            $('#editCellTrack').fadeIn();
            break;
    }
}

window.setInterval(function () {
    // resize widgets
    var totalHeight = $('#mainHeader').outerHeight();
    totalHeight += $('#mainBody').outerHeight();
    totalHeight += $('#vk_comments').outerHeight();
    totalHeight += $('#vk_groups').outerHeight();
    totalHeight += $('#mainFooter').outerHeight();
    mainResize(totalHeight);
}, 500);
