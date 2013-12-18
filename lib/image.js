/**
 * @file 处理图片，需要imageMagick的支持
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var sync        = require("async")
  , gm          = require("gm").subClass({ imageMagick: true })
  , context     = require("./context")
  , ctrlFile    = require("./controllers/ctrl_file");

/**
 * 生成缩略图
 * @param {String} src 原图片
 * @param {String} out 结果图片
 * @param {Number} width 缩略图宽度
 * @param {Number} height 可选。高度，不指定则按原图比例缩放
 * @param {Number} quality 可选。质量，去0-100值，默认为75
 * @param {Function} callback 可选。回调函数
 */
exports.thumbnail = function(src, out, width, height, quality, callback) {

  width = width || 100;
  height = height || 0;
  quality = quality || 75;

  gm(src).thumb(width, height, out, quality, function(err) {
    if (err) {
      if (callback) {
        callback(err);
      }
      return;
    }

    if (callback) {
      callback(undefined, out);
    }
  });
};

/**
 * 剪切图片
 * @param {String} src 原图片
 * @param {String} out 结果图片
 * @param {Number} width 剪切后的最终宽度
 * @param {Number} height 剪切后的最终高度
 * @param {Number} x 起始位置X
 * @param {Number} y 起始位置Y
 * @param {Function} callback 可选。回调函数
 */
exports.crop = function(src, out, width, height, x, y, callback) {
  gm(src).crop(width, height, x, y).write(out, function(err) {
    if (err) {
      if (callback) {
        callback(err);
      }
      return;
    }

    if (callback) {
      callback(undefined, out);
    }
  });
};

/**
 * 需要的参数为
 *   params key : thumbs
 *   params val : [{key: "size1", width: 100}, {key: "size2", width: 50, height: 70, quality: 100}]
 * 使用例子
 *   handler.addParams("thumbs", [{key: "size1", width: 100}, {key: "size2", width: 50}]);
 *   image.generateThumbnail(handler, 0, function(err, result) {
 *     done(err, data, a);
 *   });
 * @param {Context} handler 包含文件的上下文句柄
 * @param {Number} fileIndex context的files中的文件索引
 * @param {Function} callback 添加到数据库的缩略图的文件信息
 */
exports.generateThumbnail = function(handler, fileIndex, callback) {

  var srcFile = handler.params.files[fileIndex]
    , result = {};

  sync.forEach(handler.params.thumbs, function(item, done) {

    var src = srcFile.path
      , out = srcFile.path + item.key;

    // 生成缩略图
    exports.thumbnail(src, out, item.width, item.height, item.quality, function(err) {
      if (err) {
        done(err);
        return;
      }

      // 生成Handler，添加文件对象
      var newHandler = new context().create(handler.uid, handler.code, handler.lang);
      newHandler.addParams("files", [{ name: srcFile.name, path: out, type: srcFile.type }]);

      // 缩略图更新到DB
      ctrlFile.add(newHandler, function(err, file) {
        if (err) {
          done(err);
          return;
        }

        // 添加结果到result里
        result[item.key] = file;
        done(err, file);
      });
    });
  }, function(err) {
    return callback(err, result);
  });
};

exports.generateCrop = function() {
};