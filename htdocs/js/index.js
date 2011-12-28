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
        $('#bandList').combobox({onSelect: function (record) {
            $('#albumList').combobox('reload', 'album/listUser?bandId=' + record.id);
        }});
    });
    easyloader.load('form', function () {
        $('#editTreeForm').form({
            onSubmit: function () {
                // recalculate track duration
                $('#trackDuration').val(parseInt($('#trackDurationMM').val()) * 60 + parseInt($('#trackDurationSS').val()));

                if ($(this).form('validate')) {
                    alert('submit');
                }
                return false;
            }
        });
        albumRow = $('#editRowAlbum').parent();
        trackRow = $('#editRowTrack').parent();
        editTypeChanged($('#editTypeBand'));
    });
});

var albumRow = null;
var trackRow = null;

function editTypeChanged(radio) {
    switch ($(radio).val()) {
        case 'band':
            $('#editRowAlbum').fadeOut(function () {
                $('#hiddenFormElements').append($('#editRowAlbum'));
            });
            $('#editRowTrack').fadeOut(function () {
                $('#hiddenFormElements').append($('#editRowTrack'));
            });
            break;
        case 'album':
            $(albumRow).append($('#editRowAlbum'));
            $('#editRowAlbum').fadeIn();
            $('#editRowTrack').fadeOut(function() {
                $('#hiddenFormElements').append($('#editRowTrack'));
            });
            break;
        case 'track':
            $(albumRow).append($('#editRowAlbum'));
            $('#editRowAlbum').fadeIn();
            $(trackRow).append($('#editRowTrack'));
            $('#editRowTrack').fadeIn();
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