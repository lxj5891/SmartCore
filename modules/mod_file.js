/**
 * User:
 * Copyright (c) 2013 Author Name kita
 */

var mongo = require('mongoose')
  , util = require('util')
  , solr = require('../core/solr')
  , log = require('../core/log')
  , conn = require('./connection')
  , schema = mongo.Schema;


/**
* File Schema
* 文件实体存放到GridFS中，此处存储文件情报（部分信息和GridFS冗余）
* 由于GridFS无法进行update，所以此处也负责维护文件的历史情报
*/

var File = new schema({
    history: [String]			//文件履历，存储GridFS的文件id数组，最后一个为当前文件
  , owner: {type: String}		//文件的创建者
  , follower: [String]
  /* 以下为GridFS中信息的冗余*/
  , filename: {type: String}
  , chunkSize: {type: Number}
  , contentType: {type: String}
  , length: {type: Number}
  , uploadDate: {type: Date}
  , metadata: {
  	  author: {type: String}
  	, tags: {type: String} 
  }
});


exports.save = function(file_, callback_){
  var file = model();
  new file(file_).save(function(err, result){
    //solr.update(result, "doc", "insert", function(data){});
  	callback_(err, result);
  });
};

exports.update = function(fileid_, updateObj_, callback_){
  var file = model();
  file.findByIdAndUpdate(fileid_, updateObj_, function(err, result){
    //solr.update(result, "doc", "update", function(data){});
  	callback_(err, result);
  });
};

exports.get = function(fileid_, callback_){
  var file = model();
  file.findById(fileid_, function(err, result){
  	callback_(err, result);
  });
};

exports.list = function(condition_, start_, limit_, callback_){
  var file = model();
  file.find(condition_)
    .skip(start_ || 0)
    .limit(limit_ || 20)
    .sort({uploadDate: -1})
    .exec(function(err, result){
      file.count(condition_).exec(function(err, count){
        callback_(err, {total:count,items:result});
      });
    });
};

exports.find = function(condition_, callback_){
  var file = model();
  file.find(condition_)
    .sort({uploadDate: -1})
    .exec(function(err, result){
      callback_(err, result);
    });
}

exports.history = function(fileid_, callback_){
  var file = model();
  file.findById(fileid_, {history:1}, function(err, result){
    callback_(err, result.history);
  });
};

exports.search = function(keyword_, uid_, callback_){
  var file = model()
    , regex = new RegExp("^" + keyword_.toLowerCase() +'.*', "i");
  file.find({"filename": regex,"owner": uid_}).select('_id filename contentType length uploadDate').skip(0).limit(5)
    .sort({filename: 'asc'})
    .exec(function(err, users){
      callback_(err, users);
    });
};

function model() {
  return conn().model('File', File);
}
