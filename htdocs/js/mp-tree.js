/**
 * Основное дерево с песнями
 * @class MetaTree
 */
var metaTree;

function MetaTree(treeElement) {
    metaTree = this;
    this._childPrefix = 'mp-child-of-';
    this._tree = $(treeElement).treeTable({
            onNodeShow: function() {
                metaTree.loadBranch(this);
            },
            childPrefix: this._childPrefix
    });
    
    this._id = $(treeElement).attr('id');
    
    this.loadBranch = function (nodeElement) {
        var node = this.fromElement(nodeElement);
        var nodes = [new Node(10, node.getId())];
        this.attachBranch(nodes, nodeElement);
    }
    
    this.attachBranch = function (nodes, destination) {
        $(this._tree).append('<tr id="mp-meta-tree-3" class="mp-child-of-mp-meta-tree-2">' + 
            '<td>Node 1.1.1: I am part of the tree too!</td>' +
            '<td>That\'s it!</td>' + 
            '</tr>').treeTable();
    }
    
    this.fromElement = function(nodeElement) {
        var nodeId = $(nodeElement).attr('id').substr(this._id.length);
        var parentId = null;
        if ($(nodeElement).attr('class') && $(nodeElement).attr('class').indexOf(this._childPrefix) != -1) {
            parentId = $(nodeElement)
                .attr('class')
                .substr($(nodeElement).attr('class').indexOf(this._childPrefix));
            if (parentId.indexOf(' ') != -1) {
                // attr may contains more classes the one, so it shuld cut the tail
                parentId = parentId.substr(0, parentId.indexOf(' '));
            }
        }
        
        return new Node(nodeId, parentId);
    }
}

function Node (id, parentId) {
    this._id = id;
    this._parentId = parentId;
    
    this.getId = function () {
        return this._id;
    }
    
    this.getParentId = function() {
        return this._parentId;
    }
}


