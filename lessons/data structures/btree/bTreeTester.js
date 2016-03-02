/**
 * Created by y_mil on 2/21/2016.
 */

var bTree = require("./bTree");

function myCompare(d1,d2){
    if (d1 > d2){
        return 1; // right
    }
    else if (d1 < d2){
        return 0; //left
    }
    else if (d1 == d2){
        return -1;
    }
}

function myPrint(node){
    console.log("data: " + node.data);
}

var myTree = bTree.createTree(myCompare);
bTree.add(myTree,1);
bTree.add(myTree,3);
bTree.add(myTree,4);
bTree.add(myTree,7);
bTree.add(myTree,6);
bTree.add(myTree,9);
bTree.add(myTree,5);
bTree.add(myTree,12);
bTree.add(myTree,13);
bTree.scan(myTree,myPrint);

bTree.remove(myTree,1);
console.log(bTree.contains(myTree,1));
console.log("-------------------");


bTree.add(myTree,2);
bTree.scan(myTree,myPrint);
