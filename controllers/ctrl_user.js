/**
 * @file 存取用户信息的controller
 * @author lizheng
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var smart     = require("smartcore")
  , _         = smart.util.underscore
  , check     = smart.util.validator.check
  , async     = smart.util.async
  , errors    = smart.framework.errors
  , auth      = smart.framework.auth
  , util      = smart.framework.util
  , modUser   = require("../modules/mod_user")
  , ctrlGroup   = require("../controllers/ctrl_group");

var Supportedlangs = ["en", "ja", "zh"];
var extendPropertyPrefix = "ext_";

/**
 * 创建或更新用户（完整）
 * @param {Object} handler 上下文对象
 * @param {Boolean} isInsert true：创建用户，false：更新用户
 * @param {Function} callback(err) 回调函数，返回异常信息
 */
function updateCompletely(handler, isInsert, callback) {

  var params = handler.params;
  var updater = handler.uid;

  var user = {};

  // 校验参数
  try {
    // 用户标识
    user.uid = params.uid;
    check(user.uid, __("user.error.emptyUid")).notEmpty();

    // 用户名
    user.first = params.first;
    user.middle = params.middle;
    user.last = params.last;

    // 密码
    user.password = params.password;
    check(user.password, __("user.error.emptyPwd")).notEmpty();
    user.password = auth.sha256(user.password);

    // 所属组一览
    user.group = params.group || [];
    if(!util.isArray(user.group)) {
      user.group = [user.group];
    }
    if(user.group.length === 0) {
      throw __("user.error.emptyGroup");
    }

    // 电子邮件地址
    user.email = params.email;
    check(user.email, __("user.error.emptyEmail")).notEmpty();
    check(user.email, __("user.error.invalidEmail")).isEmail();

    // 语言
    user.lang = params.lang;
    check(user.lang, __("user.error.emptyLang")).notEmpty();
    check(user.lang, __("user.error.notSupportedLang")).isIn(Supportedlangs);

    // 时区 TODO : 检查时区有效性
    user.timezone = params.timezone;
    check(user.timezone, __("user.error.emptyTimezone")).notEmpty();

    // 状态
    user.status = params.status;

    // 扩展属性
    user.extend = {};
    _.each(params, function(val, key) {
      if(key.indexOf(extendPropertyPrefix) === 0) {
        user.extend[key] = val;
      }
    });

    // Common
    if(isInsert) {
      user.valid = 1;
      user.createAt = new Date().getTime();
      user.creator = updater;
    }
    user.updateAt = new Date().getTime();
    user.updater = updater;

    var tasks = [];

    // 检查用户存在性
    tasks.push(function(cb) {
      exports.isUserExist(handler, function(err, exist) {
        if(isInsert) { // 添加用户
          if(exist === true) {
            return cb(new errors.BadRequest(__("user.error.uidConflict")));
          }
        } else { // 更新用户
          if(exist === false) {
            return cb(new errors.BadRequest(__("user.error.notExist")));
          }
        }

        return cb(err);
      });
    });

    // 检查所属组是否有效
    _.each(user.group, function(groupId) {
      tasks.push(function(cb) {
        handler.addParams("groupId", groupId);
        ctrlGroup.isGroupExist(handler, function(err, exist) {
          if(exist === false) {
            return cb(new errors.BadRequest(__("group.error.notExist")));
          } else {
            return cb(err);
          }
        });
      });
    });

    async.waterfall(tasks, function(err) {
      if(err) {
        if(err instanceof errors.BadRequest) {
          return callback(err);
        } else {
          return handler.pitch(err); // TODO
        }
      } else {
        if(isInsert) { // 添加用户
          return modUser.add(user, callback);
        } else { // 更新用户
          return modUser.update(user.uid, user, callback);
        }
      }
    });

  } catch (e) {
    return callback(new errors.BadRequest(e.message));
  }

}

/**
 * 查询某个组下的用户（直下，非递归）
 * @param {String} groupId 组标识
 * @param {String} fields 查询的字段
 * @param {String} order 排序字段
 * @param {Function} callback(err, users) 返回用户列表
 */
function getUsersDirectlyInGroup(groupId, fields, order, callback) {
  modUser.getList({"group": groupId, "valid":1},
    fields, 0, Number.MAX_VALUE, order, callback);
}

/**
 * 创建用户
 * @param {Object} handler 上下文对象
 * @param {Function} callback(err) 回调函数，返回异常信息
 */
exports.addUser = function(handler, callback) {

  updateCompletely(handler, true, callback);
};

/**
 * 检查用户是否已存在
 * @param {Object} handler 上下文对象
 * @param {Function} callback(err, boolean)
 */
exports.isUserExist = function(handler, callback) {

  try {
    check(handler.params.uid, __("user.error.emptyUid")).notEmpty();

    modUser.total({"uid": handler.params.uid, "valid": 1}, function(err, count) {
      return callback(err, count > 0);
    });
  } catch (e) {
    return callback(new errors.BadRequest(e.message));
  }
};

/**
 * 更新用户
 * @param {Object} handler 上下文对象
 * @param {Function} callback(err) 回调函数，返回异常信息
 */
exports.updateUser = function(handler, callback) {

  updateCompletely(handler, false, callback);
};

/**
 * 删除用户
 * @param {Object} handler 上下文对象
 * @param {Function} callback(err) 回调函数，返回异常信息
 */
exports.deleteUser = function(handler, callback) {

  try {
    check(handler.params.uid, __("user.error.emptyUid")).notEmpty();

    var newUser = {"valid": 0, "updateAt": (new Date().getTime()), "updater": handler.uid};

    modUser.update(handler.params.uid, newUser, callback);
  } catch (e) {
    return callback(new errors.BadRequest(e.message));
  }
};

/**
 * 查询用户信息
 * @param {Object} handler 上下文对象
 * @param {Function} callback(err, user) 返回用户信息
 */
exports.getUserDetails = function(handler, callback) {

  try {
    check(handler.params.uid, __("user.error.emptyUid")).notEmpty();

    modUser.get(handler.params.uid, callback);
  } catch (e) {
    return callback(new errors.BadRequest(e.message));
  }
};

/**
 * 查询某个组下的用户
 * @param {Object} handler 上下文对象
 * @param {Function} callback(err, users) 返回用户列表
 */
exports.getUsersInGroup = function(handler, callback) {

  var params = handler.params;

  var groupId = params.groupId;
  var recursive = params.recursive || false;
  var fields = params.fields;
  var order = params.order;

  try {
    check(groupId, __("group.error.emptyId")).notEmpty();
  } catch (e) {
    return callback(new errors.BadRequest(e.message));
  }

  ctrlGroup.isGroupExist(handler, function(err, exist) {

    if(err) {
      callback(err);
    }

    if(exist === false) {
      return callback(new errors.BadRequest(__("group.error.notExist")));
    } else {
      if(recursive) { // 递归查找
        handler.addParams("groupFields", "_id");
        ctrlGroup.getSubGroups(handler, function(err, groups) {
          if(err) {
            callback(err);
          }

          var tasks = [];
          var users = [];
          _.each(groups, function(group) {
            tasks.push(function(cb) {
              getUsersDirectlyInGroup(group, fields, order, function(err, tempUsers) {
                if(tempUsers) {
                  users.concat(tempUsers);
                }
                cb(err);
              });
            });
          });

          async.waterfall(tasks, function(err) {
            callback(err, users);
          });

        });
      } else {
        getUsersDirectlyInGroup(groupId, fields, order, callback);
      }
    }
  });
};

/**
 * 判断用户是否可以登录
 * @param {Object} handler 上下文对象
 * @param {Function} callback(err, boolean) true|false 返回是否可以登录
 */
exports.isAccessible = function(handler, callback) {

  try {
    var uid = handler.params.uid;
    var password = handler.params.password;

    check(uid, __("user.error.emptyUid")).notEmpty();
    check(password, __("user.error.emptyUid")).notEmpty();

    modUser.total({"uid": uid, "password": auth.sha256(password), "valid": 1}, function(err, count) {
      callback(err, count === 1);
    });
  } catch (e) {
    return callback(new errors.BadRequest(e.message));
  }
};

/**
 * 根据指定条件查询用户
 * @param {Object} handler 上下文对象
 * @param <Function> callback(err, users) 回调函数，返回用户列表
 */
exports.searchUsers = function (handler, callback) {

  var params = handler.params;

  var conds = [];

  if(params.uid) { // 用户标识
    conds.push({ uid : { $regex : params.uid, $options: "i" } });
  }
  if(params.name) { // 用户名
    var subCond = { $where: function() {
      var name1 = this.first + this.middle + this.last;
      var name2 = this.last + this.middle + this.first;

      if(name1.indexOf(params.name) >= 0 || name2.indexOf(params.name) >= 0) {
        return true;
      }

      return false;
    }};
    conds.push(subCond);
  }
  if(params.email) { // 电子邮件地址
    conds.push({ message : { $regex : params.email, $options: "i" } });
  }

  var fields = params.fields;
  var skip = params.skip;
  var limit = params.limit;
  var order = params.order;

  if(conds.length === 0) {
    callback(new errors.BadRequest(__("user.error.emptySearchCondition")));
  } else {
    modUser.getList({$and : conds}, fields, skip, limit, order, callback);
  }

};