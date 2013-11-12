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
  , ctrlUser  = require("../controllers/ctrl_user");

// 类型常量
exports.GroupType_Dept = "1"; // 部门（公司组织结构）
exports.GroupType_Group = "2"; // 组（自由创建）
exports.GroupType_Manage = "3"; // 职位组

// 公开性常量
exports.Public_Private = "1"; // 私密
exports.Public_Public = "2"; // 公开

var extendPropertyPrefix = "ext_";
var rootParent = "0";

/**
 * 创建或更新组（完整）
 * @param {Object} handler 上下文对象
 * @param {Boolean} isInsert true：创建组，false：更新组
 * @param {Function} callback(err) 回调函数，返回异常信息
 */
function updateCompletely(handler, isInsert, callback) {

  var params = handler.params;
  var updator = handler.uid;

  var group = {};
  try {

    // 组标识
    if(!isInsert) {
      check(handler.params.gid, __("group.error.emptyId")).notEmpty();
    }

    // 组名
    group.name = handler.name;
    check(group.name, __("group.error.emptyName")).notEmpty();

    // 父组标识
    group.parent = handler.parent;
    check(group.parent, __("group.error.emptyParent")).notEmpty();

    // 描述
    group.description = handler.description;

    // 类型, 1:部门（公司组织结构）, 2:组（自由创建）, 3:职位组
    group.type = handler.type;
    check(group.type, __("group.error.emptyType")).notEmpty();
    check(group.type, __("group.error.invalidType")).isIn(
      [exports.GroupType_Dept, exports.GroupType_Group, exports.GroupType_Manage]);

    // 公开性, 1:私密，2:公开
    group.public = handler.public;
    check(group.public, __("group.error.emptyPublic")).notEmpty();
    check(group.public, __("group.error.invalidPublic")).isIn([exports.Public_Private, exports.Public_Public]);

    // 经理一览
    group.owner = handler.owner || [];
    if(!util.isArray(group.owner)) {
      group.owner = [group.owner];
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

    var tasks = [];

    // 检查父组的存在性
    tasks.push(function(cb) {
      handler.addParams("groupId", group.parent);
      handler.addParams("groupType", exports.GroupType_Dept);
      exports.isGroupExist(handler, function(err, exist) {
        if(exist === false) {
          return cb(new errors.BadRequest(__("group.error.parentNotExist")));
        } else {
          return cb(err);
        }
      });
    });

    // 检查经理的存在性
    tasks.push(function() {
      _.each(group.owner, function(owner) {
        handler.addParams("uid", owner);
        tasks.push(function(cb) {
          ctrlUser.isUserExist(handler, function(err, exist) {
            if(exist === false) {
              return cb(new errors.BadRequest(__("group.error.ownerNotExist")));
            } else {
              return cb(err);
            }
          });
        });
      });
    });

    async.waterfall(tasks, function(err) {
      if(err) {
        if(err instanceof errors.BadRequest) {
          callback(err);
        } else {
          handler.pitch(err); // TODO
        }
      } else { // 保存
        if(isInsert) {
          modGroup.add(group, callback);
        } else {
          modGroup.update(handler.params.gid, group, callback);
        }
      }
    });

  } catch (e) {
    return callback(new errors.BadRequest(e.message));
  }
}

/**
 * 添加组
 * @param {Object} handler 上下文对象
 * @param {Function} callback(err, groupId) 返回异常信息及新追加的组
 */
exports.addGroup = function(handler, callback) {

  updateCompletely(handler, true, callback);
};

/**
 * 更新组
 * @param {Object} handler 上下文对象
 * @param {Function} callback(err, boolean) 返回异常信息及更新后的组
 */
exports.updateGroup = function(handler, callback) {

  updateCompletely(handler, false, callback);
};

/**
 * 删除组
 * @param {Object} handler 上下文对象
 * @param {Function} callback(err, groupId) 返回异常信息及新追加的组
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

  var groupId = handler.params.groupId;

  modGroup.total({"_id": groupId}, function(err, count) {
    return callback(err, count > 0);
  });
};

/**
 * 查询组信息
 * @param {Object} handler 上下文对象
 * @param {Function} callback(err, group) 返回组信息
 */
exports.getGroupDetails = function(handler, callback) {

  var params = handler.params;

  try {
    check(params.groupId, __("group.error.emptyId")).notEmpty();

    modGroup.get(params.groupId, params.fields, callback);
  } catch (e) {
    return callback(new errors.BadRequest(e.message));
  }
};

/**
 * 查询组的下位组织
 * @param {Object} handler 上下文对象
 * @param {Function} callback(err, groups) 返回下位组织列表
 */
exports.getSubGroups = function(handler, callback) {

  var groupId = handler.params.groupId;
  var recursive = handler.params.recursive || false;
  var groupFields = handler.params.fields;

  // Scope Limite
  (function() {

    var resultGroups = [];

    function fetch(parents, cb) {

      var callee = arguments.callee;
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
            callee(subGroupIds, cb);
          } else {
            cb(err);
          }
        }
      });
    }

    fetch(groupId, function(err) {
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

  var groupId = handler.params.groupId;
  var groupFields = handler.params.fields;

  modGroup.get(groupId, "parent", function(err, group) {
    if(err) {
      callback(err);
    } else {
      // Scope Limite
      (function() {

        var resultGroups = [];

        function fetch(gid, cb) {

          var callee = arguments.callee;
          modGroup.get({"_id": gid}, groupFields, function(err, g) {
            if(err) {
              cb(err);
            } else {
              resultGroups.push(g);
              if(g.parent !== rootParent) {
                callee(g._id, cb);
              } else {
                cb(err);
              }
            }
          });
        }

        fetch(group._id, function(err) {
          callback(err, resultGroups);
        });

      })();
    }
  });

};







