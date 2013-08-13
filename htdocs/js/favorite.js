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
    this._bandCallingQueue = new CallbackQueue();
    this._albumCallingQueue = new CallbackQueue();
    this._trackCallingQueue = new CallbackQueue();

    this.bindBand = function (name, callback) {
        var that = this;
        this._bandCallingQueue.register(name, function (callback) {
            that._identityMap.getRootNodes(callback);
        }, function (nodes) {
            for (var index in nodes) {
                if (!nodes.hasOwnProperty(index)) continue;
                var band = nodes[index];
                if (band.getName() == name) {
                    callback(band);
                    return;
                }
            }
            callback(null);
        });

        return this;
    };

    /**
     * @param {Node} bandNode
     * @param {string} name
     * @param {Function} callback
     * @returns {FavoriteBindingManager}
     */
    this.bindAlbum = function (bandNode, name, callback) {
        var key = bandNode.getId() + name;
        var that = this;
        this._albumCallingQueue.register(key, function (callback) {
            that._identityMap.getChildren(bandNode, callback);
        }, function (albums) {
            for (var index in albums) {
                if (!albums.hasOwnProperty(index)) continue;
                var album = albums[index];
                if (album.getName() == name) {
                    callback(album);
                    return;
                }
            }
            callback(null);
        });
        return this;
    };

    this.bindTrack = function (albumNode, name, callback) {
        var key = albumNode.getId() + name;
        var that = this;
        this._trackCallingQueue.register(
            key,
            function (callback) {
                that._identityMap.getChildren(albumNode, callback);
            },
            function (nodes) {
                for (var index in nodes) {
                    if (!nodes.hasOwnProperty(index)) continue;
                    var track = nodes[index];
                    if (track.getName() == name) {
                        callback(track);
                        return;
                    }
                }
                callback(null);
            }
        );
        return this;
    };
}