/**
 * @file 存取用户信息的controller
 * @author lizheng
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var async       = require("async")
  , _           = require("underscore")
  , check       = require("validator").check
  , auth        = require("../core/auth")
  , constant    = require("../core/constant")
  , errors      = require("../core/errors")
  , util        = require("../core/util")
  , ctrlGroup   = require("../controllers/ctrl_group")
  , modGroup    = require("../modules/mod_group")
  , modUser     = require("../modules/mod_user");

var SupportedLangs = ["en", "ja", "zh"];

/**
 * 创建或更新用户（完整）
 * @param {Object} handler 上下文对象
 * @param {Boolean} isInsert true：创建用户，false：更新用户
 * @param {Function} callback 回调函数，返回新创建或更新后的用户
 */
function updateCompletely(handler, isInsert, callback) {

  var params = handler.params;
  var updateBy = handler.uid;
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
      user.userName = params.userName;
      check(user.userName, __("user.error.emptyUserName")).notEmpty();
    } else {
      user.userName = undefined;
    }

    // 真实名
    user.first = params.first;
    user.middle = params.middle;
    user.last = params.last;

    // 密码
    if(isInsert) {
      user.password = params.password;
      check(user.password, __("user.error.emptyPwd")).notEmpty();
      user.password = auth.sha256(user.password);
    } else {
      user.password = undefined;
    }

    // 所属组一览
    user.groups = params.groups || [];
    if(!util.isArray(user.groups)) {
      user.groups = [user.groups];
    }
    // TODO 用户是否必须属于某个组？
    if(user.groups.length === 0) {
      // throw __("user.error.emptyGroups");
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
    user.extend = params.extend;

    // Common
    var curDate = new Date();
    if(isInsert) {
      user.valid = constant.VALID;
      user.createAt = curDate;
      user.createBy = updateBy;
    } else {
      user.valid = undefined;
      user.createAt = undefined;
      user.createBy = undefined;
    }
    user.updateAt = curDate;
    user.updateBy = updateBy;

  } catch (e) {
    callback(new errors.BadRequest(e.message));
    return;
  }

  var tasks = [];

  // 检查用户标识是否有效
  if(isUpdate) {
    tasks.push(function(done) {
      modUser.total({"_id": params.uid, "valid": constant.VALID}, function(err, count) {
        if(count && count === 0) {
          done(new errors.BadRequest(__("user.error.notExist")));
        } else {
          done(err);
        }
      });
    });
  }

  // 检查用户名是否冲突
  if(isInsert) {
    tasks.push(function(done) {
      modUser.total({"userName": user.userName, "valid": constant.VALID}, function(err, count) {
        if(count && count !== 0) {
          done(new errors.BadRequest(__("user.error.userNameConflict")));
        } else {
          done(err);
        }
      });
    });
  }

  // 检查所属组是否有效
  _.each(user.groups, function(gid) {
    tasks.push(function(done) {
      modGroup.total({"_id":gid, "valid": constant.VALID}, function(err, count) {
        if(count && count === 0) {
          done(new errors.BadRequest(__("group.error.notExist")));
        } else {
          done(err);
        }
      });
    });
  });

  async.waterfall(tasks, function(err) {
    if(err) {
      callback(err);
    } else {
      if(isInsert) { // 添加用户
        modUser.add(user, callback);
      } else { // 更新用户
        modUser.update(params.uid, user, callback);
      }
    }
  });

}

/**
 * 查询某个组下的用户（直下，非递归）
 * @param {String} gid 组标识
 * @param {String} fields 查询的字段
 * @param {String} order 排序字段
 * @param {Function} callback 回调函数，返回用户列表
 */
function getUsersDirectlyInGroup(gid, fields, order, callback) {
  modUser.getList({"groups": gid, "valid": constant.VALID},
    fields, 0, Number.MAX_VALUE, order, callback);
}

/**
 * 创建用户
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回新创建的用户
 */
exports.addUser = function(handler, callback) {

  updateCompletely(handler, true, callback);
};

/**
 * 更新用户
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回更新后的用户
 */
exports.updateUser = function(handler, callback) {

  updateCompletely(handler, false, callback);
};

/**
 * 删除用户
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回删除的用户
 */
exports.removeUser = function(handler, callback) {

  var params = handler.params;

  try {
    check(params.uid, __("user.error.emptyUid")).notEmpty();
  } catch (e) {
    return callback(new errors.BadRequest(e.message));
  }

  var command = {"valid": exports.INVALID, "updateAt": (new Date()), "updateBy": handler.uid};

  return modUser.update(params.uid, command, callback);
};

/**
 * 查询用户信息
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回用户信息
 */
exports.getUserDetails = function(handler, callback) {

  var params = handler.params;

  try {
    check(params.uid, __("user.error.emptyUid")).notEmpty();
  } catch (e) {
    return callback(new errors.BadRequest(e.message));
  }

  return modUser.get(params.uid, callback);
};

/**
 * 查询某个组下的用户
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回用户列表
 */
exports.getUsersInGroup = function(handler, callback) {

  var params = handler.params;

  var gid = params.groupId;
  var recursive = params.recursive || false;
  var fields = params.fields;
  var order = params.order;

  // TODO 需不需要限制返回数目？

  try {
    check(gid, __("group.error.emptyId")).notEmpty();
  } catch (e) {
    callback(new errors.BadRequest(e.message));
    return;
  }

  ctrlGroup.isGroupExist(handler, function(err, exist) {

    if(err) {
      callback(err);
      return;
    }

    if(exist === false) {
      callback(new errors.BadRequest(__("group.error.notExist")));
    } else {
      if(recursive) { // 递归查找
        handler.addParams("groupFields", "_id");
        ctrlGroup.getSubGroups(handler, function(err, groups) {
          if(err) {
            callback(err);
            return;
          }

          var tasks = [];
          var users = [];
          groups.concat({"_id": gid});
          _.each(groups, function(group) {
            tasks.push(function(done) {
              getUsersDirectlyInGroup(group._id, fields, order, function(err, tempUsers) {
                if(tempUsers) {
                  users.concat(tempUsers);
                }
                done(err);
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
 * @param {Function} callback 回调函数，返回是否可以登录
 */
exports.canLogin = function(handler, callback) {

  var userName = handler.params.userName;
  var password = handler.params.password;

  modUser.total({"userName": userName, "password": auth.sha256(password), "valid": constant.VALID}, function(err, count) {
    callback(err, count === 1);
  });
};

/**
 * 根据指定条件查询用户
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回用户列表
 */
exports.searchUsers = function (handler, callback) {

  var params = handler.params;

  var conditions = [];

  if(params.userName) { // 用户名
    conditions.push({ userName : { $regex : params.userName, $options: "i" } });
  }
  if(params.realName) { // 真实名
    var subCondition = { $where: function() {

      var first = (this.first || "");
      var middle = (this.middle || "");
      var last = (this.last || "");

      var name1 = first + middle + last;
      var name2 = last + middle + first;

      return (name1.indexOf(params.realName) >= 0 || name2.indexOf(params.realName) >= 0);
    }};
    conditions.push(subCondition);
  }
  if(params.email) { // 电子邮件地址
    conditions.push({ email : { $regex : params.email, $options: "i" } });
  }

  var fields = params.fields;
  var skip = params.skip || 0;
  var limit = params.limit || constant.MOD_DEFAULT_LIMIT;
  var order = params.order;

  if(conditions.length === 0) {
    callback(new errors.BadRequest(__("user.error.emptySearchCondition")));
  } else {
    modUser.getList({$and : conditions}, fields, skip, limit, order, callback);
  }

};

/**
 * 检查用户是否已存在
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回用户是否已存在
 */
exports.isUserExist = function(handler, callback) {

  var params = handler.params;

  try {
    check(params.uid, __("user.error.emptyUid")).notEmpty();
  } catch (e) {
    callback(new errors.BadRequest(e.message));
    return;
  }

  modUser.total({"_id": params.uid, "valid": constant.VALID}, function(err, count) {
    callback(err, count > 0);
  });
};