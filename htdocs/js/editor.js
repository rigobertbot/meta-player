/**
 * MetaPlayer 1.0
 *
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2010-2011 Val Dubrava [ valery.dubrava@gmail.com ]
 *
 */

function Task(func, obj, args, title) {
    this.func = func;
    this.obj = obj;
    this.args = args;
    this.title = title;
    this.processed = false;
    this.finished = false;
    this.process = function () {
        this.processed = true;
        this.onBegin();
        this.func.apply(obj, args);
    }
    this.onBegin = function () {};
    this.finish = function () {
        this.finished = true;
        this.onEnd();
    }
    this.onEnd = function () {};
}

function Editor() {
    this.taskQueue = [];
    this.intervalId = false;
    this.polingInterval = 1000;
    this.clearStateTimeout = 500;
    this.infoBar = null;

    this.enqueue = function (func, obj, args, title) {
        var task = new Task(func, obj, args, title);
        var that = this;
        task.onBegin = task.onEnd = function () {
            that.updateInfo(this);
        }
        this.taskQueue.push(task);
        console.log('task added', this.taskQueue.length, title);
        this.updateInfo();
    }

    this.start = function () {
        var that = this;
        this.intervalId = setInterval(function () {
            var task = that.taskQueue.shift();
            if (task) {
                that.taskQueue.unshift(task);
                // if already processed - return
                if (task.processed) {
                    return;
                }
                console.log('task extracted', task, that.taskQueue.length);
                task.process();
            }
        }, this.polingInterval);
    }

    this.innerAdd = function (repository, node, onSuccess, immediately, title) {
        if (!immediately) {
            this.enqueue(this.innerAdd, this, [repository, node, onSuccess, true], title);
            return;
        }
        var that = this;
        repository.addOrGet(node, function () {
            var task = that.taskQueue.shift();
            task.finish();
            onSuccess.apply(this, arguments);
        }, function() {
            var problemTask = that.taskQueue.shift();
            console.log('Error on processing task:', problemTask);
            // TODO: reporting
        });
    }

    this.addBand = function(band, onSuccess, immediately) {
        if (typeof band != 'object' || band.className != 'BandNode') {
            throw "Invalid argument type, got " + typeof band + ", expected BandNode.";
        }
        this.innerAdd(bandRepository, band, onSuccess, immediately, 'Adding band ' + band.getName());
    }

    this.addAlbum = function (album, onSuccess, immediately) {
        if (typeof album != 'object' || album.className != 'AlbumNode') {
            throw "Invalid argument type, got " + typeof album + ", expected AlbumNode.";
        }

        this.innerAdd(albumRepository, album, onSuccess, immediately, 'Adding album ' + album.getName());
    }

    this.addTrack = function (track, onSuccess, immediately) {
        if (typeof track != 'object' || track.className != 'TrackNode') {
            throw "Invalid argument type, got " + typeof track + ", expected TrackNode.";
        }

        this.innerAdd(trackRepository, track, onSuccess, immediately, 'Adding track ' + track.getName());
    }

    this.setInfoBar = function (info) {
        if (!info) {
            return null;
        }

        var container = $(info).empty();
        console.log('set info', $('<a href="#"></a>').appendTo(container).linkbutton({plain: true}).find('.l-btn-empty').addClass('pagination-loaded'));

        $(container).hide();
        return this.infoBar = container.append('<span>Tasks (<span class="task-info-count">0</span>):<span class="task-info-current"></span></span>');
    }

    this.updateInfo = function (currentTask) {
        if (!this.infoBar) {
            return;
        }
        $(this.infoBar).find('.task-info-count').text(this.taskQueue.length);
        if (this.taskQueue.length > 0) {
            $(this.infoBar).show();
            $(this.infoBar).find('.l-btn-empty').addClass('pagination-loading');
        } else {
            $(this.infoBar).find('.l-btn-empty').removeClass('pagination-loading');
        }
        if (currentTask) {
            if (currentTask.finished) {
                currentTask.title += ' done.';
                var that = this;
                setTimeout(function () {
                    if (that.taskQueue.length == 0) {
                        $(that.infoBar).find('.task-info-current').text('');
                        $(that.infoBar).hide();
                    }
                }, this.clearStateTimeout);
            }
            $(this.infoBar).find('.task-info-current').text(currentTask.title);
        }
    }
}
