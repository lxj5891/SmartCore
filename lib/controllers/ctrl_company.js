/**
 * @file 存取组信息的controller
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var sync      = require("async")
  , check     = require("validator").check
  , errors    = require("../core/errors")
  , log       = require("../core/log")
  , company   = require("../modules/mod_company");

/**
 * 添加公司
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回添加的公司
 * @returns {*} 无
 */
exports.add = function(handler, callback) {

  var params = handler.params
    , uid = handler.uid;

  log.debug("begin: add company.", uid);
  log.debug("company name: " + params.name, uid);
  log.debug("company domain: " + params.domain, uid);

  try {

    // 公司code必须为空
    check(params.code, __("js.ctr.check.company.code.min")).isNull();

    // 公司名不能为空
    check(params.name, __("js.ctr.check.company.name.min")).notEmpty();
    check(params.name, __("js.ctr.check.company.name.max")).len(0, 128);

    // 公司domain不能为空
    check(params.domain, __("js.ctr.check.company.domain.min")).notEmpty();
    check(params.domain, __("js.ctr.check.company.domain.max")).len(0, 128);

    // 公司分类不能为空
    check(params.type, __("js.ctr.check.company.type.min")).notEmpty();
    check(params.type, __("js.ctr.check.company.type.max")).len(0, 2);

  } catch (err) {

    log.error(err.message, uid);
    return callback(new errors.BadRequest(err.message));
  }

  var comp = {};
  comp.name = params.name;
  comp.domain = params.domain;
  comp.type = params.type;
  comp.extend = params.extend;
  comp.createAt = params.createAt || new Date();
  comp.createBy = params.creator || uid;
  comp.updateAt = comp.createAt;
  comp.updateBy = params.updater || uid;

  sync.waterfall([

    // 检查domain的唯一性
    function(done) {

      // 检查domain是否已经存在
      company.getByDomain(comp.domain, function(err, result) {
        if (err) {
          log.error(err, uid);
          return done(new errors.InternalServer(__("js.ctr.common.system.error")));
        }

        if (result) {
          log.error(result, uid);
          return done(new errors.BadRequest(__("js.ctr.check.company.domain")));
        }

        return done();
      });
    },

    // 添加公司
    function(done) {

      company.add(comp, function(err, result) {
        if (err) {
          log.error(err, uid);
          return  done(new errors.InternalServer(__("js.ctr.common.system.error")));
        }

        return done(err, result._doc);
      });
    }

  ], function(err, result) {

    log.debug("finished: add company.", uid);
    return callback(err, result);
  });
};

/**
 * 获取公司一览
 * @param handler
 * @param callback
 */
exports.getList = function(handler ,callback) {

  var params = handler.params
    , uid = handler.uid
    , start = params.start
    , limit = params.limit
    , condition = params.condition
    , order = params.order;

  // 获取件数
  company.total(condition, function(err, count) {
    if (err) {
      log.error(err, uid);
      callback(new errors.InternalServer(err));
      return;
    }

    // 获取一览
    company.getList(condition, start, limit, order, function(err, result) {
      if (err) {
        log.error(err, uid);
        return callback(new errors.InternalServer(err));
      }

      return callback(err,  { totalItems: count, items: result });
    });
  });
};

/**
 * 获取公司一览, 用关键字模糊检索
 * @param handler
 * @param callback
 */
exports.getListByKeyword = function(handler ,callback) {

  var params = handler.params
    , keyword = params.keyword;

  if (keyword) {
    params.addParams("$or", [{ "name": new RegExp(keyword.toLowerCase(), "i") }]);
  }

  exports.getList(handler, callback);
};