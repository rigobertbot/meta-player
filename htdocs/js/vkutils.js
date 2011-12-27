/**
 * MetaPlayer 1.0
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2010-2011 Val Dubrava [ valery.dubrava@gmail.com ] 
 * 
 */
// main iframe size
var mainWidth = 650;


VK.init(function() {
    VK.api('getUserSettings', {test_mode: 1}, function(data) {
        if ((data.response & 8) !== 8) {
            VK.callMethod('showSettingsBox', 8);
        }
    });
    
    VK.Widgets.Comments('vk_comments', {
        limit: 25, 
        width: mainWidth, 
        attach: '*'
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