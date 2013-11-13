/**
 * @file 存取组信息的controller
 * @author lizheng
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var smart     = require("smartcore")
  , _         = smart.util.underscore
  , check     = smart.util.validator.check
  , async     = smart.util.async
  , errors    = smart.framework.errors
  , util      = smart.framework.util
  , modGroup  = require("../modules/mod_group")
  , modUser  = require("../modules/mod_user");

// 类型常量
exports.GroupType = {
  Dept: "1", // 部门（公司组织结构）
  Group: "2", // 组（自由创建）
  Manage: "3" // 职位组
};

// 公开性常量
exports.PublicType = {
  Private: "1", // 私密
  Public: "2" // 公开
};

var extendPropertyPrefix = "ext_";
var rootParent = "0";

/**
 * 创建或更新组（完整）
 * @param {Object} handler 上下文对象
 * @param {Boolean} isInsert true：创建组，false：更新组
 * @param {Function} callback(err) 回调函数，返回新创建或更新后的组
 */
function updateCompletely(handler, isInsert, callback) {

  var params = handler.params;
  var updator = handler.uid;
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
        [exports.GroupType.Dept, exports.GroupType.Group, exports.GroupType.Manage]);
    }

    // 父组标识
    if(group.type === exports.GroupType.Dept) {
      group.parent = params.parent;
      check(group.parent, __("group.error.emptyParent")).notEmpty();
    }

    // 描述
    group.description = params.description;

    // 公开性, 1:私密，2:公开
    group.public = params.public;
    check(group.public, __("group.error.emptyPublic")).notEmpty();
    check(group.public, __("group.error.invalidPublic")).isIn([exports.PublicType.Private, exports.PublicType.Public]);

    // 经理一览
    group.owners = params.owners || [];
    if(!util.isArray(group.owners)) {
      group.owners = [group.owners];
    }

    // 扩展属性
    group.extend = {};
    _.each(params, function(val, key) {
      if(key.indexOf(extendPropertyPrefix) === 0) {
        group.extend[key] = val;
      }
    });

    // Common
    if(isInsert) {
      group.valid = 1;
      group.createAt = new Date().getTime();
      group.creator = updator;
    }
    group.updateAt = new Date().getTime();
    group.updater = updator;
  } catch (e) {
    return callback(new errors.BadRequest(e.message));
  }

  var tasks = [];

  // 检查父组的存在性
  if(group.type === exports.GroupType.Dept) {
    tasks.push(function(cb) {
      modGroup.get(group.parent, function(err, gp) {
        if(err) {
          return cb(err);
        } else {
          if(gp) {
            if(gp.type === exports.GroupType.Dept) {
              return cb();
            } else {
              return cb(new errors.BadRequest(__("group.error.parentNotDept")));
            }
          } else {
            return cb(new errors.BadRequest(__("group.error.parentNotExist")));
          }
        }
      });
    });
  }

  // 检查经理的存在性
  tasks.push(function() {
    _.each(group.owners, function(owner) {
      tasks.push(function(cb) {
        modUser.total({"_id": owner, "valid": 1}, function(err, count) {
          if(count && count !== 1) {
            return cb(new errors.BadRequest(__("group.error.ownerNotExist")));
          }

          return cb(err);
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
 * @param {Function} callback(err, group) 返回异常信息及新创建的组
 */
exports.addGroup = function(handler, callback) {

  updateCompletely(handler, true, callback);
};

/**
 * 更新组
 * @param {Object} handler 上下文对象
 * @param {Function} callback(err, group) 返回异常信息及更新后的组
 */
exports.updateGroup = function(handler, callback) {

  updateCompletely(handler, false, callback);
};

/**
 * 删除组
 * @param {Object} handler 上下文对象
 * @param {Function} callback(err, group) 返回异常信息及删除的组
 */
exports.deleteGroup = function(handler, callback) {

  updateCompletely(handler, true, callback);
};

/**
 * 检查组是否已存在
 * @param {Object} handler 上下文对象
 * @param {Function} callback(err, boolean)
 */
exports.isGroupExist = function(handler, callback) {

  var gid = handler.params.gid;

  modGroup.total({"_id": gid, "valid": 1}, function(err, count) {
    return callback(err, count > 0);
  });
};

/**
 * 查询组信息
 * @param {Object} handler 上下文对象
 * @param {Function} callback(err, group) 返回异常信息及组信息
 */
exports.getGroupDetails = function(handler, callback) {

  var params = handler.params;

  try {
    check(params.gid, __("group.error.emptyId")).notEmpty();
  } catch (e) {
    return callback(new errors.BadRequest(e.message));
  }

  modGroup.get(params.gid, callback);
};

/**
 * 查询组的下位组织
 * @param {Object} handler 上下文对象
 * @param {Function} callback(err, groups) 返回下位组织列表
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

      modGroup.getList({"parent": {$in: parents}, "valid":1},
        groupFields, 0, Number.MAX_VALUE, null, function(err, result) {

        if(err) {
          cb(err);
        } else {
          resultGroups.concat(result);
          if(result.length > 0 && recursive) {
            var subGroupIds = [];
            _.each(result, function(id) {
              subGroupIds.push(id);
            });
            fetch(subGroupIds, cb);
          } else {
            cb(err);
          }
        }
      });
    }

    fetch(gid, function(err) {
      callback(err, resultGroups);
    });

  })();

};

/**
 * 查询组的上位组织（一直到根）
 * @param {Object} handler 上下文对象
 * @param {Function} callback(err, groups) 返回上位组织列表
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
              if(g.parent !== rootParent) {
                fetch(g.parent, cb);
              } else {
                cb(err);
              }
            }
          });
        }

        fetch(group.parent, function(err) {
          callback(err, resultGroups);
        });

      })();
    }
  });

};







