/**
 * GridFS:
 * Copyright (c) 2012 Author Name li
 */

var Db = require('mongodb').Db
  , Server = require('mongodb').Server
  , ReplSetServers = require('mongodb').ReplSetServers
  , ObjectID = require('mongodb').ObjectID
  , Binary = require('mongodb').Binary
  , GridStore = require('mongodb').GridStore
  , Code = require('mongodb').Code
  , BSON = require('mongodb').pure().BSON;

var fs = require('fs')
  , conf = process.env['TEST'] ? require('config').testdb : require('config').db
  , assert = require('assert');

var ServerOptions = {
    auto_reconnect: false,
    poolSize: 2
  };

var DbOptions = {
    native_parser: false
  , w: 1
  };

/**
 * 保存文件到GridFS
 */
exports.save = function(code, filename, path, metadata, contentType, callback) {

  var db = new Db(code, new Server(conf.host, conf.port, ServerOptions), DbOptions);

  var options = {
      "metadata": metadata
    , "content_type": contentType
  };
  
  db.open(function(err, db){
    var fileId = new ObjectID() // 指定文件ID，来实现重名文件的创建？
      , gridStore = new GridStore(db, fileId, filename, "w", options)
      , fileSize = fs.statSync(path).size
      , data = fs.readFileSync(path);
    
    gridStore.open(function(err, gridStore) {
      gridStore.writeFile(path, function(err, doc) {
        db.close();
        callback(err, doc);
      });
    });
  });
};


/**
 * 获取一个文件
 */
exports.load = function(code, fileid, callback) {

  var db = new Db(code, new Server(conf.host, conf.port, ServerOptions), DbOptions);
  db.open(function(err, db){

    var gridStore = new GridStore(db, new ObjectID(fileid), 'r');
    gridStore.open(function(err, gridStore) {
      // 临时对应案，否则出错时，iPhone画面出1004错误
      var error     = require('../core/errors')
      if(err)
        return callback(new error.NotFound(__("user.error.notFound")));

      // Set the pointer of the read head to the start of the gridstored file
      gridStore.seek(0, function(){
        gridStore.read(function(err, data){
          
          callback(err, data, {
              fileId: gridStore.fileId
            , filename: gridStore.filename
            , contentType: gridStore.contentType
            , uploadDate: gridStore.uploadDate
            , length: gridStore.length
            , md5: gridStore.internalMd5
            , options: gridStore.options
            });
          db.close();
        });
      });
    });
  });
  
};


/**
 * 获取GridFS上的文件列表
 */
exports.all = function(code, condition_, start_, limit_, callback) {

  var db = new Db(code, new Server(conf.host, conf.port, ServerOptions), DbOptions);
  db.open(function(err, db){

    // sort by date desc
    db.collection("fs.files")
      .find(condition_, {}, start_, limit_)
      .sort({uploadDate: -1})
      .toArray(function(err, result){
        callback(err, result);
        db.close();
    });
  });
};

exports.getByIds = function(code, fids_, callback_){
  var db = new Db(code, new Server(conf.host, conf.port, ServerOptions), DbOptions);
  for (var i = 0; i < fids_.length; i++) {
    fids_[i] = ObjectID(fids_[i]);
  };

  var condition = {"_id": {"$in": fids_}};
  db.open(function(err, db){

    db.collection("fs.files")
      .find(condition)
      .sort({uploadDate: 1})
      .toArray(function(err, result){
        callback_(err, result);
        db.close();
    });
  });
};


/**
 * 删除GridFS上的指定文件
 */
exports.delete = function(code, id_, callback) {

  var db = new Db(code, new Server(conf.host, conf.port, ServerOptions), DbOptions);
  db.open(function(err, db){

    var gridStore = new GridStore(db, new ObjectID(id_), 'r');
    gridStore.open(function(err, gridStore) {
      
      if (!gridStore) {
        return callback("Not Found");
      }

      gridStore.unlink(function(err, result){
        callback(err, id_);
      });
    });
  });

}
