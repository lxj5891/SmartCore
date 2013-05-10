/**
 * API Template
 * Copyright (c) 2012 Author Name <l_li@dreamarts.co.jp>
 * @see http://10.2.8.224/ssdb
 */

var util = require('util')
  , log = require('../core/log')
  , templ = require("../modules/mod_template");

exports.view = function(req, res){

  if (req.params.id) {
    templ.at(req.params.id, function(templ){
      templ.template = templ._id;
      res.send({template: templ, method: "read"});
    });
    
  } else {
    templ.list(req.query, function(result) {
      result.target = "template";
      res.send(result);
    });
  }

};

exports.list = function(req, res){
  
  if (req.query.type == "docs") {
    
    templ.references(req.query.type, function(result){
      res.send(result);
    });
  } else {
    
    templ.items(req.query.table, req.query.id, function(result){

      res.send(result);
    });
  }
  
};
