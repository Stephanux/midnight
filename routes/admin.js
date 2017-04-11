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
                childRoutes:{}
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
        let parentid = req.params.parentid;//id de la route parentid
        //voir a le sauvegarder qqpart dans l'objet?

        let parent_endpoint = app.__routes_dict[parentid];
        let endpoint = app.__routes_dict[id];
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















   

    router.get("/addendpoint/:parentid", function(req,res,next){
        //renvoie le hbs de description/mise a jour du sitemap
        res.render('add_endpoint',{
            parentid:req.params.parentid
            
        });
    });
    router.get("/delete/:parentid/:id",removeEndpoint, function(req,res,next){
        //renvoie le hbs de description/mise a jour du sitemap
        res.redirect("../../sitemap");
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