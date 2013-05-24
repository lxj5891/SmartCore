/**
 * 泛用文书存储模块
 *
 */

var connector = require('./connector');


/**
 * Schema description
 *
 */

exports.create = function(storeid, document, callback) {

  var collection = connector.db.collection(storeid);
  collection.insert(document, {w: 1}, function(err, result){
    callback(err, result);
  });

};

exports.update = function(storeid, condition, document, callback) {

  var collection = connector.db.collection(storeid);

  console.log(condition);
  console.log(document);
  collection.update(condition, {$set: document}, {upsert:true, w: 1}, function(err, result){
  console.log(storeid);
  console.log(err);
  console.log(result);
    callback(err, result);
  });

};

exports.updateById = function(storeid, docid, document, callback) {

  var condition = {_id: connector.id(docid)};
  exports.update(storeid, condition, document, callback);

};

exports.find = function(storeid, condition, start_, limit_, callback) {

  var collection = connector.db.collection(storeid);
  collection.find(condition, {skip: start_, limit: limit_}).toArray(function(err, result){
    callback(err, result);
  });

};

exports.findById = function(storeid, docid, callback) {

  var collection = connector.db.collection(storeid);
  var condition = {_id: connector.id(docid)};

  collection.findOne(condition, function(err, result){
    callback(err, result);
  });

};

