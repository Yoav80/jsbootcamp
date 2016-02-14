var lastNode = null;
var firstNode = null;

//-----------------------------------------
var ori = {id: 1, name: "Ori"};
var roni = {id:2, name: "Roni"};
var udi = {id:3, name: "Udi"};
var beni = {id:4, name: "Beni"};

var pos = listInsertLast(ori);
listInsertLast(roni);
listInsertLast(udi);
listInsertBefore(pos, beni);

pos = listGetFirst();
while (pos) {
    var data = listGetData(pos);
    console.log(data.id + ": " + data.name);

    pos = listGetNext(pos);
}
//------------------------------------------


function listInsertLast(data){
    var listItem = {data:data,next:null,prev:null};
    if (lastNode){
        lastNode.next = listItem;
        listItem.prev = lastNode;
        lastNode = listItem;
    }else{
        lastNode = listItem;
        firstNode = listItem;
    }
    return listItem;
}

function listInsertBefore(pos,data){
    var listItem = {data:data,next:null,prev:null};
    if (pos !== firstNode) {
        listItem.prev = pos.prev;
        listItem.next = pos;
        pos.prev.next = listItem;
        pos.prev = listItem;
    }
    else{
        listItem.next = pos;
        pos.prev = listItem;

        firstNode = listItem;
    }
    return listItem;
}

function listGetFirst(){
    return firstNode;
}

function listGetNext(pos){
    if (pos.next){
        return pos.next;
    }else{
        return null;
    }
}

function listGetData(pos){
    if (pos){
        return pos.data;
    }else{
        return null;
    }
}