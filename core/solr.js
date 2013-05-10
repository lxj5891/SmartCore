var http = require('http')
  , _       = require("underscore")
  , mongo   = require('mongoose')
  , qs = require('querystring')
  , async = require("async")
  , solr = require('config').solr
  , group = require('../modules/mod_group');

exports.search = function(q, start, rows, uid, callback) {
 
  var tasks = [];

  var getRoles = function(cb){
    group.getAllGroupByUid(uid,function(err,groups){
      var gids = [uid];
      _.each(groups,function(g){gids.push(g._id.toString());});
      cb(err,gids);
    });
  };
  tasks.push(getRoles);

  var fullTextSearch = function(roles, cb){

    var post_data = {
      "component":"chartter",
      "q":q,
      "start":start,
      "rows":rows,
      "role":roles
    };

    var options = {
      host: solr.host,
      port: solr.port,
      path: '/solr/select',
      method: 'POST',
      headers:{
      'Content-Type':'application/x-www-form-urlencoded'//,
      //'Content-Length':content.length
      //'Authorization':
      }
    };

    var content = qs.stringify(post_data);
    //console.log(content);
    var req = http.request(options, function(res) {
      var _data='';
      res.on('data', function(chunk){
        _data += chunk;
      });
      res.on('end', function(){
        cb(JSON.parse(_data));
      });
    });
   
    req.write(content);
    req.end();
  };
  tasks.push(fullTextSearch);

  async.waterfall(tasks,function(json){
    return callback(json);
  });
}

exports.batchDelete = function(callback) {
  var options = {
    host: solr.host,
    port: solr.port,
    path: '/solr/update_luxor',
    method: 'POST',
    headers:{
    'Content-Type':'application/x-www-form-urlencoded'//,
    //'Content-Length':content.length
    //'Authorization':
    }
  };
  var post_data = {
    "function":"batch:delete",
    "component":"chartter",
    "batch_data":"[{q:['*:*']}]"
  };
  var content = qs.stringify(post_data);
  console.log(content);
  var req = http.request(options, function(res) {
    var _data='';
    res.on('data', function(chunk){
      _data += chunk;
    });
    res.on('end', function(){
      callback(_data);
    });
  });
 
  req.write(content);
  req.end();
}


exports.update = function(object, obj_type, func, callback) {
  var options = {
    host: solr.host,
    port: solr.port,
    path: '/solr/update_luxor',
    method: 'POST',
    headers:{
    'Content-Type':'application/x-www-form-urlencoded'//,
    //'Content-Length':content.length
    //'Authorization':
    }
  };

  var post_data = {
    "function":func,
    "component":"chartter",
    "style":obj_type,
    "id":object._id.toString(),
    "reg_date":object.createat.toJSON(),
    "upd_date":object.editat.toJSON(),
    "reg_account":object.createby,
    "upd_account":object.editby
  };

  if("delete" == func){

  }else if("message" == obj_type){
    post_data.content = object.content;
    post_data.title = object.content;
    post_data.public = object.range == "1" ? true : false;
    post_data.allow = object.range;
    // reply
    if(object.type == 2){
      post_data.parent_id = object.target;
    }

  }else if("user" == obj_type){
    post_data.content = object.name.name_zh 
                        + " " + object.name.letter_zh
                        + " " + object.title
                        + " " + object.birthday
                        + " " + object.tel.mobile
                        + " " + object.email.email1
                        + " " + object.custom.memo
                        + " " + object.address.country
                        ;
    post_data.public = true;
    post_data.title = object.name.name_zh + " " + object.name.letter_zh;
    
  }else if("group" == obj_type){
    post_data.content = object.name.name_zh 
                        + " " + object.name.letter_zh
                        + " " + object.description
                        + " " + object.category
                        ;
    post_data.owner = object.owner;
    post_data.title = object.name.name_zh + " " + object.name.letter_zh;
    post_data.public = object.secure == "2" ? true : false;
    post_data.allow = object._id;

  }else if("doc" == obj_type){
    
  }else if("shortmail" == obj_type){
    
  }

  var content = qs.stringify(post_data);
  var req = http.request(options, function(res) {
    var _data='';
    res.on('data', function(chunk){
      _data += chunk;
    });
    res.on('end', function(){
      callback(_data);
    });
  });
 
  req.write(content);
  req.end();

}

