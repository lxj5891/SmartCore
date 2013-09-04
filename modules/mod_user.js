/**
 * User:
 * Copyright (c) 2012 Author Name li
 */

var mongo = require('mongoose')
  //, util = require('util')
  , util = require("../core/util")
  , auth = require("../core/auth")
  // , log = require('../core/log')
//  , solr = require('../core/solr')
  , conn = require('./connection')
  , schema = mongo.Schema;

/**
 * User Schema
 */
var User = new schema({
    uid: {type: String, required: true}       // 登陆认证用，TODO:换成邮件登陆
  , password: {type: String, required: true}
  , type: {type:Number}                       // 用户类型， 默认0.   0: 普通用户, 1: 系统管理员, 2:DAC ,3 :dev
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

  // YUKARi 用
  , authority: {
        notice:{type:Number,description: "通知权限"}
       ,approve:{type:Number,description: "布局承认权限"}
    }
  , description: {type: String}
  , companyid:{type:String,description: "公司ID"}
  , valid: {type: Number, default:1, description: "0:无效 1:有效"}
  });


/**
 * 创建用户
 */
exports.create = function(user_, callback_){

  var user = model();

  new user(user_).save(function(err, result){
//    solr.update(result, "user", "insert", function(){});
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
};


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
// delete is a reserved word, cannot pass by jshint
// exports.delete = function(userid_, callback_){

//   var user = model();

//   user.findByIdAndRemove(userid_, function(err, result){
//     solr.update(result, "user", "delete", function(){});
//     callback_(err, result);
//   });
// };


/**
 * 更新用户信息
 */
exports.update = function(userid_, newvals_, callback_){

  var user = model();

  user.findByIdAndUpdate(userid_, newvals_, function(err, result){
    // solr.update(result, "user", "update", function(){});
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
};


/**
 * 获取以给定字母开头的用户一览，同时可以只检索朋友（朋友=关注我的人）
 * @param {String} head_        用户名的首字母，可以为空
 * @param {String} uid_         对象用户ID，可以为空
 * @param {String} start_       开始位置
 * @param {String} limit_       返回个数
 */
exports.headMatch = function(head_, keywords_, start_, limit_, callback_) {

  var user = model()
    , condition = {};

  if (keywords_) {
    condition.$or = [
      {"name.name_zh": new RegExp("^" + keywords_.toLowerCase() + ".*$", "i")}
    , {"name.letter_zh": new RegExp("^" + keywords_.toLowerCase() + ".*$", "i")}
    , {"email.email1": new RegExp("^" + keywords_.toLowerCase() + ".*$", "i")}
    , {"email.email2": new RegExp("^" + keywords_.toLowerCase() + ".*$", "i")}
    ];
  } else if (head_) {
    condition.$or = [
      {"name.name_zh": new RegExp("^" + head_.toLowerCase() + ".*$", "i")}
    , {"name.letter_zh": new RegExp("^" + head_.toLowerCase() + ".*$", "i")}
    ];
  }

  user.find(condition).skip(start_ || 0).limit(limit_ || 20)
    .sort({"name.name_zh": 'asc'})
    .exec(function(err, users){
      callback_(err, users);
    });
};


/**
 * headMatch with ids
 * 获取以给定字母开头的用户一览
 * @param {String} head_        用户名的首字母，可以为空
 * @param {String} uid_         对象用户ID
 * @param {String} start_       开始位置
 * @param {String} limit_       返回个数
 */
exports.headMatchByUids = function(head_, keywords_, uids_, start_, limit_, callback_) {

  var user = model()
    , condition = {};

  if (keywords_) {
    condition.$or = [
      {"name.name_zh": new RegExp("^" + keywords_.toLowerCase() + ".*$", "i")}
    , {"name.letter_zh": new RegExp("^" + keywords_.toLowerCase() + ".*$", "i")}
    , {"email.email1": new RegExp("^" + keywords_.toLowerCase() + ".*$", "i")}
    , {"email.email2": new RegExp("^" + keywords_.toLowerCase() + ".*$", "i")}
    ];
  } else if (head_) {
    condition.$or = [
      {"name.name_zh": new RegExp("^" + head_.toLowerCase() + ".*$", "i")}
    , {"name.letter_zh": new RegExp("^" + head_.toLowerCase() + ".*$", "i")}
    ];
  }

  if (uids_) {
    condition._id = {$in: uids_};
  }

  user.find(condition)//.skip(start_ || 0).limit(limit_ || 20)
    .sort({"name.name_zh": 'asc'})
    .exec(function(err, groups){
      callback_(err, groups);
    });
};

/**
 * 检索关注我的人
 * 获取以给定字母开头的用户一览
 * @param {String} head_        用户名的首字母，可以为空
 * @param {String} uid_         对象用户ID
 * @param {String} start_       开始位置
 * @param {String} limit_       返回个数
 */
exports.follower = function(head_, keywords_, uid_, start_, limit_, callback_) {
  var user = model()
    , condition = {};

  condition.following = uid_;

  if (keywords_) {
    condition.$or = [
      {"name.name_zh": new RegExp("^" + keywords_.toLowerCase() + ".*$", "i")}
    , {"name.letter_zh": new RegExp("^" + keywords_.toLowerCase() + ".*$", "i")}
    , {"email.email1": new RegExp("^" + keywords_.toLowerCase() + ".*$", "i")}
    , {"email.email2": new RegExp("^" + keywords_.toLowerCase() + ".*$", "i")}
    ];
  } else if (head_) {
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
};


/**
 * 检索我关注的人
 * 获取以给定字母开头的用户一览
 * @param {String} head_        用户名的首字母，可以为空
 * @param {String} uids_        我关注的人
 * @param {String} start_       开始位置
 * @param {String} limit_       返回个数
 */
exports.following = function(head_, keywords_, uids_, start_, limit_, callback_) {

  var user = model()
    , condition = {};

  if (keywords_) {
    condition.$or = [
      {"name.name_zh": new RegExp("^" + keywords_.toLowerCase() + ".*$", "i")}
    , {"name.letter_zh": new RegExp("^" + keywords_.toLowerCase() + ".*$", "i")}
    , {"email.email1": new RegExp("^" + keywords_.toLowerCase() + ".*$", "i")}
    , {"email.email2": new RegExp("^" + keywords_.toLowerCase() + ".*$", "i")}
    ];
  } else if (head_) {
    condition.$or = [
      {"name.name_zh": new RegExp("^" + head_.toLowerCase() + ".*$", "i")}
    , {"name.letter_zh": new RegExp("^" + head_.toLowerCase() + ".*$", "i")}
    ];
  }

  if (uids_) {
    condition._id = {$in: uids_};
  }

  user.find(condition)//.skip(start_ || 0).limit(limit_ || 20)
    .sort({"name.name_zh": 'asc'})
    .exec(function(err, groups){
      callback_(err, groups);
    });
};


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
};


function model() {
  return conn().model('User', User);
}

//yukari
// 获取用户有效件数
exports.total = function(condition,callback_){
    var user = model();
    user.count(condition).exec(function(err, count){
        callback_(err, count);
    });
};
exports.list = function(condition_, start_, limit_, callback_){

    var user = model();

    user.find(condition_)
        .skip(start_ || 0)
        .limit(limit_ || 20)
        .sort({createat: 'desc'})
        .exec(function(err, result){
            callback_(err, result);
        });
};
exports.searchOne = function(userid,callback_){

    var user = model();

    user.findById(userid, function(err, result){
        callback_(err, result);
    });
};
exports.remove = function(compId_,obj, callback_){
  var user = model();
  user.update({companyid:compId_},obj,{multi:true},function(err,result){
    callback_(err, result);
  });
}
exports.active = function(compId_,obj, callback_){
  var user = model();
  user.update({companyid:compId_},obj,{multi:true},function(err,result){
    callback_(err, result);
  });
}

exports.getTemplate = function(callback){
  var data = [
    [ // titles
      "uid(*)", "密码(默认uid邮件地址中@之前的名)", "邮件1", "邮件2", "中文名称", "中文拼音", "职位", "生日"
      ,"国家", "州", "省", "城市", "县", "行政区", "镇", "村", "街道", "公路", "邮编"
      ,"电话", "手机", "语言", "时区", "状态", "主页地址", "备注"
    ]
    ,[ // line1
      'temp@gmail.com', '', 'temp@gmail.com','', 'temp', 'temp', '', '2000/10/12'
      ,'China', '', 'Liao ning','dalian', 'sha he kou', '', '', '', '','', '116600'
      ,'0411-8888888', '+8113999999999', 'zh','GMT+08:00', '', 'http://www.baidu.com', ''
    ]
  ];
  callback(null, data);
};

exports.csvImportRow = function(exe_user, row, callback) {
  var user = model();
  var now = new Date();
  var u = {
    type:   0      // 用户类型， 默认0.   0: 普通用户, 1: 系统管理员
    ,active: 1
    ,companyid : exe_user.companyid
    ,valid : 1
  };
  if(row[0])  { u.uid                                              = row[0]; }
  if(row[1])  { u.password                                         = auth.sha256(row[1]); }
  if(row[2])  { u.email = u.email || {}; u.email.email1            = row[2]; }
  if(row[3])  { u.email = u.email || {}; u.email.email2            = row[3]; }
  if(row[4])  { u.name = u.name || {}; u.name.name_zh              = row[4]; }
  if(row[5])  { u.name = u.name || {}; u.name.letter_zh            = row[5]; }
  if(row[6])  { u.title                                            = row[6]; }
  if(row[7])  { u.birthday                                         = row[7]; }
  if(row[8])  { u.address = u.address || {}; u.address.country     = row[8]; }
  if(row[9])  { u.address = u.address || {}; u.address.state       = row[9]; }
  if(row[10]) { u.address = u.address || {}; u.address.province    = row[10]; }
  if(row[11]) { u.address = u.address || {}; u.address.city        = row[11]; }
  if(row[12]) { u.address = u.address || {}; u.address.county      = row[12]; }
  if(row[13]) { u.address = u.address || {}; u.address.district    = row[13]; }
  if(row[14]) { u.address = u.address || {}; u.address.township    = row[14]; }
  if(row[15]) { u.address = u.address || {}; u.address.village     = row[15]; }
  if(row[16]) { u.address = u.address || {}; u.address.street      = row[16]; }
  if(row[17]) { u.address = u.address || {}; u.address.road        = row[17]; }
  if(row[18]) { u.address = u.address || {}; u.address.zip         = row[18]; }
  if(row[19]) { u.tel = u.tel || {}; u.tel.telephone               = row[19]; }
  if(row[20]) { u.tel = u.tel || {}; u.tel.mobile                  = row[20]; }
  if(row[21]) { u.lang                                             = row[21]; }
  if(row[22]) { u.timezone                                         = row[22]; }
  if(row[23]) { u.status                                           = row[23]; }
  if(row[24]) { u.custom = u.custom || {}; u.custom.url            = row[24]; }
  if(row[25]) { u.custom = u.custom || {}; u.custom.memo           = row[25]; }

  u = util.checkObject(u);

  // Check uid
  if(!u.uid) {
    callback(new Error("uid不能为空"));
    return;
  }else if(u.uid == "admin") {
    callback(new Error("uid不能使用管理帐号"));
    return;
  }

  // Check password
  if(!u.password) {// 如果没输入用默认的uid做密码，如果是邮件取"@"前做密码
    /^(.*)@.*$/.test(u.uid);
    if(!RegExp.$1) {
      callback(new Error("密码不能为空"));
      return;
    }
    u.password = auth.sha256(RegExp.$1);
  }

  // Check email
  if(u.email) {
    if(u.email.email1 && !util.isEmail(u.email.email1)) {
      callback(new Error("邮件格式不正确"));
      return;
    }
    if(u.email.email2 && !util.isEmail(u.email.email2)) {
      callback(new Error("邮件格式不正确"));
      return;
    }
  }

  // Check tel
  if(u.tel) {
    if(u.tel.telephone && !util.isTel(u.tel.telephone)) {
      callback(new Error("电话号码格式不正确"));
      return;
    }
    if(u.tel.mobile && !util.isTel(u.tel.mobile)) {
      callback(new Error("手机号码格式不正确"));
      return;
    }
  }

  // Check language
  if(u.lang){
    if(u.lang != "zh" && u.lang != "en" && u.lang != "ja") {
      callback(new Error('语言入力不正确，目前语言只支持"zh","en","ja"'));
      return;
    }
  }else {
    u.lang = "zh"; // default language
  }

  // Check timezone
  if(u.timezone) {
    if(u.timezone != "GMT+08:00" && u.timezone != "GMT+09:00" && u.timezone != "GMT-05:00") {
      callback(new Error('时区格式不正确，目前支持的时区格式,中国"GMT+08:00", 日本"GMT+09:00", 美国"GMT-05:00"'));
      return;
    }
  }else {
    u.timezone = "GMT+08:00"; // default timezone
  }

  if(u.custom) {
    // Check url
    if(u.custom.url && !util.isUrl(u.custom.url)) {
      callback(new Error('主页地址格式不正确'));
      return;
    }
  }

  exports.find({"uid": u.uid}, function(err, result){
    if(result && result.length > 0){               // Update user
      u.editby = exe_user.uid;
      u.editat = now;

      exports.update(result[0]._id, u, function(err, result) {
        console.log('Update User.');
        callback(err, result);
      });
    } else {                                        // Create user
      u.createby = exe_user.uid;
      u.createat = now;
      u.editby = exe_user.uid;
      u.editat = now;

      exports.create(u, function(err, result) {
        console.log('Create User.');
        callback(err, result);
      });
    }
  });
}

exports.userTotalByComId = function(comid_, callback_) {
  var user = model();
  user.count({companyid:comid_,valid:1}).exec(function(err, count){
    callback_(err, count);
  });
};

