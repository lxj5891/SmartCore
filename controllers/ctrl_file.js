/**
 * @file 存取文件的Controller
 * @author sl_say@hotmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var file     = require("../modules/mod_file.js")
  , async     = require("async");

/**
 * 上传文件
 * @param {string} dbCode DBcode
 * @param {string} uid 创建者ID
 * @param {object} files 文件集合
 * @return <Function> callback 返回文件
 */
exports.addFile = function(dbCode, uid, files, callback) {

  var result = [];

  async.forEach(files, function(fileIndex, callback){

    var filePath = fileIndex.path;
    var fileName = fileIndex.name;
    // TODO 日期,在那层赋值
    var newFile = {
        valid : 1
      , createAt : new Date().getTime()
      , createBy : uid
      , updateAt : new Date().getTime()
      , updateBy : uid
      };
    // TODO 未确定参数
    // root chunk_size  metadata readPreference wtimeout fsync journal
    var options = {
      content_type : fileIndex.type
    };

    // To save the file to GridFS
    file.addFile(dbCode, fileName, filePath, options, newFile, function(err, fileData){
      if (err) {
        // TODO 错误信息? 回调函数能不能统一
        callback("new error.InternalServer(err)");
      } else {
        result.push(fileData)
        callback(err);
      }
    });
  }, function(err) {
    return callback(err, result);
  });
};

/**
 * 获取文件元数据
 * @param {string} dbCode DBcode
 * @param {string} fileInfoId 文件ID
 * @return <Function> callback 返回文件
 */
exports.getFileInfo = function(dbCode, fileInfoId, callback) {

  file.getFileInfo(dbCode, fileInfoId, function(err, result) {
    if (err) {
      // TODO 错误信息?
      return callback("new error.InternalServer(err)",null);
    } else {
      return callback(err, result);
    }
  });
};

/**
 * 获取文件实体
 * @param {string} dbCode DBcode
 * @param {string} fileInfoId GridFS的ID
 * @return <Function> callback 返回文件实体
 */
exports.getFile = function(dbCode, fileid, callback) {

  file.getFile(dbCode, fileid, function(err, result) {
    if (err) {
      // TODO 错误信息?
      return callback("new error.InternalServer(err)");
    } else {
      return callback(err, result);
    }
  });
};

/**
 * 获取所有文件元数据
 * @param {string} dbCode DBcode
 * @param {object} conditions 检索条件
 * @return <Function> callback 返回文件元数据
 */
// TODO 条件怎么定义
exports.getFileInfoList = function(dbCode, conditions, callback) {

  file.getFileInfoList(dbCode, conditions, function(err, result) {
    if (err) {
      // TODO
      return callback("new error.InternalServer(err)");
    } else {
      return callback(err, result);
    }
  });
};

/**
 * 更新文件元数据
 * @param {string} dbCode DBcode
 * @param {ObjectID} fileInfoId 文件元数据ID
 * @param {object} fileInfoId 更新的文件对象
 * @return <Function> callback 返回文件元数据
 */
exports.updateFileInfo = function(dbCode, fileInfoId, updateFile, callback) {

  file.updateFileInfo(dbCode, fileInfoId, updateFile,  function(err, result) {
    if (err) {
      // TODO
      return callback("new error.InternalServer(err)");
    } else {
      return callback(err, result);
    }
  });
};

/**
 * 删除文件
 * @param {string} dbCode DBcode
 * @param {string} fileInfoId 文件ID
 * @return <Function> callback 返回文件元数据
 */
exports.removeFile = function(dbCode, fileInfoId, callback) {

  file.removeFile(dbCode, fileInfoId, function(err, result) {
    if (err) {
      // TODO
      return callback("new error.InternalServer(err)");
    } else {
      return callback(err, result);
    }
  });
};

/**
 * 获取文件件数
 * @param {string} code DBCode
 * @param {object} condition 条件
 * @return {function} callback 返回素材件数
 */
exports.total = function(dbCode, condition, callback) {

  file.total(dbCode, condition,  function(err, result) {
    if (err) {
      // TODO
      return callback("new error.InternalServer(err)");
    } else {
      return callback(err, result);
    }
  });
};