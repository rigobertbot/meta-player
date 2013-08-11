/**
 * MetaPlayer 1.0
 *
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2010-2013 Val Dubrava [ valery.dubrava@gmail.com ]
 *
 */
function FavoriteBindingManager(identityMap) {
    /**
     * @type {IdentityMap}
     * @private
     */
    this._identityMap = identityMap;

    this.bindBand = function (name, callback) {
        this._identityMap.getRootNodes(function (nodes) {
            for (var index in nodes) {
                if (!nodes.hasOwnProperty(index)) continue;
                var band = nodes[index];
                if (band.getName() == name) {
                    callback(band);
                    return;
                }
            }
        });
        return this;
    };

    this.bindAlbum = function (bandNode, name, callback) {
        this._identityMap.getChildren(bandNode, function (albums) {
            for (var index in albums) {
                if (!albums.hasOwnProperty(index)) continue;
                var album = albums[index];
                if (album.getName() == name) {
                    callback(album);
                    return;
                }
            }
        });
        return this;
    };

    this.bindTrack = function (albumNode, name, callback) {
        this._identityMap.getChildren(albumNode, function (nodes) {
            for (var index in nodes) {
                if (!nodes.hasOwnProperty(index)) continue;
                var track = nodes[index];
                if (track.getName() == name) {
                    callback(track);
                    return;
                }
            }
        });
        return this;
    };
}