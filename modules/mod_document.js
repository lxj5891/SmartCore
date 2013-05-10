/**
 * Document:
 * Copyright (c) 2012 Author Name <l_li@dreamarts.co.jp>
 * @see http://10.2.8.224/ssdb
 */

var mongo = require('mongoose')
  , util = require('util')
  , log = require('../core/log')
  , conn = require('./connection')
  , dbconf = require('config').db
  , _ = require('underscore')
  , schema = mongo.Schema;

function model() {
  return conn().model('Document', Document);
}

// 不同版本的快照，保存到履历表中：document_history
var Document = new schema({
    docid: {type: String}
  , title: {type: String, description: "标题"}
  , status: {type: String}
  , version: {type: Number}   // 现在的版本号
  , items: [{
      itemid: {type: String}  // 控件的ID，在定义文书时生成
    , value: {type: String}
    , at: {type: Date}
    , by: {type: String}
    }]
  , attach: [{
      name: {type: String}
    , path: {type: String}
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
  , delete: {type: Number}
});

Document.virtual("aaa").get(function(){
  return "中文";
});

exports.create = function(_doc, _template, success) {

  var document = conn().model('Document', Document);
  var doc = new document();
  
  doc.docid = _doc.docid;
  doc.createby = 'lilin';
  doc.createat = new Date();
  doc.editby = 'lilin';
  doc.editat = new Date();
  doc.delete = 1;

  doc.title = _doc.value.title;
  doc.status = _doc.status;
  doc.version = 0

  doc.items = _doc.value.items;

  doc.attach = [{name: "aaa", path: "/tmp/aaaa.bmp"}];
  doc.template = _template;
  
  doc.save(function(err){
    if (err) {
      log.out('error', err);
    } else {
      success();
    }
  });
  
};

exports.update = function(id, _doc, success) {
  
  var document = conn().model('Document', Document)
    , conditions = {'_id': id}
    , options = {upsert: true}
    , _items = _doc.items;

  var data = {
      title: _doc.title
    , status: _doc.status
    , version: _doc.version
    , items: _items
    , attach: _doc.attach
    // , category: _doc.category
    // , official: _doc.official
    // , description: _doc.description
    , template: _doc.template
    , editby: "lilin"
    , editat: new Date()
  };
  
  document.update(conditions, data, options, function(err, count){
    if (err) log.out("error", err);
    else success();
  });
}

exports.updatedef = function(doc, success) {
}

exports.at = function(id, success) {
  
  log.out("debug", id);
  var doc = conn().model('Document', Document);
  doc.findOne({_id: id}, function(err, _result){
    success(_result);
  }); 
};

exports.find = function(condition, success){
  
  var doc = conn().model('Document', Document);
  doc.where('docid').in(condition)    // conditions
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
  var doc = conn().model('Document', Document);
  doc.find({docid: id}).remove(function(err){
    log.out('error'. err);
  });
};

// get ctrl
exports.components = function(did, cid, success) {
  
  var doc = conn().model('Document', Document);
  
  // find sub document id
  // doc.find({docid: '1'}, {'item._id': schema.ObjectId(cid)}, function (err, doc){
  //   success(doc);
  // });
  
  // get sub document
  doc.find({docid: '1'}, {item: {$slice: [1, 1]}}, function (err, doc){
    success(doc);
  });
}

// update ctrl
exports.updateComponent = function(did, component, success) {
  var doc = conn().model('Document', Document);
  doc.update({docid: did}, {"item.0.design.position" : component.positon}, function(err){
  });  
}

// append component to record
exports.addComponent = function(component, success) {
  
  var doc = conn().model('Document', Document);
  doc.findOne({docid: 1}, function(err, doc){
    
    // add
    doc.item.push({design: {
        position: component.position,
        font: component.font,
        color: component.color
    }
    });
    
    doc.save(function(e){
      success({});
    });
  });
}

exports.list = function(success) {
 
  var doc = conn().model('Document', Document);
  doc.find()
    .select('_id title editby editat template')
    .skip(0)
    .limit(20)
    .sort({_id: 'asc'})
    .exec(function(err, docs){
      var list = [];
      docs.forEach(function(doc){
        list.push({
            _id: doc._id
          , title: doc.title
          , type: "file"
          , group: "dac"
          , template: doc.template
          , by: doc.editby
          , at: doc.editat
        });
      });
      success({result: list});
    });

}

exports.structure = function() {

  var k, t, result = [];

  Document.eachPath(function(_key, _val){

    k = _val.options.description ? _val.options.description : _key;
    t = _val.options.type.name;
    if (Array.isArray(_val.options.type)) {
      t = "Array";
    }

    result.push({ key: k, type: t });
  });

  return result;
}

exports.search = function(_keywords, success) {

  var doc = conn().model('Document', Document)
    , regex = new RegExp("^" + _keywords.toLowerCase() +'.*', "i");

  doc.find({title: regex})
    .select('_id title')
    .skip(0).limit(5)
    .sort({title: 'asc'})
    .exec(function(err, docs){
      success(docs);
    });
}

exports.fullsearch = function(_keywords, success) {

  var doc = conn().model('Document', Document);
  doc.find({keywords: _keywords})
    .select('_id title editby editat')
    .skip(0).limit(5)
    .sort({title: 'asc'})
    .exec(function(err, docs){
      success(docs);
    });
}

exports.getTableData = function(rule, success){
  filterByCondition(rule, function(data){
    joinByConnection(data, rule, function(ids, data){
      pickFields(ids, data, rule, success);
    });
  });
  // var docids = filterByCondition(rule);
  // var joinedDocs = joinByConnection(docids, rule);
  // var result = getTargetFiled(joinedDocs);
  // success(result);
}

function pickFields(ids, data, rule, success){
  var result = [];
  var docs = _.groupBy(data,"_id");
  for (var i = 0; i < ids.length; i++) {
    var r = [];
    //ids[i];
    for (var j = 0; j < rule.fields.length; j++) {
      //rule.fields[j];
      for (var k = 0; k < ids[i].length; k++) {
        var dk = ids[i][k];
        var d = docs[dk][0];
        if(d.template == rule.fields[j].templateid){
          for (var l = 0; l < d.items.length; l++) {
            if(d.items[l].itemid == rule.fields[j].itemid){
              r.push(d.items[l].value);
            }
          }
        }
      }
    }
    result.push(r);
  }
  success(result);
}

function putInDic(rule, data) {
  var connFields = connToFieldArray(prepareConn(rule.connections));
  var docs = _.groupBy(data, "template");
  var dics = [];
  for (var i = 0; i < connFields.length;) {
    var ctid = connFields[i].templateid;
    var ctdocs = docs[ctid];
    var dic = {};
    var dic2 = {};
    for (var j = 0; j < ctdocs.length; j++) {
      if (i == 0 ) {
        dic[ctdocs[j]._id] = getFieldValue(ctdocs[j], connFields[i].itemid);
      } else if(i == connFields.length - 1){
        dic[getFieldValue(ctdocs[j], connFields[i].itemid)] = ctdocs[j]._id+"";
      }else {
        dic[getFieldValue(ctdocs[j], connFields[i].itemid)] = ctdocs[j]._id+"";
        dic2[ctdocs[j]._id] = dic[getFieldValue(ctdocs[j], connFields[i + 1].itemid)]
      }
    }
    if (_.isEmpty(dic2)) {
      dics.push(dic);
      i++;
    } else {
      dics.push(dic);
      dics.push(dic2);
      i++;
      i++;
    }
  }
  return dics;
}

function doJoin(dics) {
  var result = [];
  for (var i in dics[0]) {
    var skip = false;
    var flag = true;
    var ck = i;
    var cv = dics[0][ck];
    var joinResult = [];
    joinResult.push(ck);
    for (var j = 1; j < dics.length; j++) {
      ck = cv;
      cv = dics[j][ck];
      if (cv) {
        if (flag) {
          joinResult.push(cv);
          flag = false;
        } else {
          joinResult.push(ck);
          flag = true;
        }
      } else {
        skip = true;
        break;
      }
    }
    if (!skip) {
      result.push(_.uniq(joinResult));
    }
  }
  return result;
}

function joinByConnection(docs, rule, success){
  //start join
  var dics = putInDic(rule, docs);
  var result = doJoin(dics);
  success(result,docs);
}

function getFieldValue(doc, itemid){
  for (var i = 0; i < doc.items.length; i++) {
    if(doc.items[i].itemid == itemid){
      return doc.items[i].value;
    }
  };
}

function connToFieldArray(conns){
  var fields = [];
  for (var i = 0; i < conns.length; i++) {
    fields.push(conns[i].leftField);
    fields.push(conns[i].rightField);
  };
  return fields;
}

function prepareConn(connections){
  var templateids = [];
  for (var i = 0; i < connections.length; i++) {
    templateids.push(connections[i].leftField.templateid);
    templateids.push(connections[i].rightField.templateid);
  };
  var firstConn;
  for (var i = 0; i < templateids.length; i++) {
    var conns = findConnByTmp(templateids[i],connections);
    if(conns.length == 1){
      firstConn = conns[0];
      if(!isLeft(templateids[i], firstConn)){
        firstConn = exchangeConn(firstConn);
      }
      break;
    }
  }
  var conns = connections;
  var currentConn = firstConn;

  var sortedConns = [];
  sortedConns.push(firstConn);

  while(sortedConns.length < connections.length){
    var ctmplid =  currentConn.rightField.templateid;
    var cconns = findConnByTmp(ctmplid, connections);
    for (var i = 0; i < cconns.length; i++) {
      cconns[i];
      if(!isEqual(currentConn,cconns[i])){
        if(isLeft(ctmplid,cconns[i])){
          currentConn = copyConn(cconns[i]);
        }else{
          currentConn = exchangeConn(cconns[i]);
        }
        sortedConns.push(currentConn);
      }
    }
  }
  return sortedConns;
}

function findConnByTmp(tmpl, connections){
  var result =[];
  for (var i = 0; i < connections.length; i++) {
    if(hasTmplid(tmpl,connections[i])){
      result.push(connections[i]);
    }
  }
  return result;
}

function getField(tmpl, connection){
  if(connection.leftField.templateid == tmpl){
    return connection.leftField;
  }else{
    return connection.rightField;
  }
}

function getOtherField(tmpl, connection){
  if(connection.leftField.templateid == tmpl){
    return connection.rightField;
  }else{
    return connection.leftField;
  }
}

function hasTmplid(tmpl, connection){
  return connection.leftField.templateid == tmpl
        || connection.rightField.templateid == tmpl;
}

function isSame(conn1, conn2){
  return conn1.leftField.templateid == conn2.leftField.templateid
        && conn1.leftField.itemid == conn2.leftField.itemid
        && conn1.rightField.templateid == conn2.rightField.templateid
        && conn1.rightField.itemid == conn2.rightField.itemid;
}

function isEqual(conn1, conn2){
  return isSame(conn1,conn2) 
        || isSame(exchangeConn(conn1),conn2) ;
}

function exchangeConn(conn){
  var clone = copyConn(conn);
  var tmp = clone.leftField;
  clone.leftField = clone.rightField;
  clone.rightField = tmp;
  return clone;
}

function isLeft(tmpl, conn){
  return conn.leftField.templateid == tmpl;
}

function copyConn(conn){
  return JSON.parse(JSON.stringify(conn));
}

function filterByCondition(rule, success){  
  var ct = [];
  for (var i = 0; i < rule.conditions.length; i++) {
    var item = rule.conditions[i];
    if(ct.indexOf(item.templateid) == -1){
      ct.push(item.templateid);
    }
  };

  var result = {};
  var querys = {};
  querys["$or"]=[];
  for (var i = 0; i < ct.length; i++) {
    var templateid = ct[i];
    var ids =[];
    var first = true;
    var subQuerys = {};
    subQuerys["$and"] = [];
    //get the doc ids match the condition
    for (var j = 0; j < rule.conditions.length; j++) {
      var condition = rule.conditions[j];
      if(templateid == condition.templateid){
        var q = {};
        q["template"] = templateid;
        q["items.itemid"] = condition.itemid;
        //---
        q["items.value"] = condition.value;
        //---
        subQuerys["$and"].push(q); 
      }
    }
    if(subQuerys["$and"].length > 0){
      querys["$or"].push(subQuerys);
    }
  }

  var ft = _.difference(rule.documents,ct);
  for (var i = 0; i < ft.length; i++){
    querys["$or"].push({"template" : ft[i]});
  }
  model().find(querys)
    .select("_id template items").exec(function(err,docs){
      success(docs);
  });
}

