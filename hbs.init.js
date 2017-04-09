/*
initialisation de hbs pour la partie admin
*/
"use strict";

let hbs = require("hbs");

//configuration HBS pour le site
hbs.registerPartials(__dirname + '/views/partials');

hbs.registerHelper('eachExcept',function(obj, except, options){
    //parcours uniqument les methodes http, ie keys!="childRoutes"
    var ret = "";
    for (var key of Object.keys(obj)){
        if(key != except) ret+=options.fn({key:key, value:obj[key]});
    }
    return ret;
});