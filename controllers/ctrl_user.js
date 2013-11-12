/**
 * @file 存取用户信息的controller
 * @author r2space@gmail.com
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
  , modUser   = require("../modules/mod_user2")
  , ctrlGroup   = require("../controllers/ctrl_group2");

var Supportedlangs = ["en", "ja", "zh"];
var extendPropertyPrefix = "ext_";
var groupDelimiter = ":";

/**
 * 检查是否是有效的扩展属性
 * @param {String} key 键
 * @param {String} value 值
 * @param {Boolean} true|false
 */
function isValidExtendProperty(key, value) {
  // TODO : 查询 Masetr 配置
  return true;
}

/**
 * 检查是否包含部门组
 * @param {String} key 键
 * @param {String} value 值
 * @param {Boolean} true|false
 */
function containsDeptGroup(groups) {
  for(var i = 0; i < groups.length; i++) {
    if(groups[i].split(groupDelimiter)[0] === ctrlGroup.GroupType_Dept) {
      return true;
    }
  }

  return false;
}

/**
 * 检查用户是否已存在
 * @param {String} uid 用户标识
 * @param {Function} callback(err, boolean)
 */
function isUserExist(uid, callback) {
  modUser.count({"uid": uid, "valid": 1}, function(err, count) {
    return callback(err, count > 0);
  });
}

/**
 * 创建或更新用户（完整）
 * @param {Object} handler 上下文对象
 * @param {Boolean} isInsert true：创建用户，false：更新用户
 * @param {Function} callback(err) 回调函数，返回异常信息
 */
function updateCompletely(handler, isInsert, callback) {

  var params = handler.params;
  var updator = handler.uid;

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
    user.group = params.group;
    if(user.group) {
      if(!util.isArray(user.group)) {
        user.group = [user.group];
      }
      if(!containsDeptGroup(user.group)) {
        throw __("user.error.noDeptGroup");
      }
    } else {
      throw __("user.error.emptyGroup");
    }

    // 电子邮件地址
    user.email = params.email;
    check(user.email, __("user.error.emptyEmail")).notEmpty();
    check(user.email, __("user.error.invalidEmail")).len(6,64).isEmail();

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
        if(isValidExtendProperty(key, val)) {
          user.extend[key] = val;
        } else {
          throw _.template(__("user.error.invalidExtProperty"), {"key": key, "val": val});
        }
      }
    });

    // Common
    if(isInsert) {
      user.valid = 1;
      user.createAt = new Date().getTime();
      user.creator = updator;
    }
    user.updateAt = new Date().getTime();
    user.updater = updator;

    var tasks = [];

    // 检查用户存在性
    tasks.push(function(cb) {
      isUserExist(user.uid, function(err, exist) {
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
    _.each(user.group, function(group) {
      var arr = group.split(groupDelimiter);
      var groupType = arr[0];
      var groupId = arr[1];
      tasks.push(function(cb) {
        ctrlGroup.isGroupExist(groupId, groupType, function(err, exist) {
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
          return handler.pitch(err);
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
 * @param {String} groupType 组类型
 * @param {Boolean} recursive 是否递归查找
 * @param {Boolean} fields 查询的字段
 * @param {Boolean} order 排序字段
 * @param {Function} callback(err, users) 返回用户列表
 */
function getUsersDirectlyInGroup(groupId, groupType, fields, order, callback) {
  modUser.getList({"group": (groupType + groupDelimiter + groupId), "valid":1},
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
 * 更新用户（按需）
 * @param {Object} handler 上下文对象
 * @param {Function} callback(err) 回调函数，返回异常信息
 */
exports.updateUserOnDemand = function(handler, callback) {

  var params = handler.params;
  var updator = handler.uid;

  var user = {};

  // 校验参数
  try {
    // 用户标识
    user.uid = params.uid;
    check(user.uid, __("user.error.emptyUid")).notEmpty();

    // 用户名
    if(params.first) {
      user.first = params.first;
    }
    if(params.middle) {
      user.middle = params.middle;
    }
    if(params.last) {
      user.last = params.last;
    }

    // 密码
    if(params.password) {
      user.password = params.password;
      check(user.password, __("user.error.emptyPwd")).notEmpty();
      user.password = auth.sha256(user.password);
    }

    // 所属组一览
    if(params.group) {
      user.group = params.group;
      if(!util.isArray(user.group)) {
        user.group = [user.group];
      }
      if(!containsDeptGroup(user.group)) {
        throw __("user.error.noDeptGroup");
      }
    }

    // 电子邮件地址
    if(params.email) {
      user.email = params.email;
      check(user.email, __("user.error.emptyEmail")).notEmpty();
      check(user.email, __("user.error.invalidEmail")).len(6,64).isEmail();
    }

    // 语言
    if(params.lang) {
      user.lang = params.lang;
      check(user.lang, __("user.error.emptyLang")).notEmpty();
      check(user.lang, __("user.error.notSupportedLang")).isIn(Supportedlangs);
    }

    // 时区 TODO : 检查时区有效性
    if(params.timezone) {
      user.timezone = params.timezone;
      check(user.timezone, __("user.error.emptyTimezone")).notEmpty();
    }

    // 状态
    if(params.status) {
      user.status = params.status;
    }

    // 扩展属性
    user.extend = {};
    _.each(params, function(val, key) {
      if(key.indexOf(extendPropertyPrefix) === 0) {
        if(isValidExtendProperty(key, val)) {
          user.extend[key] = val;
        } else {
          throw _.template(__("user.error.invalidExtProperty"), {"key": key, "val": val});
        }
      }
    });
    if(Object.keys(user.extend).length === 0) {
      user.extend = undefined;
    }

    // Common
    user.updateAt = new Date().getTime();
    user.updater = updator;

    var tasks = [];

    // 检查用户存在性
    tasks.push(function(cb) {
      isUserExist(user.uid, function(err, exist) {
        if(exist === false) {
          return cb(new errors.BadRequest(__("user.error.notExist")));
        }

        return cb(err);
      });
    });

    // 检查所属组是否有效
    _.each(user.group, function(group) {
      var arr = group.split(groupDelimiter);
      var groupType = arr[0];
      var groupId = arr[1];
      tasks.push(function(cb) {
        ctrlGroup.isGroupExist(groupId, groupType, function(err, exist) {
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
          return handler.pitch(err);
        }
      } else {
        return modUser.update(user.uid, user, callback);
      }
    });

  } catch (e) {
    return callback(new errors.BadRequest(e.message));
  }

};

/**
 * 查询某个组下的用户
 * @param {String} groupId 组标识
 * @param {String} groupType 组类型
 * @param {Boolean} recursive 是否递归查找
 * @param {Boolean} fields 查询的字段
 * @param {Boolean} order 排序字段
 * @param {Function} callback(err, users) 返回用户列表
 */
exports.getUsersInGroup = function(handler, callback) {

  var params = handler.params;

  var groupId = params.groupId;
  var groupType = params.groupType;
  var recursive = params.recursive || false;
  var fields = params.fields;
  var order = params.order;

  try {
    check(groupId, __("user.error.emptyGroupId")).notEmpty();
    check(groupType, __("user.error.emptyGroupType")).notEmpty();
  } catch (e) {
    return callback(new errors.BadRequest(e.message));
  }

  ctrlGroup.isGroupExist(groupId, groupType, function(err, exist) {

    if(err) {
      callback(err);
    }

    if(exist === false) {
      return callback(new errors.BadRequest(__("group.error.notExist")));
    } else {
      if(groupType === "" && recursive) { // ???找
        ctrlGroup.getSubGroups(groupId, groupType, function(err, groups) {
          if(err) {
            callback(err);
          }

          var tempArr = [[groupId, groupType]];
          _.each(groups, function(group) {
            tempArr.push([group._id, group.type]);
          });

          var tasks = [];
          var users = [];
          _.each(tempArr, function(elem) {
            tasks.push(function(cb) {
              getUsersDirectlyInGroup(elem[0], elem[1], fields, order, function(err, tempUsers) {
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
        getUsersDirectlyInGroup(groupId, groupType, fields, order, callback);
      }
    }
  });
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

    modUser.count({"uid": uid, "password": auth.sha256(password), "valid": 1}, function(err, count) {
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