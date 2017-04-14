"use strict";

function json (req, res, next){
    let dt = req.__midnight_datas || {};
    res.status(200);
    res.json(dt);
}

module.exports = json;