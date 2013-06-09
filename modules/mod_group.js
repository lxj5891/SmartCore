/**
 * Group:
 * Copyright (c) 2012 Author Name li
 */

var _       = require("underscore")
  , mongo   = require('mongoose')
  // , util    = require('util')
  // , log     = require('../core/log')
  , solr = require('../core/solr')
  , conn    = require('./connection')
  , async = require("async")
  , mod_group = require('../modules/mod_group')
  , schema  = mongo.Schema;


/**
 * Group Schema
 * 保存多种类型的组。
 * 1. 公司真实的组织结构:
 *  是私密的，有一人或多人经理（部长等）
 *  不能随意变更，删除。
 * 2. 用户自由创建的组
 *  默认是私有的
 * 
 * TOOD:组织变更，世代的概念需要考虑
 */
var Group = new schema({
    name: {
      name_zh : {type: String}
    , letter_zh :{type: String} //租名称的拼音
    }
  , parent: {type: String}      // 父
  , member: [String]            // 成员一览
  , description: {type: String} // 描述
  , type: {type: String}        // 1:组（自由创建），2:部门（公司组织结构）
  , secure: {type: String}      // 1:私密，2:公开
  , owner: [String]             // 经理一览
  , category: {type: String}    // 分类（考虑自由输入关键字，方便分类和检索）
  , photo: {
      big: {type: String}
    , middle: {type: String}
    , small: {type: String}
    }
  , createby: {type: String}
  , createat: {type: Date}
  , editby: {type: String}
  , editat: {type: Date}
  });


/**
 * 创建组
 */
exports.create = function(group_, callback_) {

  var group = model();

  new group(group_).save(function(err, ret){
    solr.update(ret, "group", "insert", function(){});
    callback_(err, ret);
  });
};


/**
 * 获取指定ID的组信息
 */
exports.at = function(gid_, callback_){

  var group = model();

  group.findById(gid_, function(err, result){
    callback_(err, result);
  });
};


/**
 * 删除组
 */
exports.remove = function(gid_, callback_){

  var group = model();

  group.findByIdAndRemove(gid_, function(err, result){
    solr.update(result, "group", "delete", function(){});
    callback_(err, result);
  });
};


/**
 * 给定条件检索组
 * Example: 
 *  用名称检索{name: "myGroup"}
 */
exports.find = function(args_, callback_){

  var group = model();

  group.find(args_, function(err, result){
    callback_(err, result);
  });
};


/**
 * 更新指定ID的组
 */
exports.update = function(gid_, newvals_, callback_) {

  var group = model();
  group.findByIdAndUpdate(gid_, newvals_, function(err, result){
    solr.update(result, "group", "update", function(){});
    callback_(err, result);
  });
};

exports.addMember = function(gid_, uid_, callback_) {
  var group = model();
  group.findByIdAndUpdate(gid_, {$push : {"member" : uid_}}, function(err, result){
    callback_(err, result);
  });
};

exports.removeMember = function(gid_, uid_, callback_) {
  var group = model();
  group.findByIdAndUpdate(gid_, {$pull : {"member" : uid_}}, function(err, result){
    callback_(err, result);
  });
};

/**
 * 组名的模糊检索。前方一致检索，不区分大小写
 */
exports.search = function(keywords_, callback_) {

  var group = model()
    , condition = {};

  condition.$or = [
    {"name.name_zh": new RegExp("^" + keywords_.toLowerCase() + ".*$", "i")}
  , {"name.letter_zh": new RegExp("^" + keywords_.toLowerCase() + ".*$", "i")}
  ];
  
  group.find(condition).select('_id name photo description')//.skip(0).limit(5)
    .sort({"name.name_zh": 'asc'})
    .exec(function(err, groups){
      callback_(err, groups);
    });
};


/**
 * 获取以给定字母开头的组一览，同时可以指定某个人所属的组
 * @param {String} head_        组名的首字母，可以为空
 * @param {String} uid_         组所属的用户ID，可以为空
 * @param {String} type_        组的种类
 * @param {String} start_       开始位置
 * @param {String} limit_       返回个数
 */
exports.headMatch = function(condition_, callback_) {

  var group = model()
    , condition = {}
    , condition2 = {}
    , condition3 = {}
    , uid = condition_.uid
    , login = condition_.login
    , firstLetter = condition_.firstLetter
    // , start = condition_.start || 0
    // , limit = condition_.limit || 20
    , type = condition_.type
    , keywords = condition_.keywords
    , joined = condition_.joined;


  var tasks = [];

  // 1.uid参加的group
  var task_getGroupByUid = function(cb){
    mod_group.getAllGroupByUid(uid, function(err, groups){
      err = err ? new error.InternalServer(err) : null;
      //var ids = []; _.each(groups, function(g){ ids.push(g._id); });
      cb(err,groups);
    });
  };
  tasks.push(task_getGroupByUid);

  // 2.login user 参加的group
  if(login && uid != login) {
    var task_getGroupByLogin = function(groups,cb){
      mod_group.getAllGroupByUid(login, function(err, result){
        err = err ? new error.InternalServer(err) : null;
        var ids = [];
        _.each(result, function(g){ ids.push(g._id); });

        var viewable = [];
        _.each(groups, function(g){
          if(g.secure == 2){
            viewable.push(g);
          }else{
            _.each(ids, function(id){
              if(id == g._id.toString())
                viewable.push(g);
            });
          }
        });

        cb(err,viewable);
      });
    };
    tasks.push(task_getGroupByLogin);
  }
  
  // 3.
  var task_getGroups = function(viewable, cb){
    var ids = [];
    _.each(viewable, function(g){ ids.push(g._id); });

    if (type) {
      condition.type = type;
    }
    if(joined){
      condition.$or = [
        {"_id": {$in: ids}}  // 
      ];
    }else{
      condition.$or = [
          {"secure": 2 }        // 公开的
        , {"_id": {$in: ids}}  // 
        ];
    }

    if(keywords) {
      condition2 = JSON.parse(JSON.stringify(condition));
      condition2["name.name_zh"] = new RegExp("^" + keywords.toLowerCase() + ".*$", "i");
      
      condition3 = JSON.parse(JSON.stringify(condition));
      condition3["name.letter_zh"] = new RegExp("^" + keywords.toLowerCase() + ".*$", "i");

      condition = {};
      condition.$or = [condition2,condition3];
    } else if (firstLetter) {
      condition2 = JSON.parse(JSON.stringify(condition));
      condition2["name.name_zh"] = new RegExp("^" + firstLetter.toLowerCase() + ".*$", "i");
      
      condition3 = JSON.parse(JSON.stringify(condition));
      condition3["name.letter_zh"] = new RegExp("^" + firstLetter.toLowerCase() + ".*$", "i");

      condition = {};
      condition.$or = [condition2,condition3];
    }

    // 检索满足条件的组
    group.find(condition)//.skip(start_ || 0).limit(limit_ || 20)
    .sort({"name": 'asc'})
    .exec(function(err, groups){
      cb(err, groups);
    });
  };
  tasks.push(task_getGroups);

  async.waterfall(tasks,function(err, groups){
    return callback_(err, groups);
  });

};

/**
 * 获取下位部门的ID一览
 */
exports.childDepartments = function(parentGid_, callback_) {

  // TODO: 递归可能有性能问题

  // Scope Limite
  (function() {

    var departments = []
      , group = model();

    fetch(parentGid_, function(err) {
      callback_(err, departments);
    });

    // Recursion function
    function fetch(parent, callback) {

      var callee = arguments.callee;
      group.find({"parent": {$in: parent}, "type": "2"}, function(err, result){

        var child = [];
        _.each(result, function(g){ child.push(g._id); });
        departments = departments.concat(result);

        if (!err && result.length > 0) {
          callee(child, callback);
        } else {
          callback(err);
        }
      });
    }
  })();

};

/**
 * 获取上位部门路径
 */
exports.parentDepartments = function(childGid_, callback_) {
  
  var group = model();
  var parents = [];
  group.find({"_id": {$in: childGid_}, "type": "2"}, "parent", function(err, result){
    var pids = [];
    _.each(result, function(g){ if(g.parent)pids.push(g.parent); });
    mod_group.departmentsPath(pids, parents, callback_);
  });
};

/**
 * 获取上位部门路径
 */
exports.departmentsPath = function(childGid_, parents, callback_) {
  
  var group = model();
  group.find({"_id": {$in: childGid_}, "type": "2"}, function(err, result){
    parents = parents.concat(result);
    var pids = [];
    _.each(result, function(g){ if(g.parent)pids.push(g.parent); });
    if (!err && pids.length > 0) {
      mod_group.departmentsPath(pids, parents, callback_);
    } else {
      callback_(err, parents);
    }
  });
};

/**
 * 1.gid 的members
 * 2.gid下位 的members
 * 3.gid 的owner
 * 4.gid上位 的owner
 */
exports.getAllUserByGid = function(gid, callback_) {

  var group = model();
  var tasks = [];

  // 1.gid 的members
  // 3.gid 的owner
  var task_getMember = function(cb){
    group.findById(gid, function(err, group){
      err = err ? new error.InternalServer(err) : null;
      var members = group.member;
      members = members.concat(group.owner);
      cb(err, members);
    });
  };
  tasks.push(task_getMember);

  // 2.gid下位 的members
  var task_getChildDepartmentMember = function(members, cb){
    mod_group.childDepartments([gid], function(err, groups){
      err = err ? new error.InternalServer(err) : null;
      _.each(groups, function(g){ members = members.concat(g.member); });
      cb(err,members);
    });
  };
  tasks.push(task_getChildDepartmentMember);

  // 4.gid上位 的owner
  var task_getParentDepartmentOwner = function(members, cb){
    mod_group.parentDepartments([gid], function(err, groups){
      err = err ? new error.InternalServer(err) : null;
      _.each(groups, function(g){ members = members.concat(g.owner); });
      cb(err,members);
    });
  };
  tasks.push(task_getParentDepartmentOwner);

  async.waterfall(tasks,function(err, members){
    //console.log(members);
    return callback_(err, members);
  });

};


/**
 * 1.所属group
 * 2.所属上位group
 * 3.owner的group
 * 4.owner的下位group
 */
exports.getAllGroupByUid = function(uid, callback_) {
  
  var group = model();
  var tasks = [];

  // 1.所属group
  var task_getGroupByMember = function(cb){
    group.find({"member":uid}, function(err, groups){
      err = err ? new error.InternalServer(err) : null;
      cb(err,groups);
    });
  };
  tasks.push(task_getGroupByMember);

  // 2.所属上位group
  var task_getParentDepartment = function(groups, cb){
    var child = [];
    // var parents = [];
    _.each(groups, function(g){ child.push(g._id); });
    mod_group.parentDepartments(child, function(err, result){
      err = err ? new error.InternalServer(err) : null;
      groups = groups.concat(result);
      cb(err,groups);
    });
  };
  tasks.push(task_getParentDepartment);

  // 3.owner的group
  var task_getOwnerGroup = function(groups, cb){
    group.find({"owner":uid,"type":"2"}, function(err, result){
      err = err ? new error.InternalServer(err) : null;
      groups = groups.concat(result);
      cb(err,groups);
    });
  };
  tasks.push(task_getOwnerGroup);

  // 2.owner的下位group
  var task_getChildDepartment = function(groups, cb){

    var parent = [];
    _.each(groups, function(g){if(_.contains(g.owner,uid)) parent.push(g._id); });
    mod_group.childDepartments(parent, function(err, result){
      err = err ? new error.InternalServer(err) : null;
      groups = groups.concat(result);
      cb(err,groups);
    });
  };
  tasks.push(task_getChildDepartment);

  async.waterfall(tasks,function(err, groups){
    return callback_(err, groups);
  });
};

function model() {
  return conn().model('Group', Group);
}
