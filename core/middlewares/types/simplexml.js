"use strict";
/**
 * Convertie un objet JS en sa description xml sous la forme:
 * <datas>
 *      <property_name>property_value</property_name>
 *      <object_property_name>
 *          <property_name>property_value</property_name>
 *          ....
 *      </object_property_name>
 *      <array_property_name>
 *          <item>
 *              ...
 *          </item>
 *      </ array_property_name>
 *      ...
 * </datas>
 */
function obj_to_xml(obj, xml){
    let type =  typeof obj;
    if(type == "object"){
            if(Array.isArray(obj)){
                for (let o of obj){
                    xml.push(`<item>`);
                        obj_to_xml(o, xml);
                    xml.push(`</item>`);
                }
            } else {
                for (let key in obj){
                    xml.push(`<${key}>`);
                        obj_to_xml(obj[key], xml);
                    xml.push(`</${key}>`);
                }
            }

    } else {
        xml.push(""+obj);
    }
   
}

function simplexml(req, res, next){
    let xml = ['<?xml version="1.0" encoding="UTF-8"?><datas>'];//utf-8 parceque!
    obj_to_xml(req.__midnight_datas,xml);
    xml.push("</datas>")


    res.status = 200;
    res.contentType = "text/xml";
    res.end(xml.join(""));
}

module.exports = simplexml;