/**
 * Template:
 * Copyright (c) 2012 Author Name l_li
 */

var mongo = require('mongoose')
  , sync = require('async')
  , log = require('../core/log')
  , conn = require('./connection')
  , schema = mongo.Schema;

var Template = new schema({
    docid: {type: String}
  , title: {type: String}
  , status: {type: String}
  , version: {type: String}
  , layout: {
      width: {type: Number}
    , height: {type: Number}
    }
  , item: [{
      itemid: {type: String}
    , index: {type: Number}
    , owner: {type: String}
    , text: {type: String}
    , name: {type: String}
    , description: {type: String}
    , type: {type: String}
    , design: {
        position: {
            x: {type: Number}
          , y: {type: Number}
          , width: {type: Number}
          , height: {type: Number}
          }
        , font: {
            name: {type: String}
          , size: {type: String}
          , color: {type: String}
          }
        , bgcolor: {type: String}
        }
      , source: {
          document: {type: String}
        , item: {type: String}
        , join: [{
              srcDoc: {type: String}
            , srcItem: {type: String}
            , targetDoc: {type: String}
            , targetItem: {type: String}
            , condition: {type: String}
            }]
          }
        , filter: [{
            source: {type: String}
          , join: {type: String}
          , condition: {type: String}
          , compute: {type: String}
          }]
        , validater: [{
            type: {type: String}
          , scope: {type: String}
          , content: {type: String}
          , format: {type: String}
          }]
        , defaults: {type: String}
        , history: {
            version: {type: String}
          , value: {type: String}
          , at: {type: Date}
          , by: {type: String}
          }
        }]
      , category: {type: String, description: "分类"}
      , fixed: {type: String}
      , description: {type: String, description: "描述"}
      , template: {type: String, description: "模板"}
      , expire: {type: Date}
      , createby: {type: String, description: "创建者"}
      , createat: {type: Date, description: "创建时间"}
      , editby: {type: String, description: "修改者"}
      , editat: {type: Date, description: "修改时间"}
      , remove: {type: Number}
      });

exports.create = function(_tmpl, success) {

  var template = conn().model('Template', Template);
  var tmpl = new template();
  
  tmpl.docid = _tmpl.docid;
  tmpl.createby = 'lilin';
  tmpl.createat = new Date();
  tmpl.editby = 'lilin';
  tmpl.editat = new Date();
  tmpl.remove = 1;

  tmpl.title = _tmpl.title;
  tmpl.status = _tmpl.status;
  tmpl.version = 0;
  tmpl.layout = _tmpl.layout;
  
  // reset item id
  
  var newid = new mongo.Types.ObjectId();
  for (var i = 0; i < _tmpl.item.length; i++) {
    
    // TODO:多Grid的时候，Owner也要在Cell和各自的父Grid之间建立联系
    delete _tmpl.item[i]._id;
    
    if (_tmpl.item[i].type === "grid") {
      _tmpl.item[i]._id = newid;
      _tmpl.item[i].owner = null;
    }
    if (_tmpl.item[i].type === "gridcell") {
      _tmpl.item[i].owner = newid;
    }
  }
  
  tmpl.item = _tmpl.item;
  
  tmpl.attach = [{name: "aaa", path: "/tmp/aaaa.bmp"}];
  tmpl.category = _tmpl.category;
  tmpl.official = _tmpl.official;
  tmpl.description = _tmpl.description;
  
  tmpl.save(function(err, doc){
    
    if (err) {
      log.error(err);
    } else {
      success(doc._id);
    }
  });
  
};

exports.update = function(id, _tmpl, success) {
  
  var template = conn().model('Template', Template);
  var conditions = {'_id': id};
  var options = {upsert: true};
  
  var data = {
      title: _tmpl.title
    , status: _tmpl.status
    , version: _tmpl.version
    , layout: {
        width: _tmpl.layout.width
      , height: _tmpl.layout.height
      }
    , item: _tmpl.item
    , attach: _tmpl.attach
    , category: _tmpl.category
    , official: _tmpl.official
    , description: _tmpl.description
    , template: _tmpl.template
    , editby: "lilin"
    , editat: new Date()
    };
  
  template.update(conditions, data, options, function(err){
    if (err) log.error(err);
    success({result: "ok"});
  });
};

exports.at = function(id, success) {

  var tmpl = conn().model('Template', Template);
  tmpl.findOne({_id: id}, function(err, _result){
    success(_result);
  });
  
};

exports.find = function(condition, success){
  
  var doc = conn().model('Template', Template);
  doc.where('docid')
    // .in(condition)    // conditions
    //.select('_id', 'active', 'userid')  // colums
    .skip(0)                            // range
    .limit(30)
    .asc('docid')                      // sort
    .slaveOk()
    .exec(function(err, docs){
      success(docs);
    });
};

exports.remove = function(id, success) {
  var doc = conn().model('Template', Template);
  doc.find({docid: id}).remove(function(err){
    log.error(err);
    success(err);
  });
};

// get ctrl
exports.components = function(did, cid, success) {
  
  var doc = conn().model('Template', Template);
  
  // find sub template id
  // doc.find({docid: '1'}, {'item._id': schema.ObjectId(cid)}, function (err, doc){
  //   success(doc);
  // });
  
  // get sub template
  doc.find({docid: '1'}, {item: {$slice: [1, 1]}}, function (err, doc){
    success(doc);
  });
};

// update ctrl
exports.updateComponent = function(did, component, success) {
  var doc = conn().model('Template', Template);
  doc.update({docid: did}, {"item.0.design.position" : component.positon}, function(err){
    success(err);
  });  
};

// append component to record
exports.addComponent = function(component, success) {
  
  log.debug(JSON.stringify(component.source));
  
  var doc = conn().model('Template', Template);
  doc.findOne({docid: 1}, function(err, doc){
    
    // add
    doc.item.push({design: {
        position: component.position
      , font: component.font
      , color: component.color
      }
    });
    
    doc.save(function(e){
      success(e, {});
    });
  });
};

exports.list = function(options, success) {

  var tmpl = conn().model('Template', Template)
    , skip = isNumber(options.page) ? parseInt(options.page, null) - 1 : 0
    , limit = 20;
 
  tmpl.find()
    .select('_id title editby editat')
    .skip(skip * limit)
    .limit(limit)
    .sort({_id: 'asc'})
    .exec(function(err, docs){
      var list = [];
      
      docs.forEach(function(doc){
        list.push({
            _id: doc._id
          , title: doc.title
          , type: "file"
          , group: "dac"
          , by: doc.editby
          , at: doc.editat
          });
      });
      success({result: list});
    });
};

function isNumber(value) {
  if(value instanceof Array) {
    return false;
  }
  
  //trim
  value = String(value).replace(/^[ 　]+|[ 　]+$/g, '');

  if(value.length === 0) {
    return false;
  }
      
  if(isNaN(value) || !isFinite(value)) {
    return false;
  }
  
  return true;
}


// 可以由其他文书参照（连接）的文书一览，分3类
//  document 文档
//  system 系统表（固定）
//  outside 从外部导入的（导入是做记录）
exports.references = function(t, success) {
  
  sync.waterfall([
    
    // get document
    function(callback) {
      var doc = require('./mod_document');
      doc.list(function(result) {
        callback(null, result);
      });
    },
    
    function(docs, callback) {
      
      // result format
      var doclist = {
        type: t,
        result: []
      };
      
      doclist.result.push({
        category: "document",
        doc: docs.result
      });

      // system
      doclist.result.push({
        category: "system",
        doc: [
          {title: "user", by: "lin.li", at: "08/13 11:22"},
          {title: "group", by: "lin.li", at: "08/13 11:22"},
          {title: "process", by: "lin.li", at: "08/13 11:22"}
        ]
      });
      
      // outside
      doclist.result.push({
        category: "outside",
        doc: [
          {title: "sales", by: "lin.li", at: "08/13 11:22"},
          {title: "product", by: "lin.li", at: "08/13 11:22"},
          {title: "customer", by: "lin.li", at: "08/13 11:22"},
          {title: "product", by: "lin.li", at: "08/13 11:22"},
          {title: "vender", by: "lin.li", at: "08/13 11:22"}
        ]
      });
      
      callback(null, doclist);
      
    }
  ], function(err, result){
      success(result);
    }
  );
  
};

exports.items = function(type, id, success) {
  
  // ref document
  if (type === "document") {
    exports.structure(id, success);
  }
  
  // ref system
  if (type === "system") {
    exports.structure(id, success);
  }
  
  // // ref outside
  // return {
  //   type: type,
  //   result: [
  //     {title:"UserName", type:"String", description:"full name"},
  //     {title:"PhoneNumber", type:"Number", description:""},
  //     {title:"a", type:"Date", description:""},
  //     {title:"b", type:"String", description:""}
  //   ]
  // }
};

exports.structure = function(id, success) {
  
  var tmpl = conn().model('Template', Template);
  tmpl.findOne({_id: id}, function(err, _result){
    
    var items = [], idx = 1;
    _result.item.forEach(function(item){

      items.push({
        key: item.name ? item.name : item.type + idx++,
        type: item.validater[0].type,
        description: item.description
      });
    });
    
    success({result: items});
    
  });

};
