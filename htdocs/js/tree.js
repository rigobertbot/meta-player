/**
 * MetaPlayer 1.0
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2010-2011 Val Dubrava [ valery.dubrava@gmail.com ] 
 * 
 */
function Tree() {
    /**
     * Causes when any number of nodes were laoded.
     */
    this.nodeLoadedEvent =  "treeNodeLoaded";
    /**
     * Causes after expanding node, when all children were loaded.
     */
    this.childrenLoadedEvent = "childrenLoaded";
    this.menuNode = null;
    this.editedNode = null;
    /**
     * @type TreeGrid
     */
    this.treegrid = null;
    this.loadingCounter = 0;
    /**
     * @type TreePlayer
     */
    this.treePlayer = null;

    /**
     * @type {Searcher}
     */
    this.searcher = new Searcher();
    
    this.init = function () {
        var that = this;

        $.extend($.fn.datagrid.defaults.editors, {
            duration: {
                init: function(container, options){
                    var input = $('<input type="text" class="datagrid-editable-input">').appendTo(container);
                    return input;
                },
                getValue: function(target){
                    var value = $(target).val();
                    var parts = value.split(':');
                    var resultMs = 0;
                    if (parts.length == 1) {
                        resultMs =  parseInt(parts[0]);
                    } else if (parts.length == 2) {
                        resultMs = parseInt(parts[0]) * 60 + parseInt(parts[1]);
                    } else if (parts.length == 3) {
                        resultMs = parseInt(parts[0]) * 60 * 60 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
                    } else {
                        throw "wrong value";
                    }
                    return resultMs;
                },
                setValue: function(target, value){
                    $(target).val(value);
                },
                resize: function(target, width){
                    var input = $(target);
                    if ($.boxModel == true){
                        input.width(width - (input.outerWidth() - input.width()));
                    } else {
                        input.width(width);
                    }
                }
            },
            editButtons: {
                init: function (container, options) { //' + "'" + rowData.getId() + "'" + '
                    that.bindEditKeys();
                    return $($('<div>').append($('<a href="#" id="editColumnSave" onclick="mainTree.getTreeGrid().endEdit(\'' + that.editedNode.getId() + '\'); event.stopPropagation();" iconCls="icon-save" plain="true" title="Применить изменения"></a>').linkbutton()).html() +
                        $('<div>').append($('<a href="#" id="editColumnCancel" onclick="mainTree.getTreeGrid().cancelEdit(\'' + that.editedNode.getId() + '\'); event.stopPropagation();" iconCls="icon-cancel" plain="true" title="Отменить изменения"></a>').linkbutton()).html()).appendTo(container);
                },
                getValue: function (target) {
                    return undefined;
                },
                setValue: function (target, value) {
                }
            }
        });

        this.treegrid = new TreeGrid($('#metaTree'), {
            columns: [[
                {field: 'checked', checkbox: true},
                {field: 'name', title: 'Название', width: 250, editor: 'text'},
                {field: 'duration', title: 'Длит.', width: 30, editor: 'duration'},
//                {field: 'serial', title: '№', width: 50, editor: 'numberbox'},
                {
                    field: 'date', title: 'Дата', width: 80,
                    editor: {
                        type: 'datebox', options: {formatter: $.defaultDateFormatter}
                    }
                },
                {field: 'mp3', title: 'MP3', width: 30, formatter: function (value, rowData, rowIndex) {return that.formatterMp3(rowData);}},
                {field: 'edited', hidden: true, width: 60, formatter: function (value, rowData, rowIndex) {
                    return '<span />';
                    //return that.editedColumnFormatter(value, rowData, rowIndex);
                }, editor: 'editButtons'}
            ]],
            onBeforeEdit: function (row) {
                that.editedNode = row;
                that.getTreeGrid().showColumn('edited');
            },
            onCancelEdit: function (row) {
                that.unbindEditKeys();
                that.getTreeGrid().hideColumn('edited');
                that.editedNode = null;
            },
            onAfterEdit: function (row, changes) {
                that.unbindEditKeys();
                // fix duration value
                row.setDuration(row.duration).setDate(row.date).setName(row.name);

                that.updateNode(row);
                that.getTreeGrid().hideColumn('edited');
                that.editedNode = null;
            },
            onContextMenu: function(e, row){
                e.preventDefault();
                that.menuNode = row;
                $('#treeMenu').menu(row.isPlayable() ? 'enableItem' : 'disableItem', $('#treeMenuShowLyrics'));
                $('#treeMenu').menu('show', {
                    left: e.pageX,
                    top: e.pageY
                });
            },
            onDblClickRow: function (row) {
                that.menuNode = row;
                that.playNode();
            },
            rowStyler: function (rowData) {
                return that.formatBackground(rowData);
            }
        });

        this.getTreeGrid().setOptions({
            onBeforeLoad: function (row, node) {
                if (row) {
                    that.treegrid.collapse(node.id);
                    that.treegrid.loading();
                    that.loadingCounter ++;
                    row.loadChildren(function () {
                        that.loadingCounter --;
                        if (that.loadingCounter == 0) {
                            that.treegrid.loaded();
                        }
                        if (!row.children) {
                            row.children = [];
                        }
                        that.triggerChildrenLoaded(row);
                        that.treegrid.expand(node.id);
                    });
                } else {
                    // it means loading root node.
                    //bodyLoading.resetStatus('tree is ready');
                }
                return false;
            }
        });

        $(repositories).each(function (index, repository) {
            repository.bindOnLoaded(function (e, data) {
                that.nodeLoaded(data);
            });
            repository.bindOnRemoved(function (e, data) {
                that.nodeRemoved(data);
            });
            repository.bindOnUpdated(function (e, data) {
                that.nodeUpdated(data);
            })
        });

        // load bands
        that.getTreeGrid().loading();
        bandRepository.list(function () {
            that.getTreeGrid().loaded();
        });

        // quick fix, http://code.google.com/p/meta-player/issues/detail?id=15
        $('#bodyAccordion').bind('onSelect', function (event, title) {
            var selected = $(this).accordion('getSelected');
            var id = $(selected).attr('id');
            if (id == 'treeAccordion') {
                that.getTreeGrid().append(null, []);
            }
        });

        this.treePlayer = new TreePlayer(this.treegrid, mainPlayer, this.searcher);

        this.treePlayer.bindChangeCurrent(function (e, lastNode, currentNode) {
            $([lastNode, currentNode]).each (function (i, node) {
                if (!node) {
                    return true;
                }
                console.log('refresh', node);
                that.treegrid.refresh(node.id);
            });
        });

        this.treePlayer.bindChangeStart(function (e, lastNode, startNode) {
            $([lastNode, startNode]).each (function (i, node) {
                if (!node) {
                    return true;
                }
                that.treegrid.refresh(node.id);
                var children = that.treegrid.getChildren(node.id);
                $(children).each(function (i, child) {
                    console.log('refresh', child);
                    that.treegrid.refresh(child.id);
                });
            });
        });

        this.searcher.bindSearchFailed(function (event, node) {
            console.log('search failed', node);
            that.treegrid.refresh(node.id);
        });
        this.searcher.bindSearchSuccess(function (event, node) {
            that.treegrid.refresh(node.id);
        });

        $('#associationWindow').window({
            left: 25,
            top: 50,
            width: 600,
            height: 400,
            closed: true
        });
    }

    this.bind = function (eventName, handler, ns) {
        ns = ns ? '.' + ns : '';
        $(this).bind(eventName + ns, handler);
    }
    this.unbind = function (eventName, ns) {
        ns = ns ? '.' + ns : '';
        $(this).unbind(eventName + ns);
    }

    this.bindNodeLoaded =  function (handler, ns) {
        this.bind(this.nodeLoadedEvent, handler, ns);
    }
    this.unbindNodeLoaded = function (ns) {
        this.unbind(this.nodeLoadedEvent, ns);
    }
    this.triggerNodeLoaded = function (parentNode, nodes) {
        $(this).trigger(this.nodeLoadedEvent, [parentNode, nodes]);
    }

    this.bindChildrenLoaded = function (handler, ns) {
        this.bind(this.childrenLoadedEvent, handler, ns);
    }
    this.unbindChildrenLoaded = function (ns) {
        this.unbind(this.childrenLoadedEvent, ns);
    }
    this.triggerChildrenLoaded = function (parentNode) {
        $(this).trigger(this.childrenLoadedEvent, [parentNode]);
    }

    /**
     * @return jQuery
     */
    this.getTree = function () {
        return $('#metaTree');
    }

    /**
     * @return TreeGrid
     */
    this.getTreeGrid = function () {
        return this.treegrid;
    }

    this.formatterMp3 = function (node) {
        if (!node.isPlayable()) {
            return '';
        }
        var container = $('<div></div>');

        var button = $('<div onclick="event.stopPropagation();mainTree.editAssociation(\'' + node.id + '\');"></div>').appendTo(container);
        if (!node.getQuery()) {
            $(button).addClass('failed-icon');
        } else if (!node.getAssociation()) {
            $(button).addClass('loading-icon');
        } else {
            $(button).addClass('success-icon');
        }

        return $(container).html();
    }

    this.formatBackground = function (node) {
        if (!this.treePlayer) {
            return null;
        }
        var color = null;
        if (this.treePlayer.startNode) {
            var parent = node;
            while (parent && parent !== this.treePlayer.startNode) {
                parent = this.treegrid.getParent(parent.id);
            }
            if (parent) {
                color = 'lightgray';
            }
        }
        if (this.treePlayer.currentNode === node) {
            color = 'lightblue';
        }
        if (color) {
            return 'background: ' + color;
        }
        return null;
    }

    this.editAssociation = function (nodeId) {
        messageService.showNotification('Test');
        var node = this.treegrid.getNode(nodeId);
        if (!node.isPlayable()) {
            return;
        }

        $('#associationWindow').window({
            modal: true,
            closed: false
        });

        var assocGrid = new AssociationGrid('associations', node);
    }
    
    this.nodeLoaded = function (nodes) {
        if (!nodes.length || nodes.length < 1) {
            this.triggerNodeLoaded(null, []);
            return;
        }
        var parentId = nodes[0].getParentId();
        var parentNode = parentId ? $('#metaTree').treegrid('find', parentId) : undefined;
        $('#metaTree')
//            .treegrid('toggle', parentId)
            .treegrid('append', {
                parent: parentId,
                data: nodes
            });

        if (parentNode) {
//            $('#metaTree').treegrid('toggle', parentNode.getId()); // treegrid('toggle', parentNode.getId()).
            this.triggerNodeLoaded(parentNode, nodes);
        } else {
            this.triggerNodeLoaded(null, nodes);
        }

        var that = this;
        $(nodes).each(function (i, node) {
            if (node.isPlayable()) {
                that.searcher.schedule(node);
            }
        });

    }

    /**
     * Handles nodeRemove event.
     * @param node
     */
    this.nodeRemoved = function (node) {
        $('#metaTree').treegrid('remove', node.getId());
    }

    /**
     * Remove node.
     * @param node
     */
    this.removeNode = function (node) {
        var type = '';
        var type2 = '';
        var repository = getRepositoryFor(node);
        if (node instanceof BandNode) {
            type = 'группу';
            type2 = 'Группа';
        } else if (node instanceof AlbumNode) {
            type = 'альбом';
            type2 = 'Альбом';
        } else if (node instanceof TrackNode) {
            type = 'композицию';
            type2 = 'Композиция';
        }

        if (confirm('Вы уверены что хотите удалить ' + type + ' "' + node.getName() + '"?')) {
            repository.remove(node, function () {
                messageService.showNotification(type2 + ' "' + node.getName() + '" успешно удален(а).');
            });
        }
    }

    /**
     * Handles nodeUpdated event.
     * @param node
     */
    this.nodeUpdated = function (nodes) {
        if (!nodes || !nodes.length || nodes.length == 0)
            return;

        for (var i = 0; i < nodes.length; i ++) {
            var node = nodes[i];
            // append if not exists
            if (!this.getTreeGrid().find(node.getId())) {
                this.getTreeGrid().append(node.getParentId(), [node]);
            }
            if (node.isPlayable()) {
                // if search was failed, reset to try search again.
                node.resetSearchTries();
                this.searcher.schedule(node);
            }
            this.getTreeGrid().refresh(node.getId());
        }
    }

    this.updateNode = function (node) {
        var type = '';
        var repository = getRepositoryFor(node);
        if (node instanceof BandNode) {
            type = 'группы';
        } else if (node instanceof AlbumNode) {
            type = 'альбома';
        } else if (node instanceof TrackNode) {
            type = 'композиции';
        }
        if (repository == null) {
            return;
        }

        repository.update(node, function () {
            messageService.showNotification('Изменения ' + type + ' ' + node.getName() + ' были успешно сохранены.');
        });
    }

    /**
     * Binds keyup to edit control elements for ending or canceling editing.
     * @param inputElements
     */
    this.bindEditKeys = function() {
        var that = this;
        $('[node-id=' + this.editedNode.getId() + '] input').bind('keyup.edited', function (event) {
            switch (event.keyCode) {
                case 27: //escape
                    that.getTreeGrid().cancelEdit(that.editedNode.getId());
                    break;
                case 13: //enter
                    that.getTreeGrid().endEdit(that.editedNode.getId());
                    break;
            }
        });
    }

    /**
     * Unbinds keyup from edit control elements.
     */
    this.unbindEditKeys = function () {
        $('[node-id=' + this.editedNode.getId() + '] input').unbind('keyup.edited');
    }

    /**
     * Handles selecting remove menu item.
     */
    this.removeMenuNode = function () {
        if (!this.menuNode)
            return;
        this.removeNode(this.menuNode);
    }

    this.editMenuNode = function () {
        if (!this.menuNode)
            return;
        this.getTreeGrid().beginEdit(this.menuNode.getId());
    }
    this.reloadMenuNode = function () {
        if (!this.menuNode)
            return;
        if ($.isArray(this.menuNode.children)) {
            for (var index = 0; index < this.menuNode.children.length; index ++ ){
                var child = this.menuNode.children[index];
                this.getTreeGrid().remove(child.getId());
            }
            this.menuNode.children = undefined;
        }
        var updatedNode = this.menuNode;
        var repository = getRepositoryFor(this.menuNode);
        repository.get(this.menuNode.getServerId(), function () {
            updatedNode.loadChildren(function () {
                messageService.showNotification('Успешно обновлено.');
            });
        });
    }
    this.refreshMenuNode = function () {
        if (!this.menuNode)
            return;
        this.treegrid.refresh(this.menuNode.id);
    }

    this.playNode = function () {
        if (!this.treePlayer) {
            console.log('Tree player is not initialized yet.');
            return;
        }
        console.log('begin playing...');
        if (!this.treePlayer.startNode) {
            this.treePlayer.startPlaying(this.menuNode);
            return;
        }

        // check, if specified node is child of start playing node
        var testNode = this.menuNode;
        while (testNode && testNode !== this.treePlayer.startNode) {
            testNode = this.treegrid.getParent(testNode.id);
        }
        if (testNode == null) {
            if (confirm('Вы хотите начать проигрывание с ' + this.menuNode.getName() + '? Текущая позиция будет потеряна.')) {
                this.treePlayer.startPlaying(this.menuNode);
                return;
            }
            return;
        }

        this.treePlayer.play(this.menuNode);
    };

    this.showLyrics = function () {
        if (!this.menuNode || !this.menuNode.isPlayable()) {
            return;
        }

        var assoc = this.menuNode.getAssociation();
        if (!assoc) {
            return;
        }

        if (assoc.isResolved() && assoc.audio.lyricsId) {
            showLyrics(assoc.audio.lyricsId);
        } else {
            associationManager.resolve(assoc, function () {
                showLyrics(assoc.audio.lyricsId);
            });
        }
    }

    this.shareNode = function () {
        if (!this.menuNode) {
            return;
        }
        var text = "Послушайте ";
        switch (this.menuNode.className) {
            case 'AlbumNode':
                text += ' альбом ';
                break;
            case 'BandNode':
                text += ' группу ';
                break;
            case 'TrackNode':
                text += ' композицию ';
                break;
        }
        text += this.menuNode.getName();
        text += "!";

        selfPost(this.menuNode.shareId, text, function () {
            messageService.showNotification('На стене...');
        });
    }

    /**
     * Gets all tracks from the specified node
     */
    this.buildPlaylist = function (selectedNodes) {
        var playlist = [];

        var traverseToken = new Date().getTime();

        for (var index in selectedNodes) {
            var node = selectedNodes[index];
            console.log('try to add ', node);
            if (node.isLeaf()) {
                console.log('it is a leaf, so just add it ');
                node.traverseToken = traverseToken;
                playlist.push(node);
                continue;
            }
            console.log('it is a node, so parse it');
            this.recursiveBuildPlaylist(node, selectedNodes, playlist, traverseToken);
        }

        return playlist;
    }

    this.recursiveBuildPlaylist = function (node, selected, playlist, traverseToken) {
        if (node.traverseToken === traverseToken) {
            console.log("this node already traversed!", node);
            return null;
        }
        node.traverseToken = traverseToken;
        var noSelected = true;
        console.log('go throug children', node.children);
        if ($.isArray(node.children) && node.children.length > 0) {
            for (var childIndex in node.children) {
                var child = node.children[childIndex];
                var childNoSelected = this.recursiveBuildPlaylist(child, selected, playlist, traverseToken);
                if (childNoSelected === null) {
                    continue;
                }
                if (!childNoSelected && child.isLeaf()) {
                    playlist.push(child);
                }
                noSelected &= childNoSelected;
            }

            // adds all child nodes if no one node selected and if children are TrackNode
            if (noSelected && node.children[0].isLeaf()) {
                $(node.children).each(function (index, child) {
                    playlist.push(child);
                });
            }
        }

        if (!noSelected) {
            return false;
        }

        return $.inArray(node, selected) === -1; // it means no selected = true
    }
}

mainTree = new Tree();

//Tree.instance = mainTree;
//Tree.getInstance = function () { return Tree.instance; }
console.log("Tree instance successfully created.", mainTree);

/**
 * The class NodeLoader provide methods for loading all subnodes of the specified nodes recursively from the specified tree.
 * @param nodes
 * @param mainTree
 */
function NodeLoader(nodes, mainTree) {
    this.nodeLoadedEvent = "loaded";
    this.loadingCounter = 0;
    this.nodes = $.isArray(nodes) ? nodes : [nodes];
    this.treeGrid = mainTree.getTreeGrid();
    this.mainTree = mainTree;

    /**
     * Subscribes to load event the specified handler.
     * @param handler
     */
    this.bindLoaded = function (handler) {
        $(this).bind(this.nodeLoadedEvent, handler);
    }

    /**
     * Invokes loaded event.
     */
    this.triggerLoaded = function () {
        $(this).trigger(this.nodeLoadedEvent);
    }

    /**
     * Begin loading of the specified nodes.
     */
    this.load = function (callback) {
        if ($.isFunction(callback)) {
            this.bindLoaded(callback);
        }

        if (this.nodes.length == 0) {
            this.triggerLoaded();
            return;
        }

        this.loadingCounter = 0;
        console.log('begin recursive loading nodes: ', this.nodes);
        for (var i = 0; i < this.nodes.length; i ++) {
            this.loadingCounter ++;
            this.recursiveLoad(this.nodes[i]);
            this.loadingCounter --;
        }
        this.triggerLoadedIfCounter();
    }

    this.triggerLoadedIfCounter = function() {
        if (this.loadingCounter === 0) {
            console.log('loadingCounter is 0, so that is it');
            this.triggerLoaded();
        }
    }

    this.recursiveLoad = function(node) {
        if (node.isLeaf()) {
            console.log('node does not have children at all', node);
            return;
        }

        if (node.children && $.isArray(node.children)) {
            console.log('the children of the node aldready loaded', node);
            for (var i in node.children) {
                var child = node.children[i];
                this.loadingCounter ++;
                console.log('lest go dipper');
                this.recursiveLoad(child);
                this.loadingCounter --;
            }
            this.triggerLoadedIfCounter();
        } else {
            var that = this;
            this.mainTree.bindChildrenLoaded(
                function (event, parent) {
                    // i want catch only event's of top context node
                    if (parent !== node) {
                        return;
                    }
                    console.log('children of the node loaded', parent);
                    that.loadingCounter --;
                    that.mainTree.unbindChildrenLoaded('recursiveExpand' + node.getId())

                    //console.log("collapse ", node.getId());
                    that.treeGrid.collapse(node.getId());

                    console.log('children loaded, so go dipper');
                    that.recursiveLoad(parent);
                },
                'recursiveExpand' + node.getId()
            );

            this.loadingCounter ++;
            console.log('begin load children, expand node ', node);
            this.treeGrid.expand(node.getId());
        }
    }
}
