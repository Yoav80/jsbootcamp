/**
 * Created by y_mil on 2/21/2016.
 */

function createTree(compareFunc){
    var tree = {
        root: null,
        compare: compareFunc,
        count: 0
    };
    return tree;
}

function createNode(data){
    var node = {
        data:data,
        left:null,
        right:null
    };
    return node;
}

function add(tree,data) {
    if (!tree.root) {
        tree.root = createNode(data);
        tree.count++;
    }
    else {
        var nodeToInsert = createNode(data);
        addNode(tree,tree.root,nodeToInsert);
    }

}

function addNode(tree,itemToCompare,nodeToInsert){

    var result = tree.compare(nodeToInsert.data,itemToCompare.data);
    if (result == 0){
        if (itemToCompare.left){
            addNode(tree,itemToCompare.left,nodeToInsert);
        }
        else{
            tree.count++;
            itemToCompare.left = nodeToInsert;
        }
    }
    else if (result == 1) {
        if (itemToCompare.right){
            addNode(tree,itemToCompare.right,nodeToInsert);
        }
        else {
            tree.count++;
            itemToCompare.right = nodeToInsert;
        }
    }
    else{
        // data exists
        console.log("cannot insert duplicate values");
    }

}

function remove(tree,data) {
    if (tree == null) {
        return;
    }

    removeNode(tree,data,tree.compare)
}

function removeNode(tree,data,compare){
    var removeObject = findNodeToRemove(tree.root,data,compare,null);

    if (removeObject != null && removeObject != undefined){

        var nodeToRemove = removeObject.nodeToRemove;
        var parent = removeObject.parentNode;

        if(nodeToRemove == tree.root){
            var lastRight;
            if (tree.root.left == null){
                lastRight = tree.root.right;
                tree.root = lastRight;
            }
            else {
                lastRight = tree.root.right;
                tree.root = tree.root.left;
                insertLast(tree.root, lastRight, "right");
            }
        }
        else if(nodeToRemove == parent.right){
            parent.right = nodeToRemove.right;
            if (nodeToRemove.left != null) {
                insertLast(parent, nodeToRemove.left, "left");
            }
        }
        else if (nodeToRemove == parent.left){
            parent.left = nodeToRemove.right;
            if (nodeToRemove.left != null) {
                insertLast(parent, nodeToRemove.left, "left");
            }
        }

        tree.count--;
    }
    else {
        console.log("no matches");
    }
}

function findNodeToRemove(node,data,compare,parent){
    if (node == null){
        return null;
    }

    var res = compare(data,node.data);

    if (res == 'undefined'){
        return;
    }
    if (res == -1){
        return {nodeToRemove:node,parentNode:parent};
    }
    else if (res == 0){
        return findNodeToRemove(node.left,data,compare,node);
    }
    else {
        return findNodeToRemove(node.right,data,compare,node);
    }
}

function insertLast(node,nodeToInsert,side){
    if (node[side] == null){
        node[side] = nodeToInsert;
    }
    else {
        insertLast(node[side],nodeToInsert,side);
    }
}

function contains(tree,data){
    return scanNodeForData(tree.root,data,tree.compare);
}

function scanNodeForData(node,data,compareFunc){
    if (node == null){
        return false;
    }

    var res = compareFunc(data,node.data);

    if (res == -1){
        return true;
    }
    else if (res == 1){
        return scanNodeForData(node.right,data,compareFunc);
    }
    else if (res == 0) {
        return scanNodeForData(node.left,data,compareFunc);
    }
    return false;
}

function scan(tree,printFunc){
    scanNode(tree.root,printFunc);
}

function scanNode(node,printFunc){
    if (node == null){
        return;
    }

    scanNode(node.left,printFunc);
    printFunc(node);
    scanNode(node.right,printFunc);
}

function getCount(tree){
    return tree.count;
}

var exports = module.exports = {
    createTree:createTree,
    add:add,
    remove:remove,
    scan:scan,
    getCount:getCount,
    contains:contains
};
