/**
 * @file 存取组信息的controller
 * @author lizheng
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var _            = require("underscore")
  , check        = require("validator").check
  , constant     = require("../constant")
  , errors       = require("../errors")
  , log          = require("../log")
  , util         = require("../util")
  , modGroup     = require("../models/mod_group")
  , modUser      = require("../models/mod_user")
  , __          = global.__;

/**
 * 查询组下的用户（直下，非递归）
 * @param {Object} handler 上下文对象
 * @param {Array} gids 组标识列表
 * @param {Function} callback 回调函数，返回用户标识列表
 */
function getUsersInGroups(handler, gids, callback) {

  var code = handler.code;
  var uid = handler.uid;
  var params = handler.params;


  var skip = params.skip || 0;
  var limit = params.limit || constant.MOD_DEFAULT_LIMIT;
  var order = params.order;

  var condition = {"groups": {$in: gids}, "valid": constant.VALID};

  modUser.total(code, condition, function(err, count) {
    if (err) {
      log.error(err, uid);
      callback(new errors.InternalServer(err));
      return;
    }

    if (count === 0) {
      callback(err, { totalItems: 0, items: [] });
      return;
    }

    modUser.getList(code, condition, skip, limit, order, function(err, result) {
      if (err) {
        log.error(err, uid);
        return callback(new errors.InternalServer(err));
      }

      // TODO 一个用户可能属于多个组，所以返回时需要distinct
      var uids = [];
      _.each(result, function(user) {
        uids.push(user._id.toString());
      });


      return callback(err, { totalItems: count, items: uids });
    });

  });
}

/**
 * 创建组
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回新创建的组
 */
exports.add = function(handler, callback) {

  var code = handler.code;
  var params = handler.params;
  var uid = handler.uid;

  log.debug("begin: add group.", uid);
  log.debug("name: " + params.name, uid);
  log.debug("type: " + params.type, uid);

  var group = {};
  try {

    // 组名
    group.name = params.name;
    check(group.name, __("group.error.emptyName")).notEmpty();
    check(group.name, __("group.error.nameTooLong")).len(0, 128);

    // 类型, 1:部门（公司组织结构）, 2:组（自由创建）, 3:职位组
    group.type = params.type;
    check(group.type, __("group.error.emptyType")).notEmpty();
    check(group.type, __("group.error.invalidType")).isIn(
      [constant.GROUP_TYPE_DEPARTMENT, constant.GROUP_TYPE_GROUP, constant.GROUP_TYPE_OFFICIAL]);

    // 父组标识
    if (group.type === constant.GROUP_TYPE_DEPARTMENT) {
      group.parent = params.parent;
    }

    // 描述
    group.description = params.description;
    if (group.description) {
      check(group.description, __("group.error.descTooLong")).len(0, 256);
    }

    // 公开性, 1:私密，2:公开
    group.public = params.public;
    check(group.public, __("group.error.emptyPublic")).notEmpty();
    check(group.public, __("group.error.invalidPublic")).isIn([constant.GROUP_PRIVATE, constant.GROUP_PUBLIC]);

    // 经理一览
    group.owners = params.owners;

    // 扩展属性
    if (params.extend) {
      group.extend = params.extend;
    }

    // Common
    var curDate = new Date();
    group.valid = constant.VALID;
    group.createAt = curDate;
    group.createBy = uid;
    group.updateAt = curDate;
    group.updateBy = uid;

  } catch (e) {
    log.error(e.message, uid);
    callback(new errors.BadRequest(e.message));
    return;
  }

  modGroup.add(code, group, function(err, result) {
    if (err) {
      log.error(err, uid);
      return callback(new errors.InternalServer(err));
    }

    log.debug("finished: add group " + result._id + ".", uid);

    return callback(err, result);
  });

};

/**
 * 更新组
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回更新后的组
 */
exports.update = function(handler, callback) {

  var code = handler.code;
  var params = handler.params;
  var uid = handler.uid;

  log.debug("begin: update group " + params.gid + ".", uid);

  var group = {};
  try {

    // 组名
    if (params.name) {
      group.name = params.name;
      check(group.name, __("group.error.nameTooLong")).len(0, 128);
    }

    // 父组标识
    if (params.parent) {
      group.parent = params.parent;
    }

    // 描述
    if (params.description) {
      group.description = params.description;
      check(group.description, __("group.error.descTooLong")).len(0, 256);
    }

    // 公开性, 1:私密，2:公开
    if (params.public) {
      group.public = params.public;
      check(group.public, __("group.error.invalidPublic")).isIn([constant.GROUP_PRIVATE, constant.GROUP_PUBLIC]);
    }

    // 经理一览
    if (params.owners) {
      group.owners = params.owners;
      if (!util.isArray(group.owners)) {
        group.owners = [group.owners];
      }
    }

    // 扩展属性
    if (params.extend) {
      group.extend = params.extend;
    }

    // Common
    var curDate = new Date();
    group.updateAt = curDate;
    group.updateBy = uid;

  } catch (e) {
    log.error(e.message, uid);
    callback(new errors.BadRequest(e.message));
    return;
  }

  modGroup.update(code, params.gid, group, function(err, result) {
    if (err) {
      log.error(err, uid);
      return callback(new errors.InternalServer(err));
    }

    if(result) {
      log.debug("finished: update group " + result._id + " .", uid);
      return callback(err, result);
    }

    return callback(new errors.NotFound(__("group.error.notExist")));
  });

};

/**
 * 删除组
 */
exports.remove = function(handler, callback) {

  var code = handler.code;
  var uid = handler.uid;
  var gid = handler.params.gid;

  log.debug("begin: remove group " + gid + ".", uid);

  modGroup.update(code, gid, {valid: 0}, function(err, result) {
    if (err) {
      log.error(err, handler.uid);
      return callback(new errors.InternalServer(err));
    }

    if(result) {
      log.debug("finished: remove group " + result._id + " .", uid);
      return callback(err, result);
    }

    return callback(new errors.NotFound(__("group.error.notExist")));
  });
};

/**
 * 检查组是否已存在
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回组是否已存在
 */
exports.exist = function(handler, callback) {

  var code = handler.code;
  var gid = handler.params.gid;

  modGroup.total(code, {"_id": gid, "valid": constant.VALID}, function(err, count) {

    if (err) {
      log.error(err, handler.uid);
      return callback(new errors.InternalServer(err));
    } else {
      return callback(err, count > 0);
    }
  });
};

/**
 * 查询组信息
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回组信息
 */
exports.get = function(handler, callback) {

  var code = handler.code;
  var params = handler.params;

  modGroup.get(code, params.gid, function(err, result) {
    if (err) {
      log.error(err, handler.uid);
      return callback(new errors.InternalServer(err));
    }

    if (result) {
      return callback(err, result);
    } else {
      return callback(new errors.NotFound(__("group.error.notExist")));
    }
  });
};

/**
 * 查询某个组下的用户
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回用户标识列表
 */
exports.getUsersInGroup = function(handler, callback) {

  var params = handler.params;
  var gid = params.gid.toString();
  var recursive = params.recursive;

  if (recursive === true) { // 递归查找
    exports.getSubGroups(handler, function(err, gids) {
      if (err) {
        log.error(err, handler.uid);
        return callback(new errors.InternalServer(err));
      }

      gids.push(gid);

      return getUsersInGroups(handler, gids, callback);
    });
  } else {
    getUsersInGroups(handler, [gid], callback);
  }
};

/**
 * 查询组的下位组织
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回下位组织标识列表
 */
exports.getSubGroups = function(handler, callback) {

  var code = handler.code;
  var params = handler.params;

  var gid = params.gid.toString();
  var recursive = params.recursive;

  var resultGroups = [];

  var fetch = function(parents, cb) {

    modGroup.getList(code, {"parent": {$in: parents}, "valid": constant.VALID},
      0, Number.MAX_VALUE, null, function(err, result) {

        if (err) {
          return cb(err);
        } else {
          if (result.length > 0) {
            var subGroupIds = [];
            _.each(result, function(tmpGroup) {
              resultGroups = resultGroups.concat(tmpGroup._id.toString());
              subGroupIds.push(tmpGroup._id.toString());
            });
            if (recursive === true) {
              return fetch(subGroupIds, cb);
            } else {
              return cb(err);
            }
          } else {
            return cb(err);
          }
        }
      });
  };

  fetch([gid], function(err) {
    if (err) {
      log.error(err, handler.uid);
      return callback(new errors.InternalServer(err));
    }

    return callback(err, resultGroups);
  });

};

/**
 * 查询从根组到指定组的路径（包含本身）
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回上位组织标识列表
 */
exports.getPath = function(handler, callback) {

  var code = handler.code;
  var params = handler.params;
  var gid = params.gid.toString();

  var resultGroups = [];

  var fetch = function(inGid, cb) {

    modGroup.get(code, inGid, function(err, result) {
      if (err) {
        cb(err);
        return;
      }

      if (result) {
        resultGroups.push(result._id.toString());
        if (result.parent) {
          fetch(result.parent, cb);
        } else {
          cb(err);
        }
      } else {
        cb(err);
      }
    });
  };

  fetch(gid, function(err) {

    if (err) {
      log.error(err, handler.uid);
      return callback(new errors.InternalServer(err));
    }

    return callback(err, resultGroups.reverse());
  });

};

/**
 * 向组中添加用户
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回添加是否成功
 * TODO : 单体测试
 */
exports.addUser = function(handler, callback) {

  var code = handler.code;
  var params = handler.params;
  var gid = params.gid.toString();
  var uid = params.uid.toString();

  log.debug("begin: add user to group.", uid);
  log.debug("gid: " + gid, uid);
  log.debug("uid: " + uid, uid);

  modUser.update(code, uid, { $addToSet: { "groups": gid } }, function(err, result) {

    if (err) {
      log.error(err, handler.uid);
      return callback(new errors.InternalServer(err));
    }

    if(result) {
      log.debug("finished: add user to group.", uid);
      return callback(null, true);
    }

    return callback(new errors.NotFound(__("user.error.notExist")));
  });

};

/**
 * 从组中删除用户
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回删除是否成功
 * TODO : 单体测试
 */
exports.removeUser = function(handler, callback) {

  var code = handler.code;
  var params = handler.params;
  var gid = params.gid.toString();
  var uid = params.uid.toString();

  log.debug("begin: remove user from group.", uid);
  log.debug("gid: " + gid, uid);
  log.debug("uid: " + uid, uid);

  modUser.update(code, uid, { $pull: { "groups": gid } }, function(err, result) {

    if (err) {
      log.error(err, handler.uid);
      return callback(new errors.InternalServer(err));
    }

    if(result) {
      log.debug("finished: remove user from group.", uid);
      return callback(null, true);
    }

    return callback(new errors.NotFound(__("user.error.notExist")));
  });
};

/**
 * 根据指定条件查询组
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回组列表
 * TODO : 单体测试
 */
exports.getList = function(handler, callback) {

  var code = handler.code;
  var params = handler.params;
  var condition = params.condition;

  modGroup.total(code, condition, function(err, count) {

    if (err) {
      log.error(err, handler.uid);
      callback(new errors.InternalServer(err));
      return;
    }

    if (count === 0) {
      callback(err, { totalItems: count, items: [] });
      return;
    }

    var skip = params.skip;
    var limit = params.limit;
    var order = params.order;

    modGroup.getList(code, condition, skip, limit, order, function(err, result) {

      if (err) {
        log.error(err, handler.uid);
        return callback(new errors.InternalServer(err));
      }

      return callback(err, { totalItems: count, items: result });
    });

  });

};

