/**
 * MetaPlayer 1.0
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2010-2011 Val Dubrava [ valery.dubrava@gmail.com ] 
 * 
 */
$(document).ready(function () {
    mainPlayer.init();
    mainTree.init();
    mainPlaylist.init();
    easyloader.load('messager', function () {
        $(document).ajaxError(function (event, jqXHR, ajaxSettings, thrownError) {
            console.log("errrrrorrrr!");
            $.messager.show({msg: '<div class=\"messager-icon messager-error\"></div>Произошла ошибка на сервере:<br />' + thrownError, title: 'Ошибка', timeout: 0});
        });
    });

    easyloader.load('combobox', function(){
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
                    console.log('validate: ', this, value, param);
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
        new BandRepository().list(function (data) {
            $('#bandList').combobox('loadData', data);
        }, {onlyUser: true});

        $('#albumList').combobox({
            onSelect: function (record) {
                $('#albumReleaseDate').datebox('setValue', record.getReleaseDate());
                record.loadChildren(function (data) {
                    $('#trackList').combobox('loadData', data);
                });
            }
        })
    });
    easyloader.load('form', function () {
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
    });
    easyloader.load('datebox', function () {
        $('#bandFoundDate,#bandEndDate,#albumReleaseDate').datebox({
            formatter: function (dateDate) {
                return $.format.date(dateDate, "yyyy-MM-dd");
            }
        });
    });
});

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
            repository = new BandRepository();

            node.setFoundDate($('#bandFoundDate').combo('getValue'))
                .setEndDate($('#bandEndDate').combo('getValue'))
                .setName($('#bandList').combo('getText'));
            break;
        case 'album':
            node = new AlbumNode();
            repository = new AlbumRepository();
            var band = getSelectedNode($('#bandList'));
            node.setParentBand(band)
                .setTitle($('#albumList').combo('getValue'))
                .setReleaseDate($('#albumReleaseDate').combo('getValue'));

            break;
        case 'track':
            node = new TrackNode();
            repository = new TrackRepository();
            var album = getSelectedNode($('#albumList'));
            node.setParentAlbum(album)
                .setTitle($('#trackList').combo('getValue'))
                .setDuration($('#trackDuration').combo('getValue'))
                .setSerial($('#trackSerial').val());

            $('#trackSerial').val(parseInt($('#trackSerial').val()) + 1);
            break;
    }
    var source = $('#editSource').val();
    node.setSource(source);

    //console.log("save", mode, node);
    repository.add(node, successfulAdded);
}

function successfulAdded(result, node) {
    var message = null;
    switch (node.className) {
        case 'BandNode':
            message = 'Группа "' + node.getName() + '" была успешно добавлена!';
            break;
        case 'AlbumNode':
            message = 'Альбом "' + node.getName() + '" был успешно добавлен!';
            break;
        case 'TrackNode':
            message = 'Композиция "' + node.getName() + '" была успешно добавлена!';
            break;
    }
    $.messager.show({msg: '<div class=\"messager-icon messager-info\"></div>' + message, title: 'Успех', timeout: 0});
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
