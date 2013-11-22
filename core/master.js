/**
 * @file 分类master
 * @author sl_say@hotmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var  _             = require("underscore")
  , master        = require("../controllers/ctrl_master")
  , context       = require("../core/context")
  , log           = require("./log");

/**
 * 缓存词条
 */
var cache = {};

/**
 * 将所有的master内容缓存到内存里
 * @param {Object} handler 上下文对象
 * @param {Function} callback 缓存的内容
 */
function load(handler, callback) {

  var condition = { };
  handler.addParams("condition", condition);
  handler.addParams("limit", Number.MAX_VALUE);

  master.getList(handler, function(err, result) {
      if (err) {
        return log.error(err, handler.uid);
      }

      _.each(result, function(row) {
        var tempCache = {
            trsKey : row.masterTrsKey
          , fieldSet : row.fieldSet
          };

        cache[row.masterCode + row.masterType] = tempCache;
      });

      log.debug("cached word count : " + Object.keys(cache).length, undefined);
      if (callback) {
        callback(cache);
      }
    });
}

/**
 * 初始化
 * 从数据库读取所有内容，并加载到内存
 * @param {Object} req 请求
 * @param {Function} callback 返回缓存的内容
 */
exports.init = function(req, callback) {

  if (_.isEmpty(cache) === true) {

    log.info("master",undefined);

    var handler = new context().bind(req);
    // 从数据库读取内容，并加载到内存
    load(handler, callback);
  } else {
    callback();
  }
};

/**
 * 获取词条的内容，可以通过添加参数替换内容，格式如下
 * @returns {String} 词条的内容
 */
exports.get = function(masterCode, masterType) {

  return  cache[masterCode + masterType];
};
