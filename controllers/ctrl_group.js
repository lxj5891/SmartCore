/**
 * @file 存取组信息的controller
 * @author lizheng
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var _            = require("underscore")
  , check        = require("validator").check
  , async        = require("async")
  , constant     = require("../core/constant")
  , errors       = require("../core/errors")
  , util         = require("../core/util")
  , modGroup     = require("../modules/mod_group")
  , modUser      = require("../modules/mod_user");

/**
 * 创建或更新组（完整）
 * @param {Object} handler 上下文对象
 * @param {Boolean} isInsert true：创建组，false：更新组
 * @param {Function} callback 回调函数，返回新创建或更新后的组
 */
function updateCompletely(handler, isInsert, callback) {

  var params = handler.params;
  var createBy = handler.uid;
  var isUpdate = !isInsert;

  var group = {};
  try {

    // 组标识
    if(isUpdate) {
      check(params.gid, __("group.error.emptyId")).notEmpty();
    }

    // 组名
    group.name = params.name;
    check(group.name, __("group.error.emptyName")).notEmpty();

    if(isInsert) {
      // 类型, 1:部门（公司组织结构）, 2:组（自由创建）, 3:职位组
      group.type = params.type;
      check(group.type, __("group.error.emptyType")).notEmpty();

      check(group.type, __("group.error.invalidType")).isIn(
        [constant.GROUP_TYPE_DEPARTMENT, constant.GROUP_TYPE_GROUP, constant.GROUP_TYPE_OFFICIAL]);
    } else {
      group.type = undefined;
    }

    // 父组标识
    group.parent = params.parent;
    if(group.type === constant.GROUP_TYPE_DEPARTMENT) {
      // TODO 部门是否必须有父部门？
      // check(group.parent, __("group.error.emptyParent")).notEmpty();
    }

    // 描述
    group.description = params.description;

    // 公开性, 1:私密，2:公开
    group.public = params.public;
    check(group.public, __("group.error.emptyPublic")).notEmpty();
    check(group.public, __("group.error.invalidPublic")).isIn([constant.GROUP_PRIVATE, constant.GROUP_PUBLIC]);

    // 经理一览
    group.owners = params.owners || [];
    if(!util.isArray(group.owners)) {
      group.owners = [group.owners];
    }

    // 扩展属性
    group.extend = params.extend;

    // Common
    var curDate = new Date();
    if(isInsert) {
      group.valid = constant.VALID;
      group.createAt = curDate;
      group.createBy = createBy;
    } else {
      group.valid = undefined;
      group.createAt = undefined;
      group.createBy = undefined;
    }
    group.updateAt = curDate;
    group.updateBy = createBy;
  } catch (e) {
    callback(new errors.BadRequest(e.message));
    return;
  }

  var tasks = [];

  // 检查父组的存在性
  if(group.type === constant.GROUP_TYPE_DEPARTMENT && group.parent) {
    tasks.push(function(done) {
      modGroup.get(group.parent, function(err, gp) {
        if(err) {
          done(err);
        } else {
          if(gp) {
            if(gp.type === constant.GROUP_TYPE_DEPARTMENT) {
              done();
            } else {
              done(new errors.BadRequest(__("group.error.parentNotDept")));
            }
          } else {
            done(new errors.BadRequest(__("group.error.parentNotExist")));
          }
        }
      });
    });
  }

  // 检查经理的存在性
  tasks.push(function() {
    _.each(group.owners, function(owner) {
      tasks.push(function(done) {
        modUser.total({"_id": owner, "valid": constant.VALID}, function(err, count) {
          if(count !== 1) {
            return done(new errors.BadRequest(__("group.error.ownerNotExist")));
          }

          return done(err);
        });
      });
    });
  });

  async.waterfall(tasks, function(err) {
    if(err) {
      callback(err);
    } else {
      if(isInsert) { // 创建
        modGroup.add(group, callback);
      } else { // 更新
        modGroup.update(params.gid, group, callback);
      }
    }
  });
}

/**
 * 创建组
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回新创建的组
 */
exports.addGroup = function(handler, callback) {

  updateCompletely(handler, true, callback);
};

/**
 * 更新组
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回更新后的组
 */
exports.updateGroup = function(handler, callback) {

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
exports.isGroupExist = function(handler, callback) {

  var gid = handler.params.gid;

  modGroup.total({"_id": gid, "valid": constant.VALID}, function(err, count) {
    return callback(err, count > 0);
  });
};

/**
 * 查询组信息
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回组信息
 */
exports.getGroupDetails = function(handler, callback) {

  var params = handler.params;

  try {
    check(params.gid, __("group.error.emptyId")).notEmpty();
  } catch (e) {
    return callback(new errors.BadRequest(e.message));
  }

  return modGroup.get(params.gid, callback);
};

/**
 * 查询组的下位组织
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回下位组织列表
 */
exports.getSubGroups = function(handler, callback) {

  var params = handler.params;

  var gid = params.groupId;
  var recursive = params.recursive || false;
  var groupFields = params.groupFields;

  // Scope Limite
  (function() {

    var resultGroups = [];

    function fetch(parents, cb) {

      modGroup.getList({"parent": {$in: parents}, "valid": constant.VALID},
        groupFields, 0, Number.MAX_VALUE, null, function(err, result) {

        if(err) {
          return cb(err);
        } else {
          resultGroups.concat(result);
          if(result.length > 0 && recursive) {
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
    }

    fetch(gid, function(err) {
      return callback(err, resultGroups);
    });

  })();

};

/**
 * 查询组的上位组织（一直到根）
 * @param {Object} handler 上下文对象
 * @param {Function} callback 回调函数，返回上位组织列表
 */
exports.getParentGroups = function(handler, callback) {

  var params = handler.params;

  var gid = params.gid;

  modGroup.get(gid, function(err, group) {
    if(err) {
      callback(err);
    } else {
      // Scope Limite
      (function() {

        var resultGroups = [];

        function fetch(inGid, cb) {

          modGroup.get(inGid, function(err, g) {
            if(err) {
              cb(err);
            } else {
              resultGroups.push(g);
              if(g.parent) {
                fetch(g.parent, cb);
              } else {
                cb(err);
              }
            }
          });
        }

        fetch(group.parent, function(err) {
          return callback(err, resultGroups);
        });

      })();
    }
  });

};







