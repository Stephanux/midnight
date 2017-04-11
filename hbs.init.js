/*
initialisation de hbs pour la partie admin
*/
"use strict";

let hbs = require("hbs");

//configuration HBS pour le site
hbs.registerPartials(__dirname + '/views/partials');

hbs.registerHelper('eachExcept',function(){
    //parcours uniqument les methodes http, ie keys!="childRoutes"
    var ret = "";
    var except = [...arguments];
    var options = except.pop();//options, le dernier argument 
    var obj = except.shift();//l'objet cible
    

   
    for (var key of Object.keys(obj)){
        if(except.indexOf(key)==-1 && !key.startsWith('__')) ret+=options.fn({key:key, value:obj[key]});
        
    }
    
    
    return ret;
});