/**
 * Created by y_mil on 2/29/2016.
 */
'use strict';

($(document).ready(function () {

    var numOfItems = 9;
    var isMouseDown = false;
    var isDragging = false;
    var isMobile = false;

    var draggedSrc = null;
    var draggedItem = null;
    var itemsIdArr = [];
    var itemsContainer = $("#itemsContainer");
    var containerOffsetX = itemsContainer.offset().left;
    var containerOffsetY = itemsContainer.offset().top;
    var containerWidth = itemsContainer.innerWidth();
    var containerHeight = itemsContainer.innerHeight();

    init();

    function init(){
        isMobile = detectMobile();

        $("#shuffleBtn").click(shuffle);
        $("#submitBtn").click(submitGame);

        buildGameItems();
        shuffle();
    }

    function buildGameItems(){

        for (var index=0; index<numOfItems; index++){

            var itemsContainer = $("#itemsContainer");
            itemsContainer.append("<div id=" +index +"></div>");
            itemsContainer.bind("mouseleave", onMouseLeave);
            itemsIdArr.push(index);

            var imageUrl = "./images/" + (index + 1 ) + "-6ZzM1GGwaR.jpg";
            var item = $("#itemsContainer #" + (index));

            $(item).addClass("item");
            $(item).css('background-image','url('+imageUrl+')');
            $(item).bind(isMobile ?'touchstart' : 'mousedown', onMouseDown);
        }

        containerWidth = itemsContainer.innerWidth();
        containerHeight = itemsContainer.innerHeight();
    }

    function onMouseLeave(e){
        if (isDragging){
            dropItem();
        }
    }

    function onMouseDown(e) {
        e.preventDefault();
        if (!e.currentTarget.id) return;

        isDragging = true;

        draggedSrc = $('#' + e.currentTarget.id);
        startDrag(draggedSrc,e);
    }

    function startDrag(draggedSrc,e){
        var posX = isMobile ? e.originalEvent.touches[0].pageX : e.pageX;
        var posY = isMobile ? e.originalEvent.touches[0].pageY : e.pageY;

        draggedItem = draggedSrc.clone().appendTo('#itemsContainer');
        draggedSrc.css("visibility", "hidden");
        draggedItem.addClass("item").addClass("drag");

        if (isMobile) {
            itemsContainer.bind('touchmove', onMouseMove);
            itemsContainer.bind('touchend', onMouseUp);
        }
        else {
            draggedItem.bind('mousemove', onMouseMove);
            draggedItem.bind('mouseup', onMouseUp);
        }

        var dragW = draggedItem.outerWidth();
        var dragH = draggedItem.outerHeight();

        $(draggedItem).css("left", posX - containerOffsetX - (dragW/2));
        $(draggedItem).css("top", posY - containerOffsetY - (dragH/2));
    }

    function onMouseUp(e){
        //isMouseDown = false;

        if (isDragging){

            if (isMobile) {
                itemsContainer.unbind('touchmove', onMouseMove);
                itemsContainer.unbind('touchend', onMouseUp);
            }
            else {
                draggedItem.unbind('mousemove', onMouseMove);
                draggedItem.unbind('mouseup', onMouseUp);
            }

            var list = getElementsByEvent(e);

            if (list.length > 0) {
                dropItem(list[0]);
            }
            else {
                dropItem();
            }
        }
    }

    function onMouseMove(e){
        if (isDragging){
            var dragW = $(draggedItem).outerWidth();
            var dragH = $(draggedItem).outerHeight();
            var posX = isMobile ? e.originalEvent.touches[0].pageX : e.pageX;
            var posY = isMobile ? e.originalEvent.touches[0].pageY : e.pageY;
            var cursorOffsetX =  posX - containerOffsetX;
            var cursorOffsetY =  posY - containerOffsetY;

            $(draggedItem).css("left", cursorOffsetX - (dragW/2));
            $(draggedItem).css("top", cursorOffsetY - (dragH/2));

            if (cursorOffsetX + (dragW/2) >= containerWidth){
                $(draggedItem).css("left", containerWidth - dragW);
            }
            else if (cursorOffsetX - (dragW/2) <= 0){
                $(draggedItem).css("left", 0);
            }

            if (cursorOffsetY + (dragH/2) > containerHeight){
                $(draggedItem).css("top", containerHeight - dragH);
            }
            else if (cursorOffsetY - (dragH/2) <= 0) {
                $(draggedItem).css("top", 0);
            }
        }
    }

    function dropItem(dropObject) {
        isDragging = false;

        if (dropObject){
            console.log(itemsIdArr);

            var dropTargetID = dropObject.item[0].id;
            var sourceID = draggedSrc[0].id;

            var dropIndex = itemsIdArr.indexOf(Number(dropTargetID));
            var sourceIndex = itemsIdArr.indexOf(Number(sourceID));

            var tempID = itemsIdArr[dropIndex];
            itemsIdArr[dropIndex] = itemsIdArr[sourceIndex];
            itemsIdArr[sourceIndex] = tempID;

            console.log(itemsIdArr);
        }
        else {
            //draggedSrc.css("visibility", "visible");
        }
        //
        //if (dropObject){
        //    var dropTarget = dropObject.item;
        //    var dropDirection = dropObject.dir;
        //    var item = draggedSrc.detach();
        //
        //    item.css("visibility", "visible");
        //    if (dropDirection == "left") {
        //        item.insertBefore(dropTarget);
        //    }
        //    else {
        //        item.insertAfter(dropTarget);
        //    }
        //}
        //else {
        //    draggedSrc.css("visibility", "visible");
        //}

        draggedSrc.css("visibility", "visible");

        $(draggedItem).remove();
        draggedItem = null;
        draggedSrc = null;

        reorderItems();
    }

    function getElementsByEvent(e){
        var clickX = isMobile ? e.originalEvent.changedTouches[e.originalEvent.changedTouches.length-1].pageX : e.pageX;
        var clickY = isMobile ? e.originalEvent.changedTouches[e.originalEvent.changedTouches.length-1].pageY : e.pageY;

        var itemMatches = [];
        var dir;

        var list = $('#itemsContainer *').filter(function() {
            var offset = $(this).offset();
            var range = {
                x: [
                    offset.left,
                    offset.left + $(this).width()
                ],
                y: [
                    offset.top,
                    offset.top + $(this).outerHeight()
                ]
            };

            if ((clickX >= range.x[0] && clickX <= range.x[1]) && (clickY >= range.y[0] && clickY <= range.y[1])){


                if ($(this).attr("id") == draggedItem.attr("id")){
                    return false;
                }

                if (clickX > range.x[0] + $(this).width()/2){
                    dir = "right";
                }
                else{
                    dir = "left";
                }
                //console.log( clickX > range.x[0] + $(this).width()/2 );
                //console.log( "x: " +  clickX , range.x[0] , $(this).width()/2 );
                //console.log("y: " + clickY , range.y[0] , range.y[1]);

                itemMatches.push({item:$(this), dir:dir});
                return true;
            }
        });

        return itemMatches;
    }

    function reorderItems(){
        for (var index=0; index<numOfItems; index++){
            var item = $("#"+itemsIdArr[index]).detach();
            $("#itemsContainer").append(item);
        }
    }

    function shuffle(){
        itemsIdArr = shuffleArray(itemsIdArr);
        reorderItems();

    }

    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    function submitGame(){
        var resault = true;
        $("#itemsContainer").children().each(function(index){
            //console.log("index: " + index, "this: " + this.id, index == this.id);
            if (index != this.id){
                resault = false;
            }
        });

        if (resault) {
            console.log("you won!");
        }
        else {
            console.log("you failed");
        }

        shuffle();
    }

    function detectMobile() {
        // return /Mobi/.test(navigator.userAgent);

        var mobileChecker = $('.isMobile');
        return mobileChecker.css('display') == 'block';
        //console.log("mobileChecker.css('display'): ", mobileChecker.css('display'));
    }

}));