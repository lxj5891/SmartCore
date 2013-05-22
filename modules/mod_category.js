/**
 * 管理分类的模块
 *
 */

var connector = require('./connector')
  , table = "category";
/**
 * Schema description
 * {
 *   project: 大分类
 *   group: 中分类
 *   description: 描述
 *   parent: 父分类
 *   items: [{
 *     name: 
 *     value:
 *     image:
 *     description:
 *   }]
 *   createat:
 *   createby:
 *   editat:
 *   editby:
 * }
 */

exports.create = function(document, callback) {

  var collection = connector.db.collection(table);
  collection.insert(document, {w: 1}, function(err, result){
    callback(err, result);
  });

};

exports.addItem = function(categoryid, items, callback) {

  var collection = connector.db.collection(table)
    , condition = {_id: connector.id(categoryid)};

  collection.update(condition, {$pushAll: {"items": items}}, {w: 1}, function(err, result){
    console.log(err);
    callback(err, result);
  });

};

// exports.update = function(condition, document, callback) {

//   var collection = connector.db.collection(table);

//   collection.update(condition, {$set: document}, {upsert:true, w: 1}, function(err, result){
//     callback(err, result);
//   });

// };

// exports.updateById = function(docid, document, callback) {

//   var condition = {_id: connector.id(docid)};
//   exports.update(table, condition, document, callback);

// };

exports.find = function(condition, start, limit, callback) {

  var collection = connector.db.collection(table);

  collection.find(condition, {"skip": start, "limit": limit}).toArray(function(err, result){
    callback(err, result);
  });

};

exports.findById = function(categoryid, callback) {

  var collection = connector.db.collection(table);
  var condition = {_id: connector.id(categoryid)};

  collection.findOne(condition, function(err, result){
    callback(err, result);
  });

};

exports.update = function(id_, newcategory, callback_) {

  var collection = connector.db.collection(table)
    , condition = {_id: connector.id(id_)};


  collection.update(condition, newcategory, function(err, result){
    callback_(err, result);
  });
};
exports.del = function(id_ , callback_) {

  var collection = connector.db.collection(table)
    , condition = {_id: connector.id(id_)};

    
  collection.remove(condition, function(err, result){
    callback_(err, result);
  });
};





