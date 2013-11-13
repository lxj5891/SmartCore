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
  , modGroup   = require("../modules/mod_group")
  , ctrlGroup   = require("../controllers/ctrl_group");

var SupportedLangs = ["en", "ja", "zh"]
  , extendPropertyPrefix = "ext_";

/**
 * 创建或更新用户（完整）
 * @param {Object} handler 上下文对象
 * @param {Boolean} isInsert true：创建用户，false：更新用户
 * @param {Function} callback(err, user) 回调函数，返回新创建或更新后的用户
 */
function updateCompletely(handler, isInsert, callback) {

  var params = handler.params;
  var updater = handler.uid;
  var isUpdate = !isInsert;

  var user = {};

  // 校验参数
  try {

    // 用户标识
    if(isUpdate) {
      check(params.uid, __("user.error.emptyUid")).notEmpty();
    }

    // 用户名
    if(isInsert) {
      user.userName = params.uid;
      check(user.userName, __("user.error.emptyUserName")).notEmpty();
    }

    // 真实名
    user.first = params.first;
    user.middle = params.middle;
    user.last = params.last;

    // 密码
    user.password = params.password;
    check(user.password, __("user.error.emptyPwd")).notEmpty();
    user.password = auth.sha256(user.password);

    // 所属组一览
    user.groups = params.groups || [];
    if(!util.isArray(user.groups)) {
      user.groups = [user.groups];
    }
    if(user.groups.length === 0) {
      throw __("user.error.emptyGroups");
    }

    // 电子邮件地址
    user.email = params.email;
    check(user.email, __("user.error.emptyEmail")).notEmpty();
    check(user.email, __("user.error.invalidEmail")).isEmail();

    // 语言
    user.lang = params.lang;
    check(user.lang, __("user.error.emptyLang")).notEmpty();
    check(user.lang, __("user.error.notSupportedLang")).isIn(SupportedLangs);

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

  } catch (e) {
    return callback(new errors.BadRequest(e.message));
  }

  var tasks = [];

  // 检查用户标识是否有效
  if(isUpdate) {
    tasks.push(function(cb) {
      modUser.total({"_id": params.uid, "valid": 1}, function(err, count) {
        if(count && count === 0) {
          return cb(new errors.BadRequest(__("user.error.notExist")));
        }
        return cb(err);
      });
    });
  }

  // 检查用户名是否冲突
  if(isInsert) {
    tasks.push(function(cb) {
      modUser.total({"userName": user.userName, "valid": 1}, function(err, count) {
        if(count && count !== 0) {
          return cb(new errors.BadRequest(__("user.error.userNameConflict")));
        }
        return cb(err);
      });
    });
  }

  // 检查所属组是否有效
  _.each(user.groups, function(gid) {
    tasks.push(function(cb) {
      modGroup.total({"_id":gid, "valid": 1}, function(err, count) {
        if(count && count === 0) {
          return cb(new errors.BadRequest(__("group.error.notExist")));
        }

        return cb(err);
      });
    });
  });

  async.waterfall(tasks, function(err) {
    if(err) {
      return callback(err);
    } else {
      if(isInsert) { // 添加用户
        return modUser.add(user, callback);
      } else { // 更新用户
        return modUser.update(params.uid, user, callback);
      }
    }
  });

}

/**
 * 查询某个组下的用户（直下，非递归）
 * @param {String} gid 组标识
 * @param {String} fields 查询的字段
 * @param {String} order 排序字段
 * @param {Function} callback(err, users) 返回用户列表
 */
function getUsersDirectlyInGroup(gid, fields, order, callback) {
  modUser.getList({"groups": gid, "valid":1},
    fields, 0, Number.MAX_VALUE, order, callback);
}

/**
 * 创建用户
 * @param {Object} handler 上下文对象
 * @param {Function} callback(err, user) 回调函数，返回新创建的用户
 */
exports.addUser = function(handler, callback) {

  updateCompletely(handler, true, callback);
};

/**
 * 更新用户
 * @param {Object} handler 上下文对象
 * @param {Function} callback(err, user) 回调函数，返回更新后的用户
 */
exports.updateUser = function(handler, callback) {

  updateCompletely(handler, false, callback);
};

/**
 * 删除用户
 * @param {Object} handler 上下文对象
 * @param {Function} callback(err) 回调函数，返回删除的用户
 */
exports.deleteUser = function(handler, callback) {

  var params = handler.params;

  try {
    check(params.uid, __("user.error.emptyUid")).notEmpty();
  } catch (e) {
    return callback(new errors.BadRequest(e.message));
  }

  var command = {"valid": 0, "updateAt": (new Date().getTime()), "updater": handler.uid};

  modUser.update(params.uid, command, callback);
};

/**
 * 查询用户信息
 * @param {Object} handler 上下文对象
 * @param {Function} callback(err, user) 返回用户信息
 */
exports.getUserDetails = function(handler, callback) {

  var params = handler.params;

  try {
    check(params.uid, __("user.error.emptyUid")).notEmpty();
  } catch (e) {
    return callback(new errors.BadRequest(e.message));
  }

  modUser.get(params.uid, callback);
};

/**
 * 查询某个组下的用户
 * @param {Object} handler 上下文对象
 * @param {Function} callback(err, users) 返回用户列表
 */
exports.getUsersInGroup = function(handler, callback) {

  var params = handler.params;

  var gid = params.groupId;
  var recursive = params.recursive || false;
  var fields = params.fields;
  var order = params.order;

  try {
    check(gid, __("group.error.emptyId")).notEmpty();
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
          groups.concat({"_id": gid});
          _.each(groups, function(group) {
            tasks.push(function(cb) {
              getUsersDirectlyInGroup(group._id, fields, order, function(err, tempUsers) {
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
        getUsersDirectlyInGroup(gid, fields, order, callback);
      }
    }
  });
};

/**
 * 判断用户是否可以登录(用户名和密码是否匹配)
 * @param {Object} handler 上下文对象
 * @param {Function} callback(err, boolean) true|false 返回是否可以登录
 */
exports.canLogin = function(handler, callback) {

  var userName = handler.params.userName;
  var password = handler.params.password;

  modUser.total({"userName": userName, "password": auth.sha256(password), "valid": 1}, function(err, count) {
    callback(err, count === 1);
  });
};

/**
 * 根据指定条件查询用户
 * @param {Object} handler 上下文对象
 * @param <Function> callback(err, users) 回调函数，返回用户列表
 */
exports.searchUsers = function (handler, callback) {

  var params = handler.params;

  var conds = [];

  if(params.userName) { // 用户名
    conds.push({ userName : { $regex : params.userName, $options: "i" } });
  }
  if(params.realName) { // 真实名
    var subCond = { $where: function() {
      var name1 = this.first + this.middle + this.last;
      var name2 = this.last + this.middle + this.first;

      if(name1.indexOf(params.realName) >= 0 || name2.indexOf(params.realName) >= 0) {
        return true;
      }

      return false;
    }};
    conds.push(subCond);
  }
  if(params.email) { // 电子邮件地址
    conds.push({ email : { $regex : params.email, $options: "i" } });
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

/**
 * 检查用户是否已存在
 * @param {Object} handler 上下文对象
 * @param {Function} callback(err, boolean) 返回用户是否已存在
 */
exports.isUserExist = function(handler, callback) {

  var params = handler.params;

  try {
    check(params.uid, __("user.error.emptyUid")).notEmpty();
  } catch (e) {
    return callback(new errors.BadRequest(e.message));
  }

  modUser.total({"_id": params.uid, "valid": 1}, function(err, count) {
    return callback(err, count > 0);
  });

};