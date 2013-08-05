/**
 * MetaPlayer 1.0
 *
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2010-2013 Val Dubrava [ valery.dubrava@gmail.com ]
 *
 */

function Loading(element) {
    this.target = element;
    this.blocked = false;
    this.counter = 0;

    /**
     * Sets loading screen status.
     * @param status
     */
    this.setStatus = function (status) {
        this.counter ++;
        if (!this.blocked) {
            this.loading();
        }

        $('#loadingStatus').text(status);
        return this;
    }

    /**
     * Resets the status.
     */
    this.resetStatus = function (status) {
        this.counter --;
        if (this.blocked) {
            $('#loadingStatus').text(status);
            if (this.counter == 0) {
                this.loaded();
            }
        }
        return this;
    }

    /**
     * Loading complete, unblock element.
     */
    this.loaded = function() {
        $(this.target).unblock();
        this.blocked = false;
        return this;
    }

    this.loading = function () {
        $(this.target).block({
            message: '<h1>Загрузка...</h1><br /><img src="images/loading.gif" /><h3 id="loadingStatus"></h3>',
            css: {
                border: 'none',
                backgroundColor: '#000',
                '-webkit-border-radius': '10px',
                '-moz-border-radius': '10px',
                color: '#fff'
            },
            overlayCSS: {opacity: 0.8}
        });
        this.blocked = true;
    }
}

//<script type="text/javascript" src="js/easy-ui-wrappers.js"></script>
//<script type="text/javascript" src="js/loading.js"></script>
//    <script type="text/javascript" src="js/model.js"></script>
//    <script type="text/javascript" src="js/utils.js"></script>
//    <script type="text/javascript" src="js/repository.js"></script>
//    <script type="text/javascript" src="js/playlist.js"></script>
//    <script type="text/javascript" src="js/search.js"></script>
//    <script type="text/javascript" src="js/tree.js"></script>
//    <script type="text/javascript" src="js/player.js"></script>
//    <script type="text/javascript" src="js/index.js"></script>

// global loading object.
var bodyLoading = null;

/**
 * The class for loading several scripts.
 * @param scripts
 * @param callback
 */
function QueueLoader(scripts, callback) {
    this.counter = 0;
    this.callback = callback;

    /**
     * Loads the specified scripts and invoke callback when all scripts were loaded.
     */
    this.load = function () {
        if (!scripts || !scripts.length) {
            this.invoke();
            return;
        }

        console.log('begin loading', scripts, this.counter);

        for (var loadingIndex = 0; loadingIndex < scripts.length; loadingIndex ++) {
            var scriptName = scripts[loadingIndex];
            this.inc();
            var currentLoader = this;
            console.log('start loading', scriptName, this.counter);
            easyloader.load(scriptName, function () {
                currentLoader.dec();
            });
        }
    }

    this.invoke = function () {
        if ($.isFunction(this.callback)) {
            this.callback.call(this);
        }
    }

    this.inc = function () {
        this.counter ++;
    }

    this.dec = function () {
        this.counter --;
        if (this.counter == 0) {
            console.log('all queued scripts loaded');
            this.invoke();
        }
    }
}

// loading process
$(document).ready(function() {
    bodyLoading = new Loading($('body'));
    bodyLoading.setStatus('loading resources');

    new QueueLoader(['model.js', 'utils.js', 'repository.js', 'search.js', 'index.js'], function () {
        indexInit();
        bodyLoading.resetStatus('all resources loaded');
    }).load();
});
