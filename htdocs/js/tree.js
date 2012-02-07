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
    this.loadSuccessEvent =  "loadSuccess";//$.Event("loadSuccess");
    this.expandedEvent = "expanded";
    this.menuNode = null;
    this.editedNode = null;
    this.treegrid = null;
    
    this.init = function () {
        var that = this;
        easyloader.load('linkbutton');
        easyloader.load('treegrid', function(){
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
                }
            });
            that.getTreeGrid().setOptions({
                onBeforeLoad: function (row, node) {
                    that.getTreeGrid().loading();
                    if (row) {
                        row.loadChildren(function () {
                            that.getTreeGrid().loaded();
                        });
                    } else {
                        bandRepository.list(function () {
                            that.getTreeGrid().loaded();
                        });
                    }
                    return false;
                }
            });
        });

        // subscriptions
        mainPlayer.onStartPlaying(function () {
            that.startPlay();
        });
        var repositories = [bandRepository, albumRepository, trackRepository];

        $(repositories).each(function (index, repository) {
            repository.onLoaded(function (e, data) {
                that.nodeLoaded(data);
            })
            repository.onRemoved(function (e, data) {
                that.nodeRemoved(data);
            });
            repository.onUpdated(function (e, data) {
                that.nodeUpdated(data);
            })
        });
    }

    this.editedColumnFormatter = function (value, rowData, rowIndex) {
        // if edited is not set
        if (!value) {
            return '';
        }

        return $('<div>').append($('<a href="#" id="editColumnSave" onclick="Tree.getInstance().getTreeGrid().endEdit(' + "'" + rowData.getId() + "'" + '); event.stopPropagation();" iconCls="icon-save" plain="true" title="Применить изменения"></a>').linkbutton()).html() +
            $('<div>').append($('<a href="#" id="editColumnCancel" onclick="Tree.getInstance().getTreeGrid().cancelEdit(' + "'" + rowData.getId() + "'" + '); event.stopPropagation();" iconCls="icon-cancel" plain="true" title="Отменить изменения"></a>').linkbutton()).html();
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
    
    this.startPlay = function () {
        if (this.isSelected()) {
            play();
        }
    }

    this.nodeLoaded = function (nodes) {
        if (!nodes.length || nodes.length < 1) {
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
            $(this).trigger(this.loadSuccessEvent, [parentNode, nodes]);
        } else {
            $(this).trigger(this.loadSuccessEvent, [null, nodes]);
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
        var repository = getRepositoryFor(this.menuNode);
        repository.get(this.menuNode.getServerId(), function () {
            $.messager.show({msg: '<div class=\"messager-icon messager-info\"></div>Успешно обновлен.', title: 'Успех', timeout: 0});
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
}

mainTree = new Tree();

Tree.instance = mainTree;
Tree.getInstance = function () { return Tree.instance; }
console.log("Tree instance successfully created.", Tree.getInstance());


function recursePlaylist(node, selected, playlist, traverseToken) {
    if (node.traverseToken === traverseToken)
        return null;
    node.traverseToken = traverseToken;
    var noSelected = true;
    if (node.children && $.isArray(node.children) && node.children.length > 0) {
        for (var childIndex in node.children) {
            var child = node.children[childIndex];
            var childNoSelected = recursePlaylist(child, selected, playlist, traverseToken); 
            if (childNoSelected === null) {
                continue;
            }
            if (!childNoSelected && child.isLeaf()) {
                playlist.push(child);
            }
            noSelected &= childNoSelected;
        }
        
        // adds all child nodes if no one node selected and if it TrackNode
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

function fillPlaylist(playlist) {
    var selected = $('#metaTree').treegrid('getSelections');
    var traverseToken = new Date().getTime();
    for (var index in selected) {
        var node = selected[index];
        //$('#metaTree').treegrid('expandAll', node.getId());
        if (node.isLeaf()) {
            node.traverseToken = traverseToken;
            playlist.push(node);
            continue;
        }
        recursePlaylist(node, selected, playlist, traverseToken);
    }
}

var loadingCounter = 0;

function recurseLoad(node, onLoadedCallback) {
    if (node.isLeaf())
        return;
    
    if (node.children && $.isArray(node.children)) {
        $(node.children).each(function (i, child) {
            loadingCounter ++;
            recurseLoad(child, onLoadedCallback);
            loadingCounter --;
        });
        if (loadingCounter === 0) {
            onLoadedCallback();
        }
    } else {
        $(mainTree).bind(mainTree.loadSuccessEvent + ".recurseExpand" + node.getId(), function (event, parent, loadedNodes) {
            // i want catch only event's of top context node
            if (parent !== node) {
                return;
            }
            loadingCounter --;
            
            //console.log("collapse ", node.getId());
            $('#metaTree').treegrid('collapse', node.getId());

            $(loadedNodes).each(function (i, child) {
                recurseLoad(child, onLoadedCallback);
            });
            $(mainTree).unbind(mainTree.loadSuccessEvent + ".recurseExpand" + node.getId());

            if (loadingCounter === 0) {
                onLoadedCallback();
            }
        });
        //console.log("expand ", node.getId());
        loadingCounter ++;
        $('#metaTree').treegrid('expand', node.getId());
    }
    
    
}

function loadSelected(onLoadedCallback) {
    loadingCounter = 0;
    var selected = $('#metaTree').treegrid('getSelections');
    $(selected).each(function(i, node) {
        recurseLoad(node, onLoadedCallback);
    });
}

function play() {
    // enshure that all child nodes loaded
    loadSelected(function() {
        mainPlaylist.clean();
        fillPlaylist(mainPlaylist);
        mainPlaylist.play();
        $('#bodyAccordion').accordion('select', 'Плейлист');
    });
}