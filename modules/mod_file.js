/**
 * @file 存取文件的module
 * @author sl_say@hotmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var smart     = require("smartcore")
  , mongo       = smart.util.mongoose
  , conn        = require("./connection")
  , async     = require("async")
  , schema      = mongo.Schema
  , mixed       = schema.Types.Mixed;

var Db = require("mongodb").Db
  , Server = require("mongodb").Server
  , ObjectID = require("mongodb").ObjectID
  , GridStore = require("mongodb").GridStore
  , conf = require("config").db; // TODO APP调用时,有没有问题?

// 基本设置
var serverConfig = { poolSize : 2 } // number of connections in the connection pool, set to 5 as default.
  , dbOptions = { w : 1 } //TODO 意思?
  , gridStoreMode = "w"; // write in truncate mode. Existing data will be overwriten.

/**
 * 文件实体存放到GridFS中，
 * 由于GridFS无法更新文件的元数据,File Schema用于存储更新用的文件元数据.
 */
var File = new schema({
    fileId      : { type: String, description: "GridFS的ID" }
  , length      : { type: Number, description: "素材大小" }
  , chunkSize   : { type: Number, description: "每个chunk的大小.默认256k" }
  , filename    : { type: String, description: "素材名" }
  , contentType : { type: String, description: "素材类型" }
  , extend      : { type: mixed,  description: "扩展属性" }
  , valid       : { type: Number, description: "删除 0:无效 1:有效", default:1 }
  , createAt    : { type: Date,   description: "创建时间" }
  , createBy    : { type: String, description: "创建者" }
  , updateAt    : { type: Date,   description: "更新时间" }
  , updateBy    : { type: String, description: "更新者" }
  });

/**
 * 使用定义好的Schema,通过DBCode生成File的model
 * @param {string} DBcode
 * @returns {model} File model
 */
function model(dbCode) {

  return conn(dbCode).model("File", File);
}

/**
 * 上传文件,
 * @param {string} dbCode DBcode
 * @param {object} fileName 条件
 * @param {object} filePath 条件
 * @param {object} options 条件
 * @param {object} newFile 上传文件
 * @param {function} callback 返回文件
 * @returns {model} GridFS model
 */
exports.addFile = function (dbCode, fileName, filePath, options, newFile, callback) {

  var db = new Db(dbCode, new Server(conf.host, conf.port, serverConfig), dbOptions);

  db.open(function(err, db) {

    if (err) {
      return callback(err, null);
    }

    // 创建一个文件,并且打开它.每次生成新的fileID,即使相同的文件名也可以多次保存.
    var gridStore = new GridStore(db, new ObjectID(), fileName, gridStoreMode, options);
    gridStore.open(function(err, gridStore) {

      if (err) {
        return callback(err, null);
      }

      // 写内容到打开的文件中
      gridStore.writeFile(filePath, function(err, gridStore) {

        if (err) {
          return callback(err, null);
        }

        async.waterfall([
          // 1.文件写入到GridFS
          function(callback) {
            // Close (Flushes the data to MongoDB)
            gridStore.close(function(err, fileData) {
              db.close();
              callback(err, fileData);
            });
          },

          // 2.文件元数据写入到File Module
          // TODO callback中的异常没有处理
          function(fileData, callback) {
            var File = model(dbCode);
            // 取得文件元数据信息
            // TODO 未测试
            newFile.fileId = fileData._id;
            newFile.length = fileData.length;
            newFile.chunkSize = fileData.chunkSize;
            newFile.filename = fileData.filename;
            newFile.contentType = fileData.contentType;

            new File(newFile).save(function(err, result) {
              callback(err, result);
            });
          }
        ], function(err, result) {
            callback(err, result);
          });
      });
    });
  });
};

/**
 * 获取文件元数据
 * @param <Object> user 用户对象
 * @param <Function> callback(err) 回调函数，返回异常信息
 */
exports.getFileInfo = function (dbCode, fileInfoId, callback) {

  var file = model(dbCode);

  file.findById(fileInfoId, function(err, result) {
    callback(err, result);
  });
};

/**
 * 获取文件元数据和文件实体
 * @param <Object> user 用户对象
 * @param <Function> callback(err) 回调函数，返回异常信息
 */
exports.getFile = function (dbCode, fileInfoId, callback) {

  async.waterfall([
    // 1.读取文件元数据信息,为了取得GridFS的ID
    function(callback) {
      // TODO 写法确认
      exports.getFileInfo(dbCode, fileInfoId, callback);
    },

    // 2.从GridFS中读取文件本体
    // TODO callback的异常(异常,没有记录等)
    function(fileData, callback) {
      var fileID = new ObjectID(fileData.fileID);
      //
      var db = new Db(dbCode, new Server(conf.host, conf.port, serverConfig), dbOptions);

      GridStore.exist(db, fileID, function(err, exists) {

        if(err) {
          return callback(err, null);
        }

        if(exists === true) {
          var gridStore = new GridStore(db, fileID, "r");
          gridStore.open(function(err, gs) {

            if (err) {
              return callback(err,null);
            }
            // Set the pointer of the read head to the start of the gridstored file
            gs.seek(0, function(err, gridS){

              if(err){
                return callback(err, null);
              }
              // Read the entire file
              gridS.read(function(err, data){
                db.close();
                // 返回文件实体和元数据
                var result = {
                  file : data,
                  fileInfo : fileData
                };
                callback(err, result);
              });
            });
          });
        } else {
          callback(err, null);
        }
      });
    }
  ], function(err, result) {
    callback(err, result);
  });
};

exports.getFileInfoListByIds = function () {

};

exports.getFileListByIds = function () {

};

exports.getFileInfoList = function () {

};

exports.getFileList = function () {

};

exports.updateFileInfo = function () {

};

exports.removeFile = function () {

};

//var File = new schema({
//    history: [String]			//文件履历，存储GridFS的文件id数组，最后一个为当前文件
//  , owner: {type: String}		//文件的创建者
//  , follower: [String]
//  /* 以下为GridFS中信息的冗余*/
//  , filename: {type: String}
//  , chunkSize: {type: Number}
//  , contentType: {type: String}
//  , length: {type: Number}
//  , uploadDate: {type: Date}
//  , metadata: {
//  	  author: {type: String}
//  	, tags: {type: String}
//  }
//});
//
//
//exports.save = function(file_, callback_){
//  var file = model();
//  new file(file_).save(function(err, result){
//    //solr.update(result, "doc", "insert", function(data){});
//  	callback_(err, result);
//  });
//};
//
//exports.update = function(fileid_, updateObj_, callback_){
//  var file = model();
//  file.findByIdAndUpdate(fileid_, updateObj_, function(err, result){
//    //solr.update(result, "doc", "update", function(data){});
//  	callback_(err, result);
//  });
//};
//
//exports.get = function(fileid_, callback_){
//  var file = model();
//  file.findById(fileid_, function(err, result){
//  	callback_(err, result);
//  });
//};
//
//exports.list = function(condition_, start_, limit_, callback_){
//  var file = model();
//  file.find(condition_)
//    .skip(start_ || 0)
//    .limit(limit_ || 20)
//    .sort({uploadDate: -1})
//    .exec(function(err, result){
//      file.count(condition_).exec(function(err, count){
//        callback_(err, {total:count,items:result});
//      });
//    });
//};
//
//exports.find = function(condition_, callback_){
//  var file = model();
//  file.find(condition_)
//    .sort({uploadDate: -1})
//    .exec(function(err, result){
//      callback_(err, result);
//    });
//}
//
//exports.history = function(fileid_, callback_){
//  var file = model();
//  file.findById(fileid_, {history:1}, function(err, result){
//    callback_(err, result.history);
//  });
//};
//
//exports.search = function(keyword_, uid_, callback_){
//  var file = model()
//    , regex = new RegExp("^" + keyword_.toLowerCase() +'.*', "i");
//  file.find({"filename": regex,"owner": uid_}).select('_id filename contentType length uploadDate').skip(0).limit(5)
//    .sort({filename: 'asc'})
//    .exec(function(err, users){
//      callback_(err, users);
//    });
//};
