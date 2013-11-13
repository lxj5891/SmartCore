/**
 * @file 存取文件的module
 * @author sl_say@hotmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var mongo       = require("mongoose")
  , conn        = require("./connection")
  , async       = require("async")
  , schema      = mongo.Schema;

var Db = require("mongodb").Db
  , Server = require("mongodb").Server
  , ObjectID = require("mongodb").ObjectID
  , GridStore = require("mongodb").GridStore
  , conf = require("config").db;// TODO 配置不合理,有依赖性

// 基本设置
var serverConfig = { poolSize : 2 } // number of connections in the connection pool, set to 5 as default.
  , dbOptions = { w : 1 } //TODO 意思?
  , gridStoreMode = "w"; // write in truncate mode. Existing data will be overwriten.

/**
 * 文件实体存放到GridFS中，
 * 由于GridFS无法更新文件的元数据,File Schema用于存储更新用的文件元数据.
 */
var File = new schema({
    fileId      : { type: schema.Types.ObjectId, description: "GridFS的ID" }
  , length      : { type: Number, description: "素材大小" }
  , chunkSize   : { type: Number, description: "每个chunk的大小.默认256k" }
  , filename    : { type: String, description: "素材名" }
  , contentType : { type: String, description: "素材类型" }
  , extend      : { type: schema.Types.Mixed,  description: "扩展属性" }
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
 * @param {string} fileName 文件名
 * @param {string} filePath 文件路径
 * @param {object} options 文件格式
 * @param {object} newFile 上传文件对象,包含基本信息(更新着,更新日,创建者,创建日)
 * @return {function} callback 返回文件
 */
exports.addFile = function(dbCode, fileName, filePath, options, newFile, callback) {

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
      gridStore.writeFile(filePath, function(err, fileData) {

        if (err) {
          return callback(err, null);
        }

        async.waterfall([
          // 1.文件写入到GridFS
          function(callback) {
            db.close();
            callback(err, fileData);
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
 * @param {string} dbCode DBcode
 * @param {ObjectID} fileInfoId 文件ID
 * @return <Function> callback 返回文件元数据
 */
exports.getFileInfo = function (dbCode, fileInfoId, callback) {

  var file = model(dbCode);

  file.findById(fileInfoId, function(err, result) {
    callback(err, result);
  });
};

/**
 * 获取文件实体
 * @param {string} dbCode DBcode
 * @param {ObjectID} fileInfoId GridFS的ID
 * @return <Function> callback 返回文件实体
 */
exports.getFile = function (dbCode, fileId, callback) {

  // 从GridFS中读取文件本体
  var db = new Db(dbCode, new Server(conf.host, conf.port, serverConfig), dbOptions);

  db.open(function(err, db) {
    GridStore.exist(db, fileId, function(err, exists) {

      if(err) {
        return callback(err, null);
      }

      if(exists === true) {
        var gridStore = new GridStore(db, fileId, "r");
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
            gridS.read(function(err, fileData){
              db.close();
              callback(err, fileData);
            });
          });
        });
      } else {
        callback(err, null);
      }
    });
  });
};

/**
 * 获取所有文件元数据
 * @param {string} dbCode DBcode
 * @param {object} conditions 检索条件
 * @return <Function> callback 返回文件元数据
 */
exports.getFileInfoList = function (dbCode, conditions, callback) {

  var file = model(dbCode);

  file.find(conditions, function(err, result) {
    callback(err, result);
  });
};

/**
 * 更新文件元数据
 * @param {string} dbCode DBcode
 * @param {ObjectID} fileInfoId 文件元数据ID
 * @param {object} fileInfoId 更新的文件对象
 * @return <Function> callback 返回文件元数据
 */
exports.updateFileInfo = function (dbCode, fileInfoId, updateFile, callback) {

  var file = model(dbCode);

  file.findByIdAndUpdate(fileInfoId, updateFile, function(err, result) {
    callback(err, result);
  });
};

/**
 * 删除文件
 * @param {string} dbCode DBcode
 * @param {ObjectID} fileInfoId 文件ID
 * @return <Function> callback 返回文件元数据
 */
// TODO 文件物理删除必要?
exports.removeFile = function(dbCode, fileInfoId, callback) {
  async.waterfall([
    // 1.删除文件元数据
    function(callback) {
      var file = model(dbCode);

      file.findByIdAndRemove(fileInfoId, function(err, result) {
        callback(err, result);
      });
    },
    // 2.删除文件实体
    // TODO callback中的异常没有处理
    function(result, callback) {
      var db = new Db(dbCode, new Server(conf.host, conf.port, serverConfig), dbOptions);

      db.open(function(err, db) {

        var gridStore = new GridStore(db, result.fileId, "r");
        gridStore.open(function(err, gs) {
          // TODO 修正必要
          if (!gs) {
            return callback("Not Found");
          }
          // Unlink the file
          gs.unlink(function(err, result) {
            db.close();
            callback(err, result);
          });
        });
      });
    }
  ], function(err, result) {
    callback(err, result);
  });
};

/**
 * 获取文件件数
 * @param {string} code DBCode
 * @param {object} condition 条件
 * @return {function} callback 返回素材件数
 */
exports.total = function(dbCode, condition, callback) {

  var file = model(dbCode);

  file.count(condition).exec(function(err, count) {
    callback(err, count);
  });
};