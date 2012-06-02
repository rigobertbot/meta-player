/**
 * MetaPlayer 1.0
 *
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2010-2011 Val Dubrava [ valery.dubrava@gmail.com ]
 *
 */

/**
 * The facade for message service.
 */
function MessageService() {
    this.warningTitle = 'Предупреждение';
    this.warningTimeout = 0;
    this.noteTitle = 'Информирование';
    this.noteTimeout = 3000;
    this.errorTitle = 'Ошибка';
    this.errorTimeout = 0;

    /**
     * Shows warning message.
     * @param msg required
     * @param title optional
     * @param timeout optional
     */
    this.showWarning = function (msg, title, timeout) {
        if (title == undefined) title = this.warningTitle;
        if (timeout == undefined) timeout = this.warningTimeout;
        $.messager.show({
            msg: '<div class=\"messager-icon messager-warning\"></div>' + msg,
            title: title,
            timeout: timeout,
            bottom: false,
            top: $('#mainBody').offset().top + $('#mainBody').height()
        });
    }

    this.showNotification = function (msg, title, timeout) {
        if (title == undefined) title = this.noteTitle;
        if (timeout == undefined) timeout = this.noteTimeout;
        $.messager.show({msg: '<div class=\"messager-icon messager-info\"></div>' + msg,
            title: title,
            timeout: timeout
//            bottom: false,
//            top: $('#mainBody').offset().top + $('#mainBody').height()
        });
    }

    this.showError = function (msg, title, timeout) {
        if (title == undefined) title = this.errorTitle;
        if (timeout == undefined) timeout = this.errorTimeout;
        $.messager.show({msg: '<div class=\"messager-icon messager-error\"></div>' + msg,
            title: title,
            timeout: timeout,
            bottom: false,
            top: $('#mainBody').offset().top + $('#mainBody').height()
        });
    }
}

var messageService = new MessageService();

