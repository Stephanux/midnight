"use strict";
var util = require('util');
/**
 * creation des middlewares de validation des parametres
 * params: des schemas (express-validator) definissant les contraintes des parametres
 */

module.exports = function(route){

        /**
         * le middleware de validation a proprement parlé...
         * voir si s'occupe aussi des headers?
         */
        function validate_params(req,res,next){
            if(route.params) req.checkParams(route.params);
            if(route.url_params)req.checkQuery(route.url_params);
            if(route.formdatas_params) req.checkBody(route.formdatas_params);

            
            req.getValidationResult().then( res=>{
                if(!res.isEmpty()){
                    next({
                        status:400,
                        message:"Params validation error:"+ util.inspect(res.array())
                    });
                } else {
                    next();
                }
            });
                
            
        };
        return validate_params;
}
