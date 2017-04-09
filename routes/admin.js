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
    /* GET home page ADMIN.
    permet de tester les differents modules
    */
    router.get('/', function(req, res, next) {
    res.end("Hello");
    
    });
    router.get("/sitemap", function(req,res,next){
        //renvoie le hbs de description/mise a jour du sitemap
        res.render('sitemap',{
            test:"Bonjour",
            map: app.sitemap
                
                
            
        });
    });

    return router;
};