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

    easyloader.load('combobox', function(){
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
                // recalculate track duration
                $('#trackDuration').val(parseInt($('#trackDurationMM').val()) * 60 + parseInt($('#trackDurationSS').val()));

                if ($(this).form('validate')) {
                    var type = $('#editTreeForm input:checked').val();
                    alert(type);
                    $(this).form({url: '/' + type + '/add'});
                    return true;
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

function submitForm(form) {

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