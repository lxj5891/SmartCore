/**
 * User:
 * Copyright (c) 2012 Author Name li
 */

var mongo = require('mongoose')
  , util = require('util')
  , log = require('../core/log')
  , solr = require('../core/solr')
  , conn = require('./connection')
  , schema = mongo.Schema;

/**
 * User Schema
 */
var User = new schema({
    uid: {type: String, required: true}       // 登陆认证用，TODO:换成邮件登陆
  , password: {type: String, required: true}
  , email: {
      email1: {type: String}
    , email2: {type: String}
  }
  , name: {
    name_zh : {type: String}
  , letter_zh :{type: String} //租名称的拼音
  }
  , title: {type: String}
  , birthday: {type: String}
  , address: {
      country: {type: String}
    , state: {type: String}
    , province: {type: String} 
    , city: {type: String}
    , county: {type: String}    // 县
    , district: {type: String}  // 区
    , township: {type: String}  // 乡
    , village: {type: String}   // 村
    , street: {type: String}    // 街
    , road: {type: String}      // 路
    , zip: {type: String}
  }
  , tel: {
      telephone: {type: String}
    , mobile: {type: String}
  }
  , lang: {type: String}
  , timezone: {type: String}
  , status: {type: Number}
  , custom: {
      url: {type: String}
    , memo: {type: String}
  }
  , following: [String]           // 我关注的人
  , expire: {type: Date}
  , createby: {type: String}
  , createat: {type: Date}
  , editby: {type: String}
  , editat: {type: Date}
  , active: {type: Number}
  , photo: {
      big: {type: String}
    , middle: {type: String}
    , small: {type: String}
  }
});


/**
 * 创建用户
 */
exports.create = function(user_, callback_){

  var user = model();

  new user(user_).save(function(err, result){
    solr.update(result, "user", "insert", function(data){});
    callback_(err, result);
  });
};


/**
 * 获取指定用户的信息
 */
exports.at = function(userid_, callback_) {

  var user = model();

  user.findById(userid_, function(err, result){
    callback_(err, result);
  });
};


/**
 * 获取用户信息（多用户）
 * @param {String} userids_ 用户ID的数组
 */
exports.many = function(userids_, start_, limit_, callback_) {

  var user = model();

  user.find({"_id": {$in: userids_}})
    //.skip(start_ || 0).limit(limit_ || 20)
    .exec(function(err, result){
      callback_(err, result);
    });
}


/**
 * 给定条件检索用户
 * Example: 
 *  用名称检索{uid: "smart"}
 */
exports.find = function(args_, callback_){

  var user = model();

  user.find(args_, function(err, result){
    callback_(err, result);
  });
};


/**
 * 删除用户
 */
exports.delete = function(userid_, callback_){

  var user = model();

  user.findByIdAndRemove(userid_, function(err, result){
    solr.update(result, "user", "delete", function(data){});
    callback_(err, result);
  });
};


/**
 * 更新用户信息
 */
exports.update = function(userid_, newvals_, callback_){

  var user = model();

  user.findByIdAndUpdate(userid_, newvals_, function(err, result){
    solr.update(result, "user", "update", function(data){});
    callback_(err, result);
  });
};


/**
 * 添加关注。添加到被关注的人的following列表里。
 * @param {String} currentuid_ 添加关注的人
 * @param {String} followinguid_ 被关注的人
 */
exports.follow = function(currentuid_, followinguid_, callback_){

  var user = model();

  user.findByIdAndUpdate(
      currentuid_
    , {$addToSet: {following: followinguid_}}
    , {upsert:true}
    , function(err, result) {
      callback_(err, result);
    });
};


/**
 * 取消关注
 */
exports.unfollow = function(currentuid_, followinguid_, callback_){

  var user = model();

  user.findByIdAndUpdate(
      currentuid_
    , {$pull: {following: followinguid_}}
    , {upsert:true}
    , function(err, result) {
      callback_(err, result);
    });
};


/**
 * 获取我关注的人的ID ARRAY
 */
exports.followerIds = function(uid_, callback_){

  var user = model();
  user.find({following: uid_}).select('_id')
    .exec(function(err, result){
      var ids = [];
      for(var i in result){
        ids.push(result[i]._id);
      }
      callback_(err, ids);
  });
};

/**
 * 用户名的模糊检索。前方一致检索，不区分大小写
 */
exports.search = function(keywords_, callback_) {
  
  var user = model()
    , condition = {};

  condition.$or = [
    {"name.name_zh": new RegExp("^" + keywords_.toLowerCase() + ".*$", "i")}
  , {"name.letter_zh": new RegExp("^" + keywords_.toLowerCase() + ".*$", "i")}
  ];
  
  user.find(condition).select('_id name photo title')//.skip(0).limit(5)
    .sort({"name.name_zh": 'asc'})
    .exec(function(err, users){
      callback_(err, users);
    });
}


/**
 * 获取以给定字母开头的用户一览，同时可以只检索朋友（朋友=关注我的人）
 * @param {String} head_        用户名的首字母，可以为空
 * @param {String} uid_         对象用户ID，可以为空
 * @param {String} start_       开始位置
 * @param {String} limit_       返回个数
 */
exports.headMatch = function(head_, start_, limit_, callback_) {

  var user = model()
    , condition = {};

  if (head_) {
    condition.$or = [
      {"name.name_zh": new RegExp("^" + head_.toLowerCase() + ".*$", "i")}
    , {"name.letter_zh": new RegExp("^" + head_.toLowerCase() + ".*$", "i")}
    ];
  }

  user.find(condition)//.skip(start_ || 0).limit(limit_ || 2)
    .sort({"name.name_zh": 'asc'})
    .exec(function(err, users){
      callback_(err, users);
    });
}


/**
 * headMatch with ids
 * 获取以给定字母开头的用户一览
 * @param {String} head_        用户名的首字母，可以为空
 * @param {String} uid_         对象用户ID
 * @param {String} start_       开始位置
 * @param {String} limit_       返回个数
 */
exports.headMatchByUids = function(head_, uids_, start_, limit_, callback_) {

  var user = model()
    , condition = {};

  if (head_) {
    condition.$or = [
      {"name.name_zh": new RegExp("^" + head_.toLowerCase() + ".*$", "i")}
    , {"name.letter_zh": new RegExp("^" + head_.toLowerCase() + ".*$", "i")}
    ];
  }

  if (uids_) {
    condition["_id"] = {$in: uids_};
  }

  user.find(condition)//.skip(start_ || 0).limit(limit_ || 20)
    .sort({"name.name_zh": 'asc'})
    .exec(function(err, groups){
      callback_(err, groups);
    });
}

/**
 * 检索关注我的人
 * 获取以给定字母开头的用户一览
 * @param {String} head_        用户名的首字母，可以为空
 * @param {String} uid_         对象用户ID
 * @param {String} start_       开始位置
 * @param {String} limit_       返回个数
 */
exports.follower = function(head_, uid_, start_, limit_, callback_) {
  var user = model()
    , condition = {};

  condition["following"] = uid_;

  if (head_) {
    condition.$or = [
      {"name.name_zh": new RegExp("^" + head_.toLowerCase() + ".*$", "i")}
    , {"name.letter_zh": new RegExp("^" + head_.toLowerCase() + ".*$", "i")}
    ];
  }

  user.find(condition)//.skip(start_ || 0).limit(limit_ || 20)
    .sort({"name.name_zh": 'asc'})
    .exec(function(err, groups){
      callback_(err, groups);
    });
}


/**
 * 检索我关注的人
 * 获取以给定字母开头的用户一览
 * @param {String} head_        用户名的首字母，可以为空
 * @param {String} uids_        我关注的人
 * @param {String} start_       开始位置
 * @param {String} limit_       返回个数
 */
exports.following = function(head_, uids_, start_, limit_, callback_) {

  var user = model()
    , condition = {};

  if (head_) {
    condition.$or = [
      {"name.name_zh": new RegExp("^" + head_.toLowerCase() + ".*$", "i")}
    , {"name.letter_zh": new RegExp("^" + head_.toLowerCase() + ".*$", "i")}
    ];
  }

  if (uids_) {
    condition["_id"] = {$in: uids_};
  }

  user.find(condition)//.skip(start_ || 0).limit(limit_ || 20)
    .sort({"name.name_zh": 'asc'})
    .exec(function(err, groups){
      callback_(err, groups);
    });
}


/**
 * 输出Schema情报
 */
exports.structure = function() {

  var k, t, result = [];
  
  User.eachPath(function(_key, _val){
    
    k = _val.options.description ? _val.options.description : _key;
    t = _val.options.type.name;

    if (Array.isArray(_val.options.type)) {
      t = "Array";
    }

    result.push({ key: k, type: t });
  });
  
  return result;
}


function model() {
  return conn().model('User', User);
}

