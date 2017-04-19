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

var path    = require("path");
var TYPES = require("../core/middlewares/types");
const HTTP_METHODS = require('http').METHODS;
//note: les routes sont genereés via une fonction
//j'ai juste besoin des données de l'application a ce moment la
module.exports = function(app){



    //qqs middlewares  TEST ONLY
    
   
    //TEMP ONLY LE TEMPS QUE L'APP SOIT EN PLACE ----------------------------------
    // router.get("/addendpoint/:parentid", function(req,res,next){
    //     //renvoie le hbs de description/mise a jour du sitemap
    //     res.render('add_endpoint',{
    //         parentid:req.params.parentid
            
    //     });
    // });

    // router.get("/delete/:id",removeEndpoint, function(req,res,next){
    //     //renvoie le hbs de description/mise a jour du sitemap
    //     //res.redirect("../sitemap");
    //     res.json("ok")
    // });

    // router.get("/move",moveEndpoint,function(req,res,next){
    //     //renvoie le hbs de description/mise a jour du sitemap
    //     res.redirect("./sitemap");
    // });








    /**
     * Recupere la description de la sitemap
     */
    router.get("/sitemap", function(req,res,next){
        //renvoie le hbs de description/mise a jour du sitemap
        // res.render('sitemap',{
        //     map: app.sitemap,
        //     //les types de retour possible 
        //     types: Object.keys(TYPES)
            
        // });
        // pour appli vue.js
        res.json({
            map: app.sitemap,
            types: Object.keys(TYPES)
        });
    });


const METHOD_WITH_FORMDATAS = ["POST","PUT"];//et le reste....
    /**
     * Ajoute une nouvelle route au runtime
     */
    router.post("/sitemap", function(req,res,next){

        
        let parentid = req.body.parentid;
        //les infos du nouveau endpoint
        let map = {};
        let url = req.body.url;
        //les parametres si existent
        if (req.body.params){
            //cree les parametres
            let params = {};
            for (let p of req.body.params){
                url+="/:"+p.name;
                //les contraintes, pour l'instant, j'ai rien...
            }
        }
        if(req.body.methods){
            //ajoute les methodes 
            for (let method of req.body.methods){
                if(method.url_params){
                    let url_p = {};
                    //et blababla...
                }
                if(method.form_datas && METHOD_WITH_FORMDATAS.indexOf(method.name)!=-1){
                    //parametres de formulaires
                }
                map[method.name]={
                    //les parametres et formdatas...
                    type : method.returnType || 'json'
                }
            }
        }
       
       
        try{
            let ret = app.__add_child_route(parentid,url,map);
            res.status=200;//content created
            res.json({map: app.sitemap});//renvoie le sitemap mis a jour
        }
        catch( err ){
            next(err);
        }
        
        
    });
    
    /**
     * Supprime une route au runtime
     */
    router.delete("/sitemap/:id", function(req,res,next){
        let id = req.params.id;//id de la route a supprimer....
        try{
            app.__remove_child_route(id);
            res.status = 200;//OK
            res.json({map: app.sitemap});//renvoie le sitemap mis a jour
        } catch(err){
            next(err);
        }
        
    });
    

    /**
     * deplace un endpoint
passer via body?
     */
    router.put("/sitemap", function(req,res,next){
        let who = req.body.who;
        let where = req.body.where;

        
        try{
            app.__move_child_route (who, where);
            res.status = 200;
            res.json({map: app.sitemap});
        } catch(err){
            next(err);
        }
        
    });



    /**
     * Informations necessaires pour creer un formulaire de nouveau endpoint
     */
    router.get("/endpointInfos", function(req,res,next){
        let infos = {};
        infos.methods = HTTP_METHODS;//methodes http supportées
        infos.types = Object.keys(TYPES); //type de retour supportées
        infos.param_types = ["Integer","Float","String","Date",
        "Boolean","Credit card","Currency","URI","Email","Domain name",
        "Hex color","Hexadecimal","IP","ISBN","ISSN","ISIN","JSON",
        "MAC Address","MD5","Mobile phone","MongoID","URL","UUID"]//les types de parametres
        //possibles

        res.json(infos);
    });
     /* GET home page ADMIN.
    permet de tester les differents modules
    */
    router.get('/', function(req, res, next) {
        //send index.html
        res.sendFile(path.join(__dirname+'/../views/index.html'));
    
    });

    return router;
};
