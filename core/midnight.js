/*
 * ---------------------------------------------------------------------------------
 * "THE BEER-WARE LICENSE" (Revision 42):
 * <steph.ponteins@gmail.com>   wrote  this file.  As long as you retain this notice
 * you can do whatever you want with this stuff. If we meet  some day, and you think
 * this stuff is worth it, you can buy me a beer in return.                 st3ffane
 * ---------------------------------------------------------------------------------
 *
 * MIDNIGHT -express
 * OTF2 fork



 * definition de qqs methodes persos pour l'application
 */
"use strict";


//Genere un UUID unique pour chaque objet qui doit etre lier
//@return string: l'UUID généré
//@public
function generateUUID() {
    let __uuid_date = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,(c)=>{
        let d = __uuid_date;
        let r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
};



var fs = require('fs');
var express = require("express");
//les methodes HTTP supportées -pour l'instant
const HTTP_METHODS = require('http').METHODS;

//DEBUG ONLY
var dummy = require("./middlewares/dummy");
// var dummy2 = require("../middlewares/dummy2");



//qqs constantes pour le fichier 
const LOG_HEAD = "MIDNIGHT.js: ";

//recuperation du fichier de configuration du serveur

/**
 *   lecture d'un fichier (generalement, de configuration)
    en cas d'echec, met fin au programme.
 */
var fsReadConfFileSyncOrDie = function (file){
    try{
        return JSON.parse(fs.readFileSync(__dirname + "/../conf/" + file , 'utf8'));
    } catch(err){
        console.log(LOG_HEAD + "Load Configuration File ERROR mess [%s] ", err.message);
        throw err;//debug ONLY!!!
    }
}
//DEV ET DEBUG ONLY -------------------------------
var CONSOLE_LOG = function(...msg){
    if(midnight_app.server_conf.ENV.debug){
        console.log(LOG_HEAD,...msg);
    }
}
//l'application OTF elle meme
//SINGLETON POUR L'APPLICATION (pas besoin de taper le prototype....)
var midnight_app = {};
//defini qqs properties necessaires a midnight pour tourner
//MAIS! on les rends non-iterable (cachée?) et non modifiables (fichier configuration)
//au cas ou probleme serveur ????
Object.defineProperties(midnight_app,{
    //la configuration du serveur : /conf/config.json
    __server_conf:{
        value: fsReadConfFileSyncOrDie ("config.json"),
        enumerable: false,
        writable: false,
    },
    server_conf:{
        get: function(){ return this.__server_conf;},
        set: function(v){} //nope
    },
    //la description du site (architecture) /conf/sitemap.json
    __sitemap:{
        value: fsReadConfFileSyncOrDie ("sitemap.json"),
        enumerable: false,
        writable: false,
    },
    sitemap:{
        get: function(){ return this.__sitemap;},
        set: function(v){} //nope
    },
    //un dictionnaire de router
    __routes_dict:{
        value:{},
        enumerable:false,
        writable:false
    },
    routes_dict:{
        get function(){return this.__routes_dict;},
        set function(v){/*nope*/}
    }

});



/**
*   Genere les routers, middlewares, ... necessaire pour configurer le serveur
*   express
*/
midnight_app.midnight_generate_sitemap = function(){
    CONSOLE_LOG("Generate application routers");
    //le router "general"
    
    //pour chaque element du site map, cree les middlewares necessaires
    // et cree les routes avec les methodes...

    var sitemap = this.sitemap || {};
    this.use('/',this.__generate_child_routes(sitemap));
}


/**
 * Genere un router pour le niveau courant de la sitemap,
 * met en place les endpoints (GET, POST,...) et recupere
 * les middlewares a appliquer. 
 * 
 * 
 * 
 */
midnight_app.__generate_child_routes = function(sitemap){//, url_params){
    var router = express.Router({mergeParams: true});//au cas ou...
    //url_params = url_params || "";

    
    var child = sitemap.childRoutes || {};

    Object.keys(child).forEach ( (route)=>{
        //pour chq routes...
        //recupere, si existent, les parametres
        // ABANDON: pose probleme avec url uniquement composées de params
        // let url = route;
        // let params = "";
        // let dot = route.indexOf(':');
        // if(dot != -1) {
        //     params = route.substr(dot);
        //     url = route.substr(0,dot-1);
        // }
        // CONSOLE_LOG("generate child route for ",route);
        // CONSOLE_LOG("params child route ",params);

        sitemap.childRoutes[route]['__parent__'] = sitemap;//un lien vers le sitemap parent
        router.use("/"+route, this.__generate_child_routes(child[route]));//, params));
    });
    
    //recupere les methodes supportées par cette route 
    //NOTE: si aucune methode, ne DOIS PAS creer de route???
    for(var method of HTTP_METHODS){
        if(sitemap[method]){
            //a partir des parametres donnés, recupere les middlewares
            //a appliquer
            CONSOLE_LOG("generate METHOD for route: ",method,sitemap[method]);
            //ajoute les parametres de la route???
            router[method.toLowerCase()]("/",...this.__load_middlewares_for_route(sitemap[method]));//un test a la con, devra etre un tableau de middlewares...
        }
    }    

    //enregistre le router et un uuid dans le sitemap
    sitemap['__router__'] = router;
    let uuid = generateUUID();
    sitemap['__uuid__']= uuid;
    //il faudrait enregistrer un lien vers le parent...


    
    //enregistre dans le dictionnaire pour recup plus facile 
    this.__routes_dict[uuid] = sitemap;
    return router;
}

/**
 * recupere, a partir de la configuration de la route passé en parametres
 * les middlewares a appliquer a la route
 * 
 * dans l'ordre:
 *  - crypto: si la comunication est cryptée, et l'algo a utiliser (possibilité fournir le mw)
 *  - authentification
 *  - authorisation
 *  - sanitize params
 *  - before
 *  - action
 *  - after
 *  - render
 *  - crypto
 */
midnight_app.__load_middlewares_for_route = function( route){
    var mw = [];//les middlewares a appliquer
    //pour l'instant, on tente la sanitisation des parametres...
    //utilise 2 middlewares, 1 pour les params GET, un pour les POSTS???
    // if (route.params) mw.push(require("./middlewares/sanitize_params")(route.params, route.onerror)); 



    // //si une view definie, utilise le rendu (simple debug)
    // if (route.view) mw.push(require("./middlewares/html.render")(route.view));
    // //pour les tests
    mw.push(dummy);
    return mw;
}


/**
 * Ajoute une nouvelle route a l'application
 * @param to_id: identifiant de la route a laquelle se racroche la nouvelle
 * @param map: object, representation de la route a creer 
 */
midnight_app.__add_child_route = function(to_id, map){

}

midnight_app.__remove_child_route = function(route_id){

}

midnight_app.__move_child_route = function(who_id, where_id){
    
}




//chargement des fichiers et creations des ressources 
console.log(LOG_HEAD + "server configuration:",midnight_app.server_conf.WWW);
module.exports = midnight_app;