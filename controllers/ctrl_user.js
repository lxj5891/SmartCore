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
  , ctrlGroup   = require("../controllers/ctrl_group")
  , modGroup    = require("../modules/mod_group")
  , modUser     = require("../modules/mod_user")
  , __          = global.__;

/**
 * 将ObjectId转为字符串
 */
function objIdToStr(obj) {
  if(obj) {
    return obj.toString();
  } else {
    return obj;
  }
}

/**
 * 创建或更新用户（完整）
 * @param {Object} handler 上下文对象
 * @param {Boolean} isInsert true：创建用户，false：更新用户
 * @param {Function} callback 回调函数，返回新创建或更新后的用户
 */
function updateCompletely(handler, isInsert, callback) {

  var code = handler.code;
  var params = handler.params;
  var updateBy = handler.uid;
  var isUpdate = !isInsert;

  var user = {};

  // 校验参数
  try {

    // 用户标识
    if(isUpdate) {
      params.uid = objIdToStr(params.uid);
      check(params.uid, __("user.error.emptyUid")).notEmpty();
    }

    // 用户名
    if(isInsert) {
      user.userName = params.userName;
      check(user.userName, __("user.error.emptyUserName")).notEmpty();
    }

    // 真实名
    user.first = params.first || "";
    user.middle = params.middle || "";
    user.last = params.last || "";

    // 密码
    // TODO 密码如何修改？
    user.password = params.password;
    check(user.password, __("user.error.emptyPwd")).notEmpty();

    // 所属组一览
    user.groups = params.groups || [];
    if(!util.isArray(user.groups)) {
      user.groups = [user.groups];
    }
    // TODO 用户是否必须属于某个组？
    if(user.groups.length === 0) {
      // throw __("user.error.emptyGroups");
    }
    // 将ObjectId转化为String
    for(var i = 0; i < user.groups.length; i++) {
      user.groups[i] = user.groups[i].toString();
    }

    // 电子邮件地址
    user.email = params.email;
    check(user.email, __("user.error.emptyEmail")).notEmpty();
    check(user.email, __("user.error.invalidEmail")).isEmail();

    // 语言
    user.lang = params.lang;
    check(user.lang, __("user.error.emptyLang")).notEmpty();
    check(user.lang, __("user.error.notSupportedLang")).isIn(constant.SUPPORTED_LANGS);

    // 时区 TODO : 检查时区有效性
    user.timezone = params.timezone;
    check(user.timezone, __("user.error.emptyTimezone")).notEmpty();

    // 状态
    user.status = params.status;

    // 扩展属性
    if(params.extend) {
      user.extend = params.extend;
    }

    // Common
    var curDate = new Date();
    if(isInsert) {
      user.valid = constant.VALID;
      user.createAt = curDate;
      user.createBy = updateBy;
    }
    user.updateAt = curDate;
    user.updateBy = updateBy;

  } catch (e) {
    log.error(e.message, handler.uid);
    callback(new errors.BadRequest(e.message));
    return;
  }

  var tasks = [];

  // 检查用户名是否冲突
  if(isInsert) {
    tasks.push(function(done) {
      modUser.total(code, {"userName": user.userName, "valid": constant.VALID}, function(err, count) {
        if(count !== 0) {
          return done(new errors.BadRequest(__("user.error.userNameConflict")));
        }

        return done(err);
      });
    });
  }

  // 检查所属组是否有效
  _.each(user.groups, function(gid) {
    tasks.push(function(done) {
      modGroup.total(code, {"_id": gid, "valid": constant.VALID}, function(err, count) {
        if(count === 0) {
          return done(new errors.BadRequest(__("group.error.notExist")));
        }

        return done(err);
      });
    });
  });

  async.waterfall(tasks, function(err) {

    if(err) {
      log.error(err, handler.uid);
      if(err instanceof errors.BadRequest) {
        callback(err);
        return;
      } else {
        callback(new errors.InternalServer(err));
        return;
      }
    }

    if(isInsert) { // 添加用户
      modUser.add(code, user, function(err, result) {
        if(err) {
          log.error(err, handler.uid);
          return callback(new errors.InternalServer(err));
        }
        return callback(err, result);
      });
    } else { // 更新用户
      modUser.update(code, params.uid, user, function(err, result) {
        if(err) {
          log.error(err, handler.uid);
          return callback(err);
        }

        if(result) {
          return callback(err, result);
        } else {
          return callback(new errors.NotFound(__("user.error.notExist")));
        }
      });
    }
  });

}

/**
 * 查询组下的用户（直下，非递归）
 * @param {Object} handler 上下文对象
 * @param {Array} gids 组标识列表
 * @param {Function} callback 回调函数，返回用户列表
 */
function getUsersInGroups(handler, gids, callback) {

  var code = handler.code;
  var uid = handler.uid;
  var params = handler.params;

  var fields = params.fields;
  var skip = params.fields || 0;
  var limit = params.limit || constant.MOD_DEFAULT_LIMIT;
  var order = params.order;

  var condition = {"groups": {$in: gids}, "valid": constant.VALID};

  modUser.total(code, condition, function(err, count) {
    if(err) {
      log.error(err, uid);
      callback(new errors.InternalServer(err));
      return;
    }

    if(count === 0) {
      callback(err, { totalItems: count, items: [] });
      return;
    }

    modUser.getList(code, condition, fields, skip, limit, order, function(err, result) {
      if(err) {
        log.error(err, uid);
        return callback(new errors.InternalServer(err));
      }

      // TODO 一个用户可能属于多个组，所以返回时需要distinct

      return callback(err, { totalItems: count, items: result });
    });

  });
}

/**
 * 创建用户
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回新创建的用户
 */
exports.add = function(handler, callback) {

  updateCompletely(handler, true, callback);
};

/**
 * 更新用户
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回更新后的用户
 */
exports.update = function(handler, callback) {

  updateCompletely(handler, false, callback);
};

/**
 * 删除用户
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回删除的用户
 */
exports.remove = function(handler, callback) {

  var code = handler.code;
  var params = handler.params;

  var command = {"valid": constant.INVALID, "updateAt": (new Date()), "updateBy": handler.uid};

  return modUser.update(code, params.uid, command, function(err, result) {
    if(err) {
      log.error(err, handler.uid);
      return callback(new errors.InternalServer(err));
    } else {
      return callback(err, result);
    }
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
    if(err) {
      log.error(err, handler.uid);
      return callback(new errors.InternalServer(err));
    }

    if(result) {
      return callback(err, result);
    } else {
      return callback(new errors.NotFound(__("user.error.notExist")));
    }
  });
};

/**
 * 查询某个组下的用户
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回用户列表
 */
exports.getUsersInGroup = function(handler, callback) {

  var params = handler.params;
  var gid = params.gid;
  var recursive = params.recursive;

  ctrlGroup.exist(handler, function(err, exist) {

    if(err) {
      log.error(err, handler.uid);
      callback(new errors.InternalServer(err));
      return;
    }

    if(exist === false) {
      callback(new errors.BadRequest(__("group.error.notExist")));
      return;
    }

    if(recursive === true) { // 递归查找
      handler.addParams("groupFields", "_id");
      ctrlGroup.getSubGroups(handler, function(err, groups) {
        if(err) {
          log.error(err, handler.uid);
          return callback(new errors.InternalServer(err));
        }

        var gids = [gid];
        _.each(groups, function(group) {
          gids.push(group._id);
        });

        return getUsersInGroups(handler, gids, callback);
      });
    } else {
      getUsersInGroups(handler, gid, callback);
    }
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

  if(params.userName) { // 用户名
    conditions.push({ userName : { $regex : params.userName, $options: "i" } });
  }

  if(params.realName) { // 真实名
    var subCondition1 = { $where: "(this.first + this.middle + this.last).indexOf('" + params.realName + "') >= 0"};
    var subCondition2 = { $where: "(this.last + this.middle + this.first).indexOf('" + params.realName + "') >= 0"};
    conditions.push(subCondition1);
    conditions.push(subCondition2);
  }

  if(params.email) { // 电子邮件地址
    conditions.push({ email : { $regex : params.email, $options: "i" } });
  }

  if(conditions.length === 0) {
    callback(new errors.BadRequest(__("user.error.emptySearchCondition")));
    return;
  }

  if(params.and === false) {
    conditions = {$or : conditions};
  } else {
    conditions = {$and : conditions};
  }

  modUser.total(code, conditions, function(err, count) {
    if(err) {
      log.error(err, handler.uid);
      callback(new errors.InternalServer(err));
      return;
    }

    if(count === 0) {
      callback(err, { totalItems: count, items: [] });
      return;
    }

    var fields = params.fields;
    var skip = params.skip || 0;
    var limit = params.limit || constant.MOD_DEFAULT_LIMIT;
    var order = params.order;

    modUser.getList(code, conditions, fields, skip, limit, order, function(err, result) {
      if(err) {
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

    if(err) {
      log.error(err, handler.uid);
      return callback(new errors.InternalServer(err));
    } else {
      return callback(err, count > 0);
    }
  });
};