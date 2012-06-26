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
}

var associationManager = new AssociationManager();

function Audio(aid, url, artist, title, duration) {
    this.id = aid;
    this.url = url;
    this.artist = artist;
    this.title = title;
    this.duration = duration;
}