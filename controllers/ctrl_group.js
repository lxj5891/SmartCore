/**
 * @file 存取组信息的controller
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
  , modGroup   = require("../modules/mod_group2");

exports.GroupType_Dept = 1; // 部门（公司组织结构）
exports.GroupType_Group = 2; // 组（自由创建）
exports.GroupType_Manage = 3; // 职位组

/**
 * 检查组是否已存在
 * @param {String} groupId 组标识
 * @param {String} groupType 组类型
 * @param {Function} callback(err, boolean)
 */
exports.isGroupExist = function(groupId, groupType, callback) {
  modGroup.count({"_id": groupId, "type": groupType, "valid": 1}, function(err, count) {
    return callback(err, count > 0);
  });
};

/**
 * 查询组的下位组织
 * @param {String} groupId 组标识
 * @param {String} groupType 组类型
 * @param {Function} callback(err, groups) 返回下位组织列表
 */
exports.getSubGroups = function(groupId, groupType, callback) {
  // TODO
};







