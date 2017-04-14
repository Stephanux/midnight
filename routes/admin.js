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

var express = require('express');
var router = express.Router();



//note: les routes sont genereés via une fonction
//j'ai juste besoin des données de l'application a ce moment la
module.exports = function(app){



    //qqs middlewares  TEST ONLY
    
   
    //TEMP ONLY LE TEMPS QUE L'APP SOIT EN PLACE ----------------------------------
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








    /**
     * Recupere la description de la sitemap
     */
    router.get("/sitemap", function(req,res,next){
        //renvoie le hbs de description/mise a jour du sitemap
        res.render('sitemap',{
            test:"Bonjour",
            map: app.sitemap
            
        });
    });

    /**
     * Ajoute une nouvelle route au runtime
     */
    function add_endpoint(req,res,next){
        let parentid = req.body.parentid;
        let url = req.body.endpoint;
        //cree un nouvel objet pour empaqueter la route a partir des infos 
        //données dans le formulaire
       let map = {
            "GET":{
                view:"hello",
                type:'json'
            },
            
        };
        let ret = app.__add_child_route(parentid,url,map);
        if(ret){
            req.infos = ret;
        } else {
            req.infos = "OK";
        }
        next();

    }
    router.post("/sitemap",add_endpoint, function(req,res,next){
        //renvoie le hbs de description/mise a jour du sitemap
        res.render('sitemap',{
            test:"Bonjour",
            map: app.sitemap
            
        });
    });
    
    /**
     * Supprime une route au runtime
     */
    function removeEndpoint(req,res,next){
        let id = req.params.id;//id de la route a supprimer....
        try{
            app.__remove_child_route(id);
            req.infos = "OK";
        } catch(err){
            req.infos = err;
        }
       
        next();
        
    }
    router.delete("/sitemap/:id",add_endpoint, function(req,res,next){
        //renvoie le hbs de description/mise a jour du sitemap
        res.render('sitemap',{
            test:"Bonjour",
            map: app.sitemap
            
        });
    });
    

    /**
     * deplace un endpoint
     */
    function moveEndpoint(req,res,next){
        let who = req.query.who;
        let where = req.query.where;
        try{
            app.__move_child_route (who, where);
        } catch(err){
            req.infos = err;
            console.log(err);
        }
        next();
    }
    router.put("/sitemap",moveEndpoint, function(req,res,next){
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