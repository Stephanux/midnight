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

*/
//Dummy middleware, permet juste de renvoyer qqchose au navigateur appellant
module.exports = function(req,res,next){
    //recupe les infos de la requete
    var dt = {
        url:req.originalUrl,
        params:req.params,
        query:req.query,
        message:"Tout est OK!",
        test:[
            {
                nom:"steph",
                age:12,
                hobbies:[
                    "jeu",
                    "fun"
                ]
            }
        ]
    };

    req.__midnight_datas = dt;
    next();
}