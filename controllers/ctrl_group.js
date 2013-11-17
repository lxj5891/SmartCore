/**
 * @file 存取组信息的controller
 * @author lizheng
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var _            = require("underscore")
  , async        = require("async")
  , check        = require("validator").check
  , constant     = require("../core/constant")
  , errors       = require("../core/errors")
  , log          = require("../core/log")
  , util         = require("../core/util")
  , modGroup     = require("../modules/mod_group")
  , modUser      = require("../modules/mod_user")
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
 * 创建或更新组（完整）
 * @param {Object} handler 上下文对象
 * @param {Boolean} isInsert true：创建组，false：更新组
 * @param {Function} callback 回调函数，返回新创建或更新后的组
 */
function updateCompletely(handler, isInsert, callback) {

  var code = handler.code;
  var params = handler.params;
  var createBy = handler.uid;
  var isUpdate = !isInsert;

  var group = {};
  try {

    // 组标识
    if(isUpdate) {
      params.gid = objIdToStr(params.gid);
      check(params.gid, __("group.error.emptyId")).notEmpty();
    }

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
    if(group.type === constant.GROUP_TYPE_DEPARTMENT) {
      group.parent = params.parent;
    } else {
      group.parent = null;
    }

    // 描述
    group.description = params.description;
    if(group.description) {
      check(group.description, __("group.error.descTooLong")).len(0, 256);
    }

    // 公开性, 1:私密，2:公开
    group.public = params.public;
    check(group.public, __("group.error.emptyPublic")).notEmpty();
    check(group.public, __("group.error.invalidPublic")).isIn([constant.GROUP_PRIVATE, constant.GROUP_PUBLIC]);

    // 经理一览
    group.owners = params.owners || [];
    if(!util.isArray(group.owners)) {
      group.owners = [group.owners];
    }
    // 将ObjectId转化为String
    for(var i = 0; i < group.owners.length; i++) {
      group.owners[i] = group.owners[i].toString();
    }

    // 扩展属性
    if(params.extend) {
      group.extend = params.extend;
    }

    // Common
    var curDate = new Date();
    if(isInsert) {
      group.valid = constant.VALID;
      group.createAt = curDate;
      group.createBy = createBy;
    }
    group.updateAt = curDate;
    group.updateBy = createBy;
  } catch (e) {
    log.error(e.message, handler.uid);
    callback(new errors.BadRequest(e.message));
    return;
  }

  var tasks = [];

  if(isUpdate) {

    // 检查组和类型是否匹配
    tasks.push(function(done) {
      modGroup.get(code, params.gid, function(err, resultGroup) {

        if(err) {
          return done(new errors.InternalServer(err));
        }

        if(resultGroup) {
          if(resultGroup.type !== group.type) {
            return done(new errors.BadRequest(__("group.error.typeNotMatch")));
          } else {
            return done(err);
          }
        }

        return done(new errors.NotFound(__("group.error.notExist")));
      });
    });
  }

  // 检查父组的存在性
  if(group.type === constant.GROUP_TYPE_DEPARTMENT && group.parent) {
    tasks.push(function(done) {
      modGroup.get(code, group.parent, function(err, parentGroup) {
        if(err) {
          return done(new errors.InternalServer(err));
        }

        if(parentGroup) {
          if(parentGroup.type === constant.GROUP_TYPE_DEPARTMENT) {
            return done();
          } else {
            return done(new errors.BadRequest(__("group.error.parentNotDept")));
          }
        }

        return done(new errors.BadRequest(__("group.error.invalidParent")));
      });
    });
  }

  // 检查经理的存在性
  _.each(group.owners, function(owner) {
    tasks.push(function(done) {
      modUser.total(code, {"_id": owner, "valid": constant.VALID}, function(err, count) {
        if(err) {
          return done(new errors.InternalServer(err));
        }

        if(count !== 1) {
          return done(new errors.BadRequest(__("group.error.invalidOwner")));
        }

        return done(err);
      });
    });
  });

  async.waterfall(tasks, function(err) {
    if(err) {
      log.error(err, handler.uid);
      callback(err);
      return;
    }

    if(isInsert) { // 创建
      modGroup.add(code, group, function(err, result) {
        if(err) {
          log.error(err, handler.uid);
          return callback(new errors.InternalServer(err));
        }

        log.debug("finished: add group.", handler.uid);
        log.audit("finished: add group.", handler.uid);

        return callback(err, result);
      });
    } else { // 更新
      modGroup.update(code, params.gid, group, function(err, result) {
        if(err) {
          log.error(err, handler.uid);
          return callback(new errors.InternalServer(err));
        }

        if(result) {

          log.info("finished: update group.", handler.uid);
          log.audit("finished: update group.", handler.uid);

          return callback(err, result);
        } else {
          return callback(new errors.NotFound(__("group.error.notExist")));
        }
      });
    }
  });
}

/**
 * 创建组
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回新创建的组
 */
exports.add = function(handler, callback) {

  updateCompletely(handler, true, callback);
};

/**
 * 更新组
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回更新后的组
 */
exports.update = function(handler, callback) {

  updateCompletely(handler, false, callback);
};

/**
 * 删除组
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回删除的组
 */
exports.removeGroup = function(handler, callback) {

  // TODO 如何删除组？
  // 部门 刪除組及下位所有組，用戶怎么处理？（前提：一个用户可能属于多个部门组）
  // 自由创建 刪除組，不刪除用戶
  // 职位组 刪除組，不刪除用戶
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

    if(err) {
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
    if(err) {
      log.error(err, handler.uid);
      return callback(new errors.InternalServer(err));
    }

    if(result) {
      return callback(err, result);
    } else {
      return callback(new errors.NotFound(__("group.error.notExist")));
    }
  });
};

/**
 * 查询组的下位组织
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回下位组织列表
 */
exports.getSubGroups = function(handler, callback) {

  var code = handler.code;
  var params = handler.params;

  var gid = params.groupId;
  var recursive = params.recursive;
  var groupFields = params.groupFields;

  var resultGroups = [];

  var fetch = function(parents, cb) {

    modGroup.getList(code, {"parent": {$in: parents}, "valid": constant.VALID},
      groupFields, 0, Number.MAX_VALUE, null, function(err, result) {

        if(err) {
          return cb(err);
        } else {
          resultGroups.concat(result);
          if(result.length > 0 && recursive === true) {
            var subGroupIds = [];
            _.each(result, function(id) {
              subGroupIds.push(id);
            });
            return fetch(subGroupIds, cb);
          } else {
            return cb(err);
          }
        }
      });
  };

  fetch(gid, function(err) {
    if(err) {
      log.error(err, handler.uid);
      return callback(new errors.InternalServer(err));
    }

    return callback(err, resultGroups);
  });

};

/**
 * 查询查询从根组到指定组的路径（包含本身）
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回上位组织列表
 */
exports.getPath = function(handler, callback) {

  var code = handler.code;
  var params = handler.params;
  var gid = params.gid;

  var resultGroups = [];

  var fetch = function(inGid, cb) {

    modGroup.get(code, inGid, function(err, result) {
      if(err) {
        cb(err);
        return;
      }

      resultGroups.push(result);
      if(result && result.parent) {
        fetch(result.parent, cb);
      } else {
        cb(err);
      }
    });
  };

  fetch(gid, function(err) {

    if(err) {
      log.error(err, handler.uid);
      return callback(new errors.InternalServer(err));
    }

    return callback(err, resultGroups.reverse());
  });

};







