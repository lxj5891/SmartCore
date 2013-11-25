/**
 * @file 存取文件的Controller
 * @author sl_say@hotmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var ph          = require("path")
  , fs          = require("fs")
  , sync        = require("async")
  , conf        = require("config").app
  , constant    = require("../constant")
  , errors      = require("../errors")
  , log         = require("../log")
  , file        = require("../models/mod_file.js");


/**
 * 上传文件
 * @param {Object} handler 上下文对象
 * @param {Function} callback 返回追加的文件结果
 */
exports.add = function(handler, callback) {

  var params = handler.params
    , uid = handler.uid
    , code = handler.code
    , files = params.files;

  log.debug("begin: add file.", uid);
  log.debug("DB code: ", code);
  log.debug("file set: ", files);

  var result = [];

  sync.forEach(files, function(fileIndex, callback) {

    var fileName = ph.basename( fileIndex.name);
    var filePath = fs.realpathSync(ph.join(conf.tmp, ph.basename(fileIndex.path)));

    var date = new Date();
    var newFile = {
        valid: constant.VALID
      , createAt: date
      , createBy: uid
      , updateAt: date
      , updateBy: uid
      };

    // root chunk_size  metadata readPreference wtimeout fsync journal
    var options = {
      "content_type": fileIndex.type
    };

    // To save the file to GridFS
    file.add(code, fileName, filePath, options, newFile, function(err, fileData) {

      if (err) {
        log.error(err, uid);
        callback(new errors.InternalServer(__("js.ctr.common.system.error")));
      } else {
        result.push(fileData);
        log.debug(fileData, uid);
        callback(err);
      }
    });
  }, function(err) {

    log.debug("finished: add file.", uid);
    return callback(err, result);
  });
};

/**
 * 获取文件元数据
 * @param {Object} handler 上下文对象
 * @param {Function} callback 返回文件元数据
 */
exports.getInfo = function(handler, callback) {

  var params = handler.params
    , uid = handler.uid
    , code = handler.code
    , fileInfoId = params.fileInfoId;

  log.debug("begin: get fileInfo.", uid);
  log.debug("DB code: ", code);
  log.debug("fileInfo id: ", fileInfoId);

  file.getInfo(code, fileInfoId, function(err, result) {
    if (err) {
      log.error(err, uid);
      return callback(new errors.InternalServer(__("js.ctr.common.system.error")));
    } else {
      log.debug(result, uid);
      log.debug("finished: get fileInfo.", uid);
      return callback(err, result);
    }
  });
};

/**
 * 获取文件实体
 * @param {Object} handler 上下文对象
 * @param {Function} callback 返回文件实体
 */
exports.getFile = function(handler, callback) {

  var params = handler.params
    , uid = handler.uid
    , code = handler.code
    , fileId = params.fileId;

  log.debug("begin: get file data.", uid);
  log.debug("DB code: ", code);
  log.debug("gridfs id: ", fileId);

  file.getFile(code, fileId, function(err, result) {
    // TODO 404错误
    if (err) {
      log.error(err, uid);
      return callback(new errors.InternalServer(__("js.ctr.common.system.error")));
    } else {
      log.debug(result, uid);
      log.debug("finished: get file data.", uid);
      return callback(err, result);
    }
  });
};

/**
 * 存储的文件是图片时,获取图片
 * @param {Object} handler 上下文对象
 * @param {Function} callback 返回文件实体
 */
exports.get = function(handler, callback) {

  var params = handler.params
    , uid = handler.uid
    , code = handler.code
    , fileInfoId = params.fileInfoId;

  log.debug("begin: get file.", uid);
  log.debug("DB code: ", code);
  log.debug("file id: ", fileInfoId);

  var result = {};
  sync.waterfall([

    // 1.读取照片元数据
    function(done) {
      file.getInfo(code, fileInfoId, function(err, fileInfoData) {
        if (err) {
          log.error(err, uid);
          return callback(new errors.InternalServer(__("js.ctr.common.system.error")));
        } else {
          result.fileInfo = fileInfoData;
          done(err, fileInfoData);
        }
      });
    },

    // 2.读取照片本体
    function(fileInfoData, done) {
      file.getFile(code, fileInfoData.fileId, function(err, fileData) {
        if (err) {
          log.error(err, uid);
          return callback(new errors.InternalServer(__("js.ctr.common.system.error")));
        } else {
          result.fileData = fileData;
          done(err, fileData);
        }
      });
    }
  ], function(err) {
    log.debug("result:" + result, uid);
    log.debug("finished: get file.", uid);
    callback(err, result);
  });
};

/**
 * 获取所有文件元数据
 * @param {Object} handler 上下文对象
 * @param {Function} callback 返回文件元数据
 */
exports.getList = function(handler, callback) {

  var params = handler.params
    , uid = handler.uid
    , code = handler.code
    , start = params.start
    , limit = params.limit
    , condition = params.condition
    , order = params.order;

  log.debug("begin: get fileInfo list.", uid);
  log.debug("DB code: ", code);
  log.debug("start: ", start);
  log.debug("limit: ", limit);
  log.debug("condition: ", condition);
  log.debug("order: ", order);

  // 获取件数
  file.total(code, condition, function(err, count) {
    if (err) {
      log.error(err, uid);
      callback(new errors.InternalServer(__("js.ctr.common.system.error")));
      return;
    }

    // 获取一览
    file.getList(code, condition, start, limit, order, function(err, result) {
      if (err) {
        log.error(err, uid);
        return callback(new errors.InternalServer(__("js.ctr.common.system.error")));
      }
      log.debug("result:" + result, uid);
      log.debug("count:" + count, uid);
      log.debug("finished: get fileInfo list.", uid);
      return callback(err,  { totalItems: count, items: result });
    });
  });
};

/**
 * 更新文件元数据
 * @param {Object} handler 上下文对象
 * @param {Function} callback 返回文件元数据
 */
exports.update = function(handler, callback) {

  var params = handler.params
    , uid = handler.uid
    , code = handler.code
    , fileInfoId = params.fileInfoId
    , updateFile = params.updateFile;

  updateFile.updateAt = new Date();
  updateFile.updateBy = uid;

  log.debug("begin: update fileInfo.", uid);
  log.debug("DB code: ", code);
  log.debug("fileInfo Id: ", fileInfoId);
  log.debug("update File: ", updateFile);

  file.update(code, fileInfoId, updateFile,  function(err, result) {
    if (err) {
      log.error(err, uid);
      return callback(new errors.InternalServer(__("js.ctr.common.system.error")));
    } else {
      log.debug(result, uid);
      log.debug("finished: update fileInfo.", uid);
      return callback(err, result);
    }
  });
};

/**
 * 更新文件元数据和实体
 * @param {Object} handler 上下文对象
 * @param {Function} callback 返回文件元数据和实体
 */
exports.updateFile = function(handler, callback) {

  var params = handler.params
    , uid = handler.uid
    , code = handler.code
    , fileInfoId = params.fileInfoId
    , updateFile = params.updateFile
    , fileName = params.fileName
    , filePath = params.filePath
    , options = params.options;

  updateFile.updateAt = new Date();
  updateFile.updateBy = uid;

  log.debug("begin: update fileInfo.", uid);
  log.debug("DB code: ", code);
  log.debug("fileInfo Id: ", fileInfoId);
  log.debug("update file: ", updateFile);
  log.debug("file name: ", fileName);
  log.debug("file path: ", filePath);
  log.debug("file options: ", options);

  file.updateFile(code, fileInfoId, updateFile, fileName, filePath, options, function(err, result) {
    if (err) {
      log.error(err, uid);
      return callback(new errors.InternalServer(__("js.ctr.common.system.error")));
    } else {
      log.debug(result, uid);
      log.debug("finished: update fileInfo.", uid);
      return callback(err, result);
    }
  });
};

/**
 * 删除文件
 * @param {Object} handler 上下文对象
 * @param {Function} callback 返回删除后的文件元数据
 */
exports.remove = function(handler, callback) {

  var params = handler.params
    , uid = handler.uid
    , code = handler.code
    , fileInfoId = params.fileInfoId
    , updateFile = params.updateFile;

  updateFile.updateAt = new Date();
  updateFile.updateBy = uid;

  log.debug("begin: remove fileInfo.", uid);
  log.debug("DB code: ", code);
  log.debug("fileInfo Id: ", fileInfoId);
  log.debug("update file: ", updateFile);

  file.remove(code, fileInfoId, updateFile, function(err, result) {
    if (err) {
      log.error(err, uid);
      return callback(new errors.InternalServer(__("js.ctr.common.system.error")));
    } else {
      log.debug(result, uid);
      log.debug("finished: remove fileInfo.", uid);
      return callback(err, result);
    }
  });
};

/**
 * 获取文件件数
 * @param {Object} handler 上下文对象
 * @param {function} callback 返回文件件数
 */
exports.total = function(handler, callback) {

  var params = handler.params
    , uid = handler.uid
    , code = handler.code
    , condition = params.condition;

  log.debug("begin: total.", uid);
  log.debug("DB code: ", code);
  log.debug("condition: ", condition);

  file.total(code, condition, function(err, result) {
    if (err) {
      log.error(err, uid);
      return callback(new errors.InternalServer(__("js.ctr.common.system.error")));
    } else {
      log.debug(result, uid);
      log.debug("finished: total.", uid);
      return callback(err, result);
    }
  });
};