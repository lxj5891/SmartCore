/**
 * API Search
 * Copyright (c) 2012 Author Name l_li
 */

var util = require("../core/util")
  , json    = require("../core/json")
  , apperr  = require("../core/errors")
  , solr      = require('../core/solr')
  , search  = require("../controllers/ctrl_search")
   
/**
 * Quick:
 *  Easy retrieval.
 *  Search target - Users, Groups, Document title, Topic...
 * Update On:
 *  2012/7/30 16:00
 * Resource Information:
 *  URL - /search/quick.json
 *  Response Formats - json
 *  HTTP Methods - GET
 *  Requires Authentication? - YES
 *  Rate Limited? - NO
 * Example:
 *  Resource URL - http://10.2.8.234:3000/search/quick.json?txt=hello
 *  Response Object - {result: 'a'}
 * @param {String} txt keywords.
 * @return {result} search result.
 * @return {type} result type. User | Group | Document | Topic
 */
exports.quick = function(req_, res_) {

  var keywords = req_.query.keywords
    , uid = req_.session.user._id;

  search.quick(uid, keywords, function(err, result){
    if (err) {
      return res_.send(err.code, json.errorSchema(err.code, err.message));
    } else {
      return res_.send(json.dataSchema({items: result}));
    }    
  });
}

/**
 * Full:
 *  Full-text search.
 *  Search the contents of all.
 * Update On:
 *  2012/7/30 16:00
 * Resource Information:
 *  URL - /search/full.json
 *  Response Formats - json
 *  HTTP Methods - GET
 *  Requires Authentication? - YES
 *  Rate Limited? - NO
 * Example:
 *  Resource URL - http://10.2.8.234:3000/search/full.json?txt=hello
 *  Response Object - {result: 'a'}
 * @param {String} txt keywords.
 * @return {result} search result.
 * @return {type} result type. User | Group | Document | Topic
 */
exports.full = function(req_, res_) {

  var keywords = req_.query.keywords;
  var uid = req_.session.user._id;
  var start = Number(util.checkString(req_.query.start));
  var count = Number(util.checkString(req_.query.count));
  
  keywords = keywords.split(" ");
  var q = "";
  var first = true;
  for(i in keywords){
    if(first){
      first = false;
    }else{
      q += " AND ";
    }
    q += "(title:" + keywords[i] + "* OR content:" + keywords[i] + ")";
  }

  var style = req_.query.style;
  if(style){
    q += " AND style:" + style;
  }

   console.log(q);

  solr.search(q, start, count, uid, function(result){
    var state = result[0][0];
    return res_.send(json.dataSchema({state: state, items: result[1]}));
  });
}

// /api/search/user.json
exports.user = function(req_, res_) {

  var condition = {
    keywords:req_.query.keywords,
    login:req_.session.user._id,
    scope:req_.query.scope || 1,
    target:req_.query.search_target,
    auth: req_.query.search_auth
  };

  search.user(condition, function(err, result){
    if (err) {
      return res_.send(err.code, json.errorSchema(err.code, err.message));
    } else {
      return res_.send(json.dataSchema({items: result}));
    }    
  });
}

