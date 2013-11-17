/**
 * @file 存取文件的module
 * @author sl_say@hotmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var sync        = require("async")
  , mongo       = require("mongoose")
  , schema      = mongo.Schema
  , Mixed       = mongo.Schema.Types.Mixed
  , ObjectId    = mongo.Schema.Types.ObjectId
  , Db          = require("mongodb").Db
  , GridStore   = require("mongodb").GridStore
  , ObjectID    = require("mongodb").ObjectID
  , Server      = require("mongodb").Server
  , conf        = require("config").db
  , constant    = require("../core/constant")
  , conn        = require("../core/connection");

/**
 * 文件实体存放到GridFS中，
 * 由于GridFS无法更新文件的元数据,File Schema用于存储更新用的文件元数据.
 */
var File = new schema({
    fileId      : { type: ObjectId, description: "GridFS的ID" , unique: true }
  , length      : { type: Number,   description: "素材大小" }
  , name        : { type: String,   description: "素材名" }
  , contentType : { type: String,   description: "素材类型" }
  , extend      : { type: Mixed,    description: "扩展属性" }
  , valid       : { type: Number,   description: "删除 0:无效 1:有效", default: constant.VALID }
  , createAt    : { type: Date,     description: "创建时间" }
  , createBy    : { type: String,   description: "创建者" }
  , updateAt    : { type: Date,     description: "更新时间" }
  , updateBy    : { type: String,   description: "更新者" }
  });

/**
 * 使用定义好的Schema,通过公司Code生成File的model
 * @param {String} code 公司code
 * @returns {model} File model
 */
function model(code) {
  return conn.model(code, constant.MODULES_NAME_FILE, File);
}

/**
 * 上传文件,
 * @param {String} code 公司code
 * @param {String} fileName 文件名
 * @param {String} filePath 文件路径
 * @param {Object} options 文件格式  // TODO 详细说明
 * @param {Object} newFile 上传文件对象,包含基本信息(更新着,更新日,创建者,创建日)
 * @param {Function} callback 返回文件
 */
exports.add = function(code, fileName, filePath, options, newFile, callback) {

  var db = new Db(code, new Server(conf.host, conf.port, constant.MOD_DB_SERVER_OPTIONS), constant.MOD_DB_OPTIONS);

  db.open(function(err, db) {

    if (err) {
      callback(err);
      return;
    }

    // 创建一个文件,并且打开它.每次生成新的fileID,即使相同的文件名也可以多次保存.
    var gridStore = new GridStore(db, new ObjectID(), fileName, constant.MOD_GRIDSTORE_MODE_WRITE, options);
    gridStore.open(function(err, gridStore) {

      if (err) {
        callback(err);
        return;
      }

      // 写内容到打开的文件中
      gridStore.writeFile(filePath, function(err, fileData) {

        if (err) {
          callback(err);
          return;
        }

        sync.waterfall([

          // 1.文件写入到GridFS
          function(done) {
            db.close();
            done(err, fileData);
          },

          // 2.文件元数据写入到File Module
          function(fileData, done) {
            var File = model(code);
            // 取得文件元数据信息
            newFile.fileId = fileData._id;
            newFile.length = fileData.length;
            newFile.name = fileData.filename;
            newFile.contentType = fileData.contentType;

            new File(newFile).save(function(err, result) {
              done(err, result);
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
 * @param {String} code 公司code
 * @param {String} fileInfoId 文件ID
 * @param {Function} callback 返回文件元数据
 */
exports.get = function (code, fileInfoId, callback) {

  var file = model(code);

  file.findById(fileInfoId, function(err, result) {
    callback(err, result);
  });
};

/**
 * 获取文件实体
 * @param {String} code 公司code
 * @param {String} fileId GridFS的ID
 * @param {Function} callback 返回文件实体
 */
exports.getFile = function(code, fileId, callback) {

  // 从GridFS中读取文件本体
  var db = new Db(code, new Server(conf.host, conf.port, constant.MOD_DB_SERVER_OPTIONS), constant.MOD_DB_OPTIONS);

  db.open(function(err, db) {
    GridStore.exist(db, fileId, function(err, exists) {

      if(err) {
        callback(err);
        return;
      }

      if(exists === true) {
        var gridStore = new GridStore(db, fileId, constant.MOD_GRIDSTORE_MODE_READ);
        gridStore.open(function(err, gs) {

          if (err) {
            callback(err);
            return;
          }

          // Set the pointer of the read head to the start of the GridStore file
          gs.seek(0, function(err, gridS){

            if(err){
              callback(err);
              return;
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
 * @param {String} code 公司code
 * @param {Object} conditions 检索条件
 * @param {Number} start 数据开始位置
 * @param {Number} limit 数据件数
 * @param {Number} order 排序
 * @param {Function} callback 返回文件元数据
 */
exports.getList = function(code, conditions, start, limit, order, callback) {

  var file = model(code);

  file.find(conditions)
    .skip(start || constant.MOD_DEFAULT_START)
    .limit(limit || constant.MOD_DEFAULT_LIMIT)
    .sort(order)
    .exec(function(err, result) {
      return callback(err, result);
    });
};

/**
 * 更新文件元数据
 * @param {String} code 公司code
 * @param {String} fileInfoId 文件元数据ID
 * @param {Object} updateFile 更新的文件对象
 * @param {Function} callback 返回文件元数据
 */
exports.update = function(code, fileInfoId, updateFile, callback) {

  var file = model(code);

  file.findByIdAndUpdate(fileInfoId, updateFile, function(err, result) {
    callback(err, result);
  });
};

/**
 * 更新文件元数据和实体
 * @param {String} code 公司code
 * @param {String} fileInfoId 文件元数据ID
 * @param {Object} updateFile 更新的文件对象
 * @param {String} fileName 文件名
 * @param {String} filePath 文件路径
 * @param {Object} options 文件格式
 * @param {Function} callback 返回文件元数据和实体
 */
exports.updateFile = function(code, fileInfoId, updateFile, fileName, filePath, options, callback) {

  var db = new Db(code, new Server(conf.host, conf.port, constant.MOD_DB_SERVER_OPTIONS), constant.MOD_DB_OPTIONS);

  db.open(function(err, db) {

    if (err) {
      callback(err);
      return;
    }

    // 创建一个文件,并且打开它.每次生成新的fileID,即使相同的文件名也可以多次保存.
    var gridStore = new GridStore(db, new ObjectID(), fileName, constant.MOD_GRIDSTORE_MODE_WRITE, options);
    gridStore.open(function(err, gridStore) {

      if (err) {
        callback(err);
        return;
      }

      // 写内容到打开的文件中
      gridStore.writeFile(filePath, function(err, fileData) {

        if (err) {
          callback(err);
          return;
        }

        sync.waterfall([

          // 1.文件写入到GridFS
          function(done) {
            db.close();
            done(err, fileData);
          },

          // 2.文件元数据写入到File Module
          function(fileData, done) {
            var file = model(code);

            // 取得文件元数据信息
            updateFile.fileId = fileData._id;

            file.findByIdAndUpdate(fileInfoId, updateFile, function(err, result) {
              done(err, result);
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
 * 删除文件
 * @param {String} code 公司code
 * @param {String} fileInfoId 文件元数据ID
 * @param {Object} updateFile 要删除的文件元数据对象
 * @param {Function} callback 返回删除后的文件元数据
 */
exports.remove = function(code, fileInfoId, updateFile, callback) {

  var file = model(code);

  // 逻辑删除
  updateFile.valid = constant.INVALID;

  file.findByIdAndUpdate(fileInfoId, updateFile, function(err, result) {
    callback(err, result);
  });
};

/**
 * 获取文件件数
 * @param {String} code 公司code
 * @param {Object} condition 条件
 * @param {function} callback 返回文件件数
 */
exports.total = function(code, condition, callback) {

  var file = model(code);

  file.count(condition).exec(function(err, count) {
    callback(err, count);
  });
};