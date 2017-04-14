"use strict";
/**
 * Chargement des middlewares pour les types de retour 
 * recupere les données par: 
 *      req.__midnight_datas 
 * Doit:
 *      - determiner le content type 
 *      - renvoyer les données (dernier middleware de la liste)
 */



const TYPES = {
    'json': require("./types/json"),
    'simplexml':require("./types/simplexml"),
};


module.exports = TYPES;