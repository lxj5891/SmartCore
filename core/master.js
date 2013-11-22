/**
 * @file 分类master
 * @author sl_say@hotmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

/**
 * 缓存master
 */
var cache = {};

/**
 * 获取指定key的master的内容
 * @param {String} masterType 类型
 * @param {String} masterCode 分类Code
 * @returns {Object} 指定key的master的内容
 */
exports.get = function(masterType, masterCode) {

  return  cache[masterCode + masterType];
};

/**
 * 更新一个master
 * @param {String} key 指定的Master Key
 * @param {Object} masterContent 指定Key的master内容
 */
exports.update = function(key, masterContent) {

  cache[key] = masterContent;
};

/**
 * 删除一个master
 * @param {String} key 指定的Master Key
 */
exports.delete = function(key) {

  delete cache[key] ;
};

///**
// * 将所有的master内容缓存到内存里
// * @param {Object} handler 上下文对象
// * @param {Function} callback 缓存的内容
// */
//function load(handler, callback) {
//
//  var condition = { };
//  handler.addParams("condition", condition);
//  handler.addParams("limit", Number.MAX_VALUE);
//
//  master.getList(handler, function(err, result) {
//      if (err) {
//        return log.error(err, handler.uid);
//      }
//
//      _.each(result, function(row) {
//        var tempCache = {
//            trsKey : row.masterTrsKey
//          , fieldSet : row.fieldSet
//          };
//
//        cache[row.masterType + row.masterCode] = tempCache;
//      });
//
//      log.debug("cached word count : " + Object.keys(cache).length, undefined);
//      if (callback) {
//        callback(cache);
//      }
//    });
//}

///**
// * 初始化
// * 从数据库读取所有内容，并加载到内存
// * @param {Object} req 请求
// * @param {Function} callback 返回缓存的内容
// */
//exports.init = function(req, callback) {
//
//  if (_.isEmpty(cache) === true) {
//
//    log.info("master",undefined);
//
//    var handler = new context().bind(req);
//    // 从数据库读取内容，并加载到内存
//    load(handler, callback);
//  } else {
//    callback();
//  }
//};

///**
// * 重新加载缓存的所有master
// * @param {Object} req 请求
// * @param {Function} callback 返回缓存的内容
// */
//exports.reload = function(req, callback) {
//
//  var handler = new context().bind(req);
//  load(handler, callback);
//};


