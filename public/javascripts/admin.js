var ADMIN = (function(){

    function onStartDrag(evt, id){
        skip(evt);
        console.log("do some datatransfert")
    }
    function skip(evt){evt.preventDefault();}
    function onDrop(evt){
        skip(evt);
        console.log("get datas")
    }

    return {
        doDrag: onStartDrag,
        skip:skip,
        doDrop: onDrop
    };
})();