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

    /**
     * Shows warning message.
     * @param msg required
     * @param title optional
     * @param timeout optional
     */
    this.showWarning = function (msg, title, timeout) {
        if (title == undefined) title = this.warningTitle;
        if (timeout == undefined) timeout = this.warningTimeout;
        $.messager.show({msg: '<div class=\"messager-icon messager-warning\"></div>' + msg, title: title, timeout: timeout});
    }
}

var messageService = new MessageService();