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


var express = require('express');
var router = express.Router();



//note: les routes sont genereés via une fonction
//j'ai juste besoin des données de l'application a ce moment la
module.exports = function(app){



    //qqs middlewares
    /**
     * Ajoute une nouvelle route au runtime
     */
    function add_endpoint(req,res,next){
        let parentid = req.body.parentid;
        let url = req.body.endpoint;

       //recupere le endpoint correspondant
       
        let endpoint = app.__routes_dict[parentid];
        
        if(endpoint){
            //ajoute au router et vois ce que ca fait...
            let map = {
                "GET":{
                    view:"hello",
                    type:'json'
                },
                childRoutes:{},
                __parent__ : endpoint
            };
            console.log("ENDPOINT:",endpoint)
            let router = app.__generate_child_routes(map,null);
            endpoint.__router__.use("/"+url,router);

            if(!endpoint.childRoutes) endpoint.childRoutes = {};
            endpoint.childRoutes[url] = map;
        }

        next();

    }
    /**
     * Supprime une route au runtime
     */
    function removeEndpoint(req,res,next){
        let id = req.params.id;//id de la route a supprimer....
        //let parentid = req.params.parentid;//id de la route parentid
        //voir a le sauvegarder qqpart dans l'objet?

        //TEST: utilise le __parent__
        let endpoint = app.__routes_dict[id];
        let parent_endpoint = endpoint['__parent__'];

        /*
        let parent_endpoint = app.__routes_dict[parentid];
        let endpoint = app.__routes_dict[id];
        */
        if(parent_endpoint && endpoint){
            let stack = parent_endpoint.__router__.stack;
            
            let total = stack.length;
            
            for(let i=0;i<total;i++){
                let rt = stack[i];
                
                if(rt.handle == endpoint.__router__){
                    console.log("found route!!!!");
                    //supprime le router
                    stack.splice(i,1);
                    //supprime du sitemap pour affichage
                    
                    for(let key in parent_endpoint.childRoutes){
                        
                        if(parent_endpoint.childRoutes[key] == endpoint){
                            delete(parent_endpoint.childRoutes[key]);
                            break;
                        }
                    }
                    break;
                }
            }
            
        }
        

        next();
        
    }

    /**
     * deplace un endpoint
     */
    function moveEndpoint(req,res,next){
        let who = req.query.who;
        let where = req.query.where;

        if(who && where){
            
            
            //fait le deplacement

            //recupere depuis le sitemap
            let who_endpoint = app.__routes_dict[who];
            let parent_endpoint = who_endpoint.__parent__;
            let where_endpoint = app.__routes_dict[where];


            let url = null;



            if( parent_endpoint && who_endpoint && where_endpoint){
                console.log("deplacement OK");
                //VERIF QUE WHO N'EST PAS PARENT DE where
                console.log("verif que where n'est pas fils de who");
                let prt = where_endpoint;
                
                let is_parent = false;
                while (prt!=null){
                    if(prt == who_endpoint){
                        is_parent = true;
                        break;
                    }
                    prt = prt.__parent__;
                }
                if(is_parent) {
                    //arrete tout
                    req.admin_msg = "Impossible d'ajouter ici";
                    console.log("Impossible d'ajouter ici");
                    next();
                    return;
                }





                //dans l'ordre, supprime de parent 
                
                    let stack = parent_endpoint.__router__.stack;
                    
                    let total = stack.length;
                    
                    for(let i=0;i<total;i++){
                        let rt = stack[i];
                        
                        if(rt.handle == who_endpoint.__router__){
                            console.log("found route!!!!");
                            //supprime le router
                            stack.splice(i,1);
                            //supprime du sitemap pour affichage
                            
                            for(let key in parent_endpoint.childRoutes){
                                
                                if(parent_endpoint.childRoutes[key] == who_endpoint){
                                    delete(parent_endpoint.childRoutes[key]);
                                    url = key;
                                    break;
                                }
                            }
                            break;
                        }
                    }
                //ajoute a where_endpoint
                //besoin: de route: string la clé de la route

                    let map = who_endpoint;

                    
                    //et si pas de router????
                    
                    where_endpoint.__router__.use("/"+url,map.__router__);
                    //enregistre le papa
                    map.__parent__ = where_endpoint;
                    //enregistre dans les childs routes
                    if(!where_endpoint.childRoutes) where_endpoint.childRoutes={};
                    where_endpoint.childRoutes[url] = map;
                    
                        
                    } else {
                        console.log("qqchose va pas",parent_endpoint,who_endpoint,where_endpoint);
                    }
        }
        next();
    }













   

    router.get("/addendpoint/:parentid", function(req,res,next){
        //renvoie le hbs de description/mise a jour du sitemap
        res.render('add_endpoint',{
            parentid:req.params.parentid
            
        });
    });
    router.get("/delete/:id",removeEndpoint, function(req,res,next){
        //renvoie le hbs de description/mise a jour du sitemap
        res.redirect("../sitemap");
    });
    router.get("/move",moveEndpoint,function(req,res,next){
        //renvoie le hbs de description/mise a jour du sitemap
        res.redirect("./sitemap");
    });

    router.get("/sitemap", function(req,res,next){
        //renvoie le hbs de description/mise a jour du sitemap
        res.render('sitemap',{
            test:"Bonjour",
            map: app.sitemap
            
        });
    });
    router.post("/sitemap",add_endpoint, function(req,res,next){
        //renvoie le hbs de description/mise a jour du sitemap
        res.render('sitemap',{
            test:"Bonjour",
            map: app.sitemap
            
        });
    });
    

    
     /* GET home page ADMIN.
    permet de tester les differents modules
    */
    router.get('/', function(req, res, next) {
    res.end("Hello");
    
    });

    return router;
};