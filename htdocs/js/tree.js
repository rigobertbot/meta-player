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
    this.nodeLoadedEvent =  "nodeLoaded";
    /**
     * Causes after expanding node, when all children were loaded.
     */
    this.childrenLoadedEvent = "childrenLoaded";
    this.expandedEvent = "expanded";
    this.menuNode = null;
    this.editedNode = null;
    this.treegrid = null;
    this.loadingCounter = 0;
    
    this.init = function () {
        var that = this;
        bodyLoading.setStatus('initializing tree');
        new QueueLoader(['treegrid', 'easy-ui-wrappers.js', 'accordion'], function() {
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

            that.treegrid = new TreeGrid($('#metaTree'), {
                columns: [[
                    {field: 'name', title: 'Название', width: 250, editor: 'text'},
                    {field: 'checked', checkbox: true},
                    {field: 'duration', title: 'Длит.', width: 30, editor: 'duration'},
                    {
                        field: 'date', title: 'Дата', width: 80,
                        editor: {
                            type: 'datebox', options: {formatter: $.defaultDateFormatter}
                        }
                    },
                    {field: 'serial', title: '№', width: 50, editor: 'numberbox'},
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
                    $('#treeMenu').menu(row.isBelongsToUser() ? 'enableItem' : 'disableItem', $('#treeMenuEdit'));
                    $('#treeMenu').menu('show', {
                        left: e.pageX,
                        top: e.pageY
                    });
                },
                onExpand: function (row) {
                    $(that).trigger(mainTree.expandedEvent, [row]);
                },
                onDblClickRow: function (row) {
                    that.playNodes([row]);
                }
            });

            that.getTreeGrid().setOptions({
                onBeforeLoad: function (row, node) {
                    if (row) {
                        that.getTreeGrid().loading();
                        that.loadingCounter ++;
                        row.loadChildren(function () {
                            that.loadingCounter --;
                            if (that.loadingCounter == 0) {
                                that.getTreeGrid().loaded();
                            }
                            if (!row.children) {
                                row.children = [];
                            }
                            that.triggerChildrenLoaded(row);
                        });
                    } else {
                        // it means loading root node.
                        bodyLoading.resetStatus('tree is ready');
                    }
                    return false;
                }
            });
            that.getTreeGrid().loading();
            bandRepository.list(function () {
                that.getTreeGrid().loaded();
            });

            // quick fix, http://code.google.com/p/meta-player/issues/detail?id=15
            $('#bodyAccordion').accordion({onSelect: function (title) {
                var selected = $(this).accordion('getSelected');
                var id = $(selected).attr('id');
                if (id == 'treeAccordion') {
                    that.getTreeGrid().append(null, []);
                }
            }});
        }).load();

        // subscriptions
//        mainPlayer.bindStartPlaying(function () {
//            that.startPlay();
//        });
        $(repositories).each(function (index, repository) {
            repository.bindOnLoaded(function (e, data) {
                that.nodeLoaded(data);
            })
            repository.bindOnRemoved(function (e, data) {
                that.nodeRemoved(data);
            });
            repository.bindOnUpdated(function (e, data) {
                that.nodeUpdated(data);
            })
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
    
    this.isSelected = function () {
        var panel = $('#bodyAccordion').accordion('getSelected');
        return panel.attr('id') == 'treeAccordion';
    }
    
    this.nodeLoaded = function (nodes) {
        if (!nodes.length || nodes.length < 1) {
            this.triggerNodeLoaded(null, []);
            return;
        }
        var parentId = nodes[0].getParentId();
        var parentNode = parentId ? $('#metaTree').treegrid('find', parentId) : undefined;
        //console.log("nodeLoaded", node, parentId, $('#metaTree').treegrid('find', parentId));
        $('#metaTree')
            .treegrid('toggle', parentId)
            .treegrid('append', {
                parent: parentId,
                data: nodes
            });

        if (parentNode) {
            $('#metaTree').treegrid('toggle', parentNode.getId()); // treegrid('toggle', parentNode.getId()).
            this.triggerNodeLoaded(parentNode, nodes);
        } else {
            this.triggerNodeLoaded(null, nodes);
        }
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
        var repository = getRepositoryFor(node);
        if (node instanceof BandNode) {
            type = 'группу';
        } else if (node instanceof AlbumNode) {
            type = 'альбом';
        } else if (node instanceof TrackNode) {
            type = 'композицию';
        }

        if (confirm('Вы уверены что хотите удалить ' + type + ' "' + node.getName() + '"?')) {
            repository.remove(node);
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
            this.getTreeGrid().refresh(nodes[i].getId());
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
            $.messager.show({msg: '<div class=\"messager-icon messager-info\"></div>Изменения ' + type + ' ' + node.getName() + ' были успешно сохранены.', title: 'Успех', timeout: 0});
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
                $.messager.show({msg: '<div class=\"messager-icon messager-info\"></div>Успешно обновлен.', title: 'Успех', timeout: 0});
            });
        });
    }
    this.playMenuNode = function () {
        console.log('begin playing...');
        var nodes = this.getTreeGrid().getSelections();
        if (!nodes || nodes.length == 0) {
            console.log('there is no selection, use menuNode.');
            nodes = [this.menuNode];
        }
        this.playNodes(nodes);
    }

    /**
     * Begin playing the specified nodes through playlist.
     * @param nodes
     */
    this.playNodes = function (nodes) {
        var that = this;
        var loader = new NodeLoader(nodes, this);
        loader.load(function () {
            console.log('all nodes loaded, build pl');
            var playlist = that.buildPlaylist(nodes);
            console.log('list built with songs', playlist);
            mainPlaylist.reload(playlist);
            console.log('begin play');
            mainPlaylist.play();
            $('#bodyAccordion').accordion('select', 'Плейлист');
        });
    }   
     
    /**
     * Gets all tracks from the specified node.
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

Tree.instance = mainTree;
Tree.getInstance = function () { return Tree.instance; }
console.log("Tree instance successfully created.", Tree.getInstance());

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
