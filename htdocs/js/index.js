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
            $.messager.show({msg: '<div class=\"messager-icon messager-error\"></div>Произошла ошибка на сервере:<br />' + thrownError, title: 'Ошибка', timeout: 0});
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
                $('#bandFoundDate').datebox('setValue', record.getFoundDate());
                $('#bandEndDate').datebox('setValue', record.getEndDate());
                record.loadChildren(function (data) {
                    $('#albumList').combobox('loadData', data);
                });
            }
        });
        bandRepository.bindOnLoaded(function (e, nodes) {
            appendNodesToList($('#bandList'), nodes);
        });
        bandRepository.bindOnRemoved(function (e, node) {
            removeNodeFromList($('#bandList'), node);
        });
        bandRepository.bindOnUpdated(function (e, node) {
            refreshList($('#bandList'));
        });

        $('#albumList').combobox({
            onSelect: function (record) {
                $('#albumReleaseDate').datebox('setValue', record.getReleaseDate());
//                record.loadChildren(function (data) {
//                    $('#trackList').combobox('loadData', data);
//                });
            }
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

//        $('#trackList').combobox({
//            onSelect: function (record) {
//                $('#trackDurationMM').val(Math.floor(record.getDurationMs() / 60));
//                $('#trackDurationSS').val(record.getDurationMs() % 60);
//                $('#trackSerial').val(record.getSerial());
//            },
//            keyHandler: {
//                query: function(q){
//                    console.log("query", q);
//                }
//            }
//        });
//
//        trackRepository.onLoaded(function (e, nodes) {
//            appendNodesToList($('#trackList'), nodes);
//        });
//        trackRepository.onRemoved(function (e, node) {
//            removeNodeFromList($('#trackList'), node);
//        });
//        trackRepository.onUpdated(function (e, node) {
//            refreshList($('#trackList'));
//        });

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

//            $(artist).find('release').each(function (index, release) {
//                extUploadAlbum(loadedBand, release, loader);
//            });
        });
    }, 'xml');
}

var albumQueue = [];

function extUploadAlbum(band, release, loader) {
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

        $.get(source, {inc: 'recordings'}, function (data) {
            trackQueue = $(data).find('track').toArray();

            var track = trackQueue.pop();
            extUploadTrack(band, loadedAlbum, track, loader, source);

//            $(data).find('track').each (function (index, track) {
//                extUploadTrack(loadedAlbum, track, loader, source);
//            });
        }, 'xml');
    });
}

var trackQueue = [];

function extUploadTrack(band, album, track, loader, source) {
    var trackNode = new TrackNode();
    trackNode.setTitle($(track).find('title:first').text())
        .setParentAlbum(album)
        .setDuration(Math.floor(parseInt($(track).find('length:first').text()) / 1000))
        .setSerial($(track).find('position:first').text())
        .setSource(source);
    loader.setStatus('сохраняем композицию "' + trackNode.getName() + '" на сервер...');
    trackRepository.add(trackNode, function () {
        loader.resetStatus('композиция успешно сохранена');
        if (trackQueue.length > 0) {
            var nextTrack = trackQueue.pop();
            extUploadTrack(band, album, nextTrack, loader, source);
        } else if (albumQueue.length > 0) {
            var nextAlbum = albumQueue.pop();
            extUploadAlbum(band, nextAlbum, loader);
        }
    });
}

function appendNodesToList(combobox, nodes) {
    if (!nodes.length) {
        return;
    }
    var oldData =  $(combobox).combobox('getData');
    //var selectedId = $(combobox).combobox('getValue');
    $(combobox).combobox('loadData', [].concat(oldData, nodes));
//    if (nodes.length == 1) {
//        selectedId = nodes[0].getId();
//    }
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
                .setName($('#bandList').combo('getText'));
            break;
        case 'album':
            node = new AlbumNode();
            repository = albumRepository;
            var band = getSelectedNode($('#bandList'));
            node.setParentBand(band)
                .setTitle($('#albumList').combo('getValue'))
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

    switch (node.className) {
        case 'BandNode':
            $('#bandList').combobox('select', node.getId());
            break;
        case 'AlbumNode':
            $('#albumList').combobox('select', node.getId());
            break;
    }

    console.log("added", node, result);
}

function editTypeChanged(radio) {
    switch ($(radio).val()) {
        case 'band':
            $('#editCellAlbum').fadeOut(function () {
                $('#hiddenFormElements').append($('#editCellAlbum'));
            });
            $('#editCellTrack').fadeOut(function () {
                $('#hiddenFormElements').append($('#editCellTrack'));
            });
            break;
        case 'album':
            $('#editRowAlbum').append($('#editCellAlbum'));
            $('#editCellAlbum').fadeIn();
            $('#editCellTrack').fadeOut(function() {
                $('#hiddenFormElements').append($('#editCellTrack'));
            });
            break;
        case 'track':
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
