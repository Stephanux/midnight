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
    //ajoute un nouveau middleware au parent
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
















    /* GET home page ADMIN.
    permet de tester les differents modules
    */
    router.get('/', function(req, res, next) {
    res.end("Hello");
    
    });


    router.get("/addendpoint/:parentid", function(req,res,next){
        //renvoie le hbs de description/mise a jour du sitemap
        res.render('add_endpoint',{
            parentid:req.params.parentid
            
        });
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

    

    return router;
};