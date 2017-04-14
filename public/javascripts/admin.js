(function(){

    function onStartDrag(e){
        e.dataTransfer.effectAllowed = 'move';
        //transfert les données...
        e.dataTransfer.setData("text/plain", this.getAttribute("data-uid"));
        //met un style pour bloquer le ripple
        this.classList.add("stop-drag");
        //change le style de l'arbre
        let root = document.getElementById("tree-root");
        if(!root.classList.contains("drag-reactive"))root.classList.add("drag-reactive");
    }
    function onEndDrag(e){
        let root = document.getElementById("tree-root");
        if(root.classList.contains("drag-reactive"))root.classList.remove("drag-reactive");
        if(this.classList.contains("stop-drag"))this.classList.remove("stop-drag");
    }
    function skip(evt){evt.preventDefault();}
    function onDrop(evt){
        skip(evt);
        //recup l'UUID de l'element a deplacer
        let dt = evt.dataTransfer.getData("text/plain");
        //recup l'UUID du nouveau parent
        let parent = this.getAttribute("data-uid");
        //redirige vers la page de modification

        window.location="./move?who="+dt+"&where="+parent;
    }

    window.addEventListener("load",()=>{
        document.querySelectorAll("[draggable]").forEach( el=>{
            el.addEventListener("dragstart",onStartDrag,false);
            el.addEventListener("dragend",onEndDrag,false);
        });
        document.querySelectorAll("[data-drop]").forEach( el=>{
            
            el.addEventListener("dragenter",skip,false);
            el.addEventListener("dragover",skip,false);
            el.addEventListener("dragleave",skip,false);
            el.addEventListener("drop",onDrop,false);
        })
    })
})();


/**
 * Start Application
 * Vue.js pour les bindings -simple 
 */
(function(Vue){



    var app = new Vue({
        el:"#app",
        data:{

        },
        methods:{
            
        }
    });
})(Vue);