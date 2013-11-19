/**
 * @file 存取用户信息的controller
 * @author lizheng
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var _           = require("underscore")
  , async       = require("async")
  , check       = require("validator").check
  , constant    = require("../core/constant")
  , errors      = require("../core/errors")
  , log         = require("../core/log")
  , util        = require("../core/util")
  , modUser     = require("../modules/mod_user")
  , __          = global.__;

/**
 * 创建用户
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回新创建的用户
 */
exports.add = function(handler, callback) {

  var code = handler.code;
  var params = handler.params;

  var user = {};

  // 校验参数
  try {

    // 用户名
    user.userName = params.userName;
    check(user.userName, __("user.error.emptyUserName")).notEmpty();
    check(user.userName, __("user.error.nameTooLong")).len(0, 128);

    // 真实名
    if (params.first) {
      user.first = params.first;
    }
    if (params.middle) {
      user.middle = params.middle;
    }
    if (params.last) {
      user.last = params.last;
    }

    // 密码
    user.password = params.password;
    check(user.password, __("user.error.emptyPwd")).notEmpty();

    // 所属组一览
    user.groups = params.groups || [];
    if (!util.isArray(user.groups)) {
      user.groups = [user.groups];
    }

    // 电子邮件地址
    user.email = params.email;
    check(user.email, __("user.error.emptyEmail")).notEmpty();
    check(user.email, __("user.error.invalidEmail")).isEmail();

    // 语言
    user.lang = params.lang;
    check(user.lang, __("user.error.emptyLang")).notEmpty();

    // 时区 TODO : 检查时区有效性
    user.timezone = params.timezone;
    check(user.timezone, __("user.error.emptyTimezone")).notEmpty();

    // 状态
    user.status = params.status;

    // 扩展属性
    if (params.extend) {
      user.extend = params.extend;
    }

    // Common
    var curDate = new Date();
    user.valid = constant.VALID;
    user.createAt = curDate;
    user.createBy = handler.uid;
    user.updateAt = curDate;
    user.updateBy = handler.uid;

  } catch (e) {
    log.error(e.message, handler.uid);
    callback(new errors.BadRequest(e.message));
    return;
  }

  var tasks = [];

  // 检查用户名是否冲突
  tasks.push(function(done) {
    modUser.total(code, {"userName": user.userName}, function(err, count) {

      if (err) {
        return done(new errors.InternalServer(err));
      }

      if (count !== 0) {
        return done(new errors.BadRequest(__("user.error.userNameConflict")));
      }

      return done(err);
    });
  });

  async.waterfall(tasks, function(err) {

    if (err) {
      log.error(err, handler.uid);
      callback(err);
      return;
    }

    modUser.add(code, user, function(err, result) {
      if (err) {
        log.error(err, handler.uid);
        return callback(new errors.InternalServer(err));
      }

      log.info("finished: add user " + result._id + " .", handler.uid);

      return callback(err, result);
    });
  });
};

/**
 * 更新用户
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回更新后的用户
 */
exports.update = function(handler, callback) {

  var code = handler.code;
  var params = handler.params;

  var user = {};

  // 校验参数
  try {

    // 真实名
    if (params.first) {
      user.first = params.first;
    }
    if (params.middle) {
      user.middle = params.middle;
    }
    if (params.last) {
      user.last = params.last;
    }

    // 密码
    if (params.password) {
      user.password = params.password;
    }

    // 所属组一览
    if (params.groups) {
      user.groups = params.groups;
      if (!util.isArray(user.groups)) {
        user.groups = [user.groups];
      }
    }

    // 电子邮件地址
    if (params.email) {
      user.email = params.email;
      check(user.email, __("user.error.invalidEmail")).isEmail();
    }

    // 语言
    if (params.lang) {
      user.lang = params.lang;
    }

    // 时区 TODO : 检查时区有效性
    if (params.timezone) {
      user.timezone = params.timezone;
    }

    // 状态
    if (params.status) {
      user.status = params.status;
    }

    // 扩展属性
    if (params.extend) {
      user.extend = params.extend;
    }

    // Common
    user.updateAt = new Date();
    user.updateBy = handler.uid;

  } catch (e) {
    log.error(e.message, handler.uid);
    callback(new errors.BadRequest(e.message));
    return;
  }

  modUser.update(code, params.uid, user, function(err, result) {
    if (err) {
      log.error(err, handler.uid);
      return callback(new errors.InternalServer(err));
    }

    if (result) {

      log.info("finished: update user " + result._id + " .", handler.uid);

      return callback(err, result);
    }

    return callback(new errors.NotFound(__("user.error.notExist")));
  });
};

/**
 * 删除用户
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回删除的用户
 */
exports.remove = function(handler, callback) {

  var code = handler.code;
  var params = handler.params;

  var newUser = {"valid": constant.INVALID, "updateAt": (new Date()), "updateBy": handler.uid};

  return modUser.update(code, params.uid, newUser, function(err, result) {

    if (err) {
      log.error(err, handler.uid);
      return callback(new errors.InternalServer(err));
    }

    if (result) {

      log.info("finished: remove user " + result._id + " .", handler.uid);

      return callback(err, result);
    }

    return callback(new errors.NotFound(__("user.error.notExist")));
  });
};

/**
 * 根据用户标识查询用户信息
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回用户信息
 */
exports.get = function(handler, callback) {

  var code = handler.code;
  var uid = handler.params.uid;

  return modUser.get(code, uid, function(err, result) {
    if (err) {
      log.error(err, handler.uid);
      return callback(new errors.InternalServer(err));
    }

    if (result) {

      return callback(err, result);
    }

    return callback(new errors.NotFound(__("user.error.notExist")));
  });
};

/**
 * 根据指定条件查询用户
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回用户列表
 */
exports.getListByKeywords = function (handler, callback) {

  var code = handler.code;
  var params = handler.params;

  var conditions = [];

  // 用户名
  if (params.userName) {
    conditions.push({ userName : { $regex : params.userName, $options: "i" } });
  }

  // 真实名
  if (params.realName) {
    var subCondition1 = { $where: "new RegExp('" + params.realName + "', 'i')" +
      ".test((this.first || '') + (this.middle || '') + (this.last || ''))"};
    var subCondition2 = { $where: "new RegExp('" + params.realName + "', 'i')" +
      ".test((this.last || '') + (this.middle || '') + (this.first || ''))"};
    conditions.push(subCondition1);
    conditions.push(subCondition2);
  }

  // 电子邮件地址
  if (params.email) {
    conditions.push({ email : { $regex : params.email, $options: "i" } });
  }

  if (conditions.length === 0) {
    callback(new errors.BadRequest(__("user.error.emptySearchCondition")));
    return;
  }

  if (params.and === false) {
    conditions = {$or : conditions};
  } else {
    conditions = {$and : conditions};
  }

  modUser.total(code, conditions, function(err, count) {
    if (err) {
      log.error(err, handler.uid);
      callback(new errors.InternalServer(err));
      return;
    }

    if (count === 0) {
      callback(err, { totalItems: count, items: [] });
      return;
    }

    var skip = params.skip || 0;
    var limit = params.limit || constant.MOD_DEFAULT_LIMIT;
    var order = params.order;

    modUser.getList(code, conditions, skip, limit, order, function(err, result) {
      if (err) {
        log.error(err, handler.uid);
        return callback(new errors.InternalServer(err));
      }

      return callback(err, { totalItems: count, items: result });
    });

  });

};

/**
 * 检查用户是否已存在
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回用户是否已存在
 */
exports.exist = function(handler, callback) {

  var code = handler.code;
  var uid = handler.params.uid;

  modUser.total(code, {"_id": uid, "valid": constant.VALID}, function(err, count) {

    if (err) {
      log.error(err, handler.uid);
      return callback(new errors.InternalServer(err));
    }

    return callback(err, count > 0);
  });
};