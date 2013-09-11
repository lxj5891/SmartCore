/**
 * API User
 * Copyright (c) 2012 Author Name li
 */

var util = require("../core/util")
  , auth = require("../core/auth")
  , json = require("../core/json")
  , user = require('../controllers/ctrl_user')
  , dbfile = require("../controllers/ctrl_dbfile");


/**
 * Basic:
 *  Gets the user basic information.
 * Update On:
 *  2012/8/7 15:00
 * Resource Information:
 *  URL - /user/basic.json
 *  Response Formats - json
 *  HTTP Methods - GET
 *  Requires Authentication? - NO
 *  Rate Limited? - NO
 * Example:
 *  Resource URL - http://10.2.8.234:3000/user/basic.json?userid=u1
 *  Response Object - {
 *      uid: 'uid'
 *    , name: 'name'
 *    , email: 'email@a.jp'
 *    , photo: 'photo'
 *    }
 * @param {String} userid (required) user id.
 * @return {name} user name.
 * @return {email} email address.
 * @return {photo} photo.
 */

exports.basic = function(req, res) {
  res.send({
      name: 'name'
    , email: 'email@a.jp'
    , photo: 'photo'
    });
};

/**
 * Detail:
 *  Get user's detail information.
 * Update On:
 *  2012/8/7 17:00
 * Resource Information:
 *  URL - /user/detail.json
 *  Response Formats - json
 *  HTTP Methods - GET
 *  Requires Authentication? - NO
 *  Rate Limited? - NO
 * @param {String} userid (required) user id.
 * @return {bio} user bio.
 * @return {jobtitle} job title.
 * @return {department} department.
 * @return {telephone} telephone.
 * @return {birthday} birthday.
 * @return {contact} contact information.
 * @return {career} the information of the school and company. 
 */

exports.detail = function(req, res) {
  res.send({
    info: [{bio: 'bio'}, {jobtitle: 'jobtitle'}, {department: 'department'}, {birthday: 'birthday'}],
    contact: [{address: 'address'}, {telephone: 'telephone'}, {skypename: 'skypename'}],
    career: [{school: 'school'}, {company: 'company'}]
  });
};

/**
 * Update:
 *  Update the user detail information.
 * Update On:
 *  2012/8/7 17:00
 * Resource Information:
 *  URL - /user/update.json
 *  Response Formats - json
 *  HTTP Method - PUT
 *  Requires Authentication? - YES
 *  Rate Limited? - NO
 * @param {String}  uid -(required) user id 
 * @param {String}  name user name 
 * @param {String}  email email address
 * @param {String}  bio user bio
 * @param {String}  jobtitle job title
 * @param {String}  department department
 * @param {String}  address contact address
 * @param {String}  telephone contact telephone
 * @param {String}  skypename contact skypename
 * @param {String}  school school
 * @param {String}  company company
 * @return {result}1: update success.
 * @return {result}0: fail to update.
 */

exports.update = function (req, res) {
  res.send({result: 1});
};

/**
 * Delete:
 *  Delete the user detail information.
 * Update On:
 *  2012/8/6 17:00
 * Resource Information:
 *  URL - /user/delete.json
 *  Response Formats - json
 *  HTTP Method - Delete
 *  Requires Authentication? - YES
 *  Rate Limited? - NO
 * @param {String}  uid -(required) user id 
 * @param {String}  name user name 
 * @param {String}  email email address
 * @param {String}  bio user bio
 * @param {String}  jobtitle job title
 * @param {String}  department department
 * @param {String}  address contact address
 * @param {String}  telephone contact telephone
 * @param {String}  skypename contact skypename
 * @param {String}  school school
 * @param {String}  company company
 * @return {result}1: delete success.
 * @return {result}0: fail to delete.
 */

// delete is a reserved word, cannot pass by jshint
// exports.delete = function (req, res) {
//   res.send({result: 1});
// };

/**
 * Contact:
 *  Get user's contact information.
 * Update On:
 *  2012/8/3 17:00
 * Resource Information:
 *  URL - /user/contact.json
 *  Response Formats - json
 *  HTTP Methods - GET
 *  Requires Authentication? - NO
 *  Rate Limited? - NO
 * @param {String} userid (required) user id.
 * @return {address} address.
 * @return {telephone} telephone.
 * @return {skypename}  skypename.
 */

exports.contact = function(req, res) {
  res.send({
    contact: [{address: 'address'}, {telephone: 'telephone'}, {skypename: 'skypename'}]
  });
};

/**
 * Notify:
 *  Get the configuration information of the notification.
 * Update On:
 *  2012/8/3 17:00
 * Resource Information:
 *  URL - /user/notify.json
 *  Response Formats - json
 *  HTTP Methods - GET
 *  Requires Authentication? - NO
 *  Rate Limited? - NO
 * @param {String} userid (required) user id.
 */

exports.notify = function(req, res) {
  res.send({
  });
};

/**
 * Career:
 *  Get information of the school and company.
 * Update On:
 *  2012/8/3 17:00
 * Resource Information:
 *  URL - /user/career.json
 *  Response Formats - json
 *  HTTP Methods - GET
 *  Requires Authentication? - NO
 *  Rate Limited? - NO
 * @param {String} userid (required) user id.
 * @return {school} school.
 * @return {company} company.
 */

exports.career = function(req, res) {
  res.send({
    career: [{school: 'school'}, {company: 'company'}]
  });
};

/**
 * Atgroup:
 *  Get groups that user joined in.
 * Update On:
 *  2012/8/3 17:00
 * Resource Information:
 *  URL - /user/atgroup.json
 *  Response Formats - json
 *  HTTP Methods - GET
 *  Requires Authentication? - YES
 *  Rate Limited? - NO
 * @param {String} userid (required) user id.
 * @return {groups} groups that user joined in with number of the members，(to be determined)
 */

exports.atgroup = function(req, res) {
  res.send({
    groupid1: 'gname1',
    groupid2: 'gname2',
    groupid3: 'gname3'
  });
};

exports.structure = function(req, res) {
  var user = require("../modules/mod_user");
  res.send(user.structure());
};

/**
 * getUserBasicInfo:
 *  得到用户基本信息
 * Update On:
 *  2012/9/20 12:00
 * Resource Information:
 *  API - /user/basic_info.json
 *  支持格式 - json
 *  HTTP请求方式 - GET
 *  是否需要登录 - YES
 *  访问授权限制 - NO
 * Example:
 *  Resource - URL: http://localhost:3000/user/basic_info.json?uid=sh
 *  Resource - Object: {
 *  "code": 200,
 *  "msg": "成功获取用户基本信息",
 *  "user": {
 *    "__v": 0,
 *    "uid": "admin",
 *    "title": "SE",
 *    "lang": "chinese",
 *    "timezone": 8,
 *    "status": 1,
 *    "createby": "sh",
 *    "createat": "2012-09-20T06:59:03.667Z",
 *    "editby": "sh",
 *    "editat": "2012-09-20T06:59:03.667Z",
 *    "active": 1,
 *    "photo": {
 *      "big": "50581cfa54eb63c3b35095f8",
 *      "middle": "50581cfa54eb63c3b35095fa",
 *      "small": "50581cfa54eb63c3b35095fc"
 *    },
 *    "custom": {
 *      "url": "www.google.com"
 *    },
 *    "tel": {
 *      "telephone": "12345675678",
 *      "mobile": "12345675678"
 *    },
 *    "address": {
 *      "country": "中国",
 *      "province": "辽宁",
 *      "city": "大连",
 *      "district": "沙河口区",
 *      "state": "liaoning",
 *      "county": "什么县",
 *      "township": "什么乡",
 *      "village": "什么村",
 *      "street": "软件园",
 *      "road": "东路",
 *      "zip": "116023"
 *    },
 *    "uname": {
 *      "first": "admin",
 *      "middle": "middleName",
 *      "last": "lastName",
 *      "first_pinyin": "张",
 *      "middle_pinyin": "三",
 *      "last_pinyin": "毛",
 *      "first_kana": "ちょう",
 *      "middle_kana": "さん",
 *      "last_kana": "もう"
 *    },
 *    "email": {
 *      "email1": "admin@dac.com",
 *      "email2": "youremail@dac.com"
 *    }
 *  }
 *}
 * @param {String}  uid (required) 用户ID 
 * @return {code} 响应结果状态码
 * @return {msg} 响应结果信息
 * @return {user} 用户基本信息数据对象
 */
exports.getUser = function(req_, res_){

  user.getUser(req_.query._id, function(err, result){
    if (err) {
      return res_.send(err.code, json.errorSchema(err.code, err.message));
    } else {
      return res_.send(json.dataSchema(result));
    }
  });
};

exports.findUserList = function(req_, res_){
  var q = req_.query.q;
  var condition = JSON.parse(q);
  
  user.findUserList(condition, function(err, result){
    if (err) {
      return res_.send(err.code, json.errorSchema(err.code, err.message));
    } else {
      return res_.send(json.dataSchema({items: result}));
    }    
  });
};

/**
 * createUser:
 *  创建用户
 * Update On:
 *  2012/9/20 12:00
 * Resource Information:
 *  API - /user/create.json
 *  支持格式 - json
 *  HTTP请求方式 - POST
 *  是否需要登录 - YES
 *  访问授权限制 - YES
 * Example:
 *  Resource - URL: http://localhost:3000/user/create.json
 *  Resource - Object: {
 *  "code": 200,
 *  "msg": "创建用户成功",
 *  "user": {
 *    "__v": 0,
 *    "uid": "admin",
 *    "title": "SE",
 *    "lang": "chinese",
 *    "timezone": 8,
 *    "status": 1,
 *    "createby": "sh",
 *    "createat": "2012-09-20T06:59:03.667Z",
 *    "editby": "sh",
 *    "editat": "2012-09-20T06:59:03.667Z",
 *    "active": 1,
 *    "photo": {
 *      "big": "50581cfa54eb63c3b35095f8",
 *      "middle": "50581cfa54eb63c3b35095fa",
 *      "small": "50581cfa54eb63c3b35095fc"
 *    },
 *    "custom": {
 *      "url": "www.google.com"
 *    },
 *    "tel": {
 *      "telephone": "12345675678",
 *      "mobile": "12345675678"
 *    },
 *    "address": {
 *      "country": "中国",
 *      "province": "辽宁",
 *      "city": "大连",
 *      "district": "沙河口区",
 *      "state": "liaoning",
 *      "county": "什么县",
 *      "township": "什么乡",
 *      "village": "什么村",
 *      "street": "软件园",
 *      "road": "东路",
 *      "zip": "116023"
 *    },
 *    "uname": {
 *      "first": "admin",
 *      "middle": "middleName",
 *      "last": "lastName",
 *      "first_pinyin": "张",
 *      "middle_pinyin": "三",
 *      "last_pinyin": "毛",
 *      "first_kana": "ちょう",
 *      "middle_kana": "さん",
 *      "last_kana": "もう"
 *    },
 *    "email": {
 *      "email1": "admin@dac.com",
 *      "email2": "youremail@dac.com"
 *    }
 *  }
 *}
 * @param {String}  uid (required) 用户ID
 * @param {String}  uname (required) 用户名称
 * @param {String}  password (required) 用户密码 
 * @param {String}  password2 (required) 确认密码 
 * @param {String}  email (required) 邮箱 
 * @param {String}  telephone (required) 联系方式  
 * @return {code} 响应结果状态码
 * @return {msg} 响应结果信息
 * @return {user} 用户基本信息数据对象
 */
exports.createUser = function(req_, res_){
  user.createUser(req_.session.user._id, req_.body, function(err, result){
    if(err){
      return res_.send(json.errorSchema(err.code, err.message));
    }

    return res_.send(json.dataSchema(result));
  });
};

/**
 * updateUser:
 *  更新用户
 * Update On:
 *  2012/9/20 12:00
 * Resource Information:
 *  API - /user/update.json
 *  支持格式 - json
 *  HTTP请求方式 - POST
 *  是否需要登录 - YES
 *  访问授权限制 - NO
 * Example:
 *  Resource - URL: http://localhost:3000/user/update.json
 *  Resource - Object: {
 *  "code": 200,
 *  "msg": "更新用户成功",
 *  "user": {
 *    "__v": 0,
 *    "uid": "admin",
 *    "title": "SE",
 *    "lang": "chinese",
 *    "timezone": 8,
 *    "status": 1,
 *    "createby": "sh",
 *    "createat": "2012-09-20T06:59:03.667Z",
 *    "editby": "sh",
 *    "editat": "2012-09-20T06:59:03.667Z",
 *    "active": 1,
 *    "photo": {
 *      "big": "50581cfa54eb63c3b35095f8",
 *      "middle": "50581cfa54eb63c3b35095fa",
 *      "small": "50581cfa54eb63c3b35095fc"
 *    },
 *    "custom": {
 *      "url": "www.google.com"
 *    },
 *    "tel": {
 *      "telephone": "12345675678",
 *      "mobile": "12345675678"
 *    },
 *    "address": {
 *      "country": "中国",
 *      "province": "辽宁",
 *      "city": "大连",
 *      "district": "沙河口区",
 *      "state": "liaoning",
 *      "county": "什么县",
 *      "township": "什么乡",
 *      "village": "什么村",
 *      "street": "软件园",
 *      "road": "东路",
 *      "zip": "116023"
 *    },
 *    "uname": {
 *      "first": "admin",
 *      "middle": "middleName",
 *      "last": "lastName",
 *      "first_pinyin": "张",
 *      "middle_pinyin": "三",
 *      "last_pinyin": "毛",
 *      "first_kana": "ちょう",
 *      "middle_kana": "さん",
 *      "last_kana": "もう"
 *    },
 *    "email": {
 *      "email1": "admin@dac.com",
 *      "email2": "youremail@dac.com"
 *    }
 *  }
 *}
 * @param {String}  uname 用户名称 
 * @param {String}  email 邮箱 
 * @param {String}  telephone 联系方式
 * @param {String}  title 职称 
 * @return {code} 响应结果状态码
 * @return {msg} 响应结果信息
 * @return {user} 用户基本信息数据对象
 */
exports.updateUser = function(req_, res_){
  user.updateUser(req_.session.user, req_.body, function(err, result){
    if (err) {
      return res_.send(err.code, json.errorSchema(err.code, err.message));
    } else {
      req_.session.user = result;
      return res_.send(json.dataSchema(result));
    }
  });
};

/**
 * login:
 *  用户登录
 * Update On:
 *  2012/9/20 12:00
 * Resource Information:
 *  API - /user/login.json
 *  支持格式 - json
 *  HTTP请求方式 - POST
 *  是否需要登录 - NO
 *  访问授权限制 - NO
 * @param {String}  uid (required) 用户ID
 * @param {String}  password (required) 用户密码 
 */
exports.login = function(req_, res_, logined_filter){

  var userid = req_.query.name
    , passwd = req_.query.pass;

  user.approved(userid, passwd, function(err, result){
    if (err) {
      return res_.send(err.code, json.errorSchema(err.code, err.message));
    }

    // TODO: 在API内，不应该有迁移控制，应该拿到客户端实现。和Oauth一起实现
    auth.login(req_, res_, result);
    // 登陆成功后，返回前可在这里做一些处理。
    logined_filter(result);
    
    var out = json.dataSchema(result);
    out.home = req_.query.home || "message"; // 设置返回的home URL
    return res_.send(out);
  });
};

/**
 * logout:
 *  用户注销
 * Update On:
 *  2012/9/20 12:00
 * Resource Information:
 *  API - /user/logout.json
 *  支持格式 - json
 *  HTTP请求方式 - POST
 *  是否需要登录 - YES
 *  访问授权限制 - NO
 */
exports.logout = function(req_, res_){
  auth.logout(req_, res_);

  if (util.isBrowser(req_)) {
    return res_.redirect(req_.query.home || "/login");
  }
  return res_.send(json.dataSchema("success"));
};

/**
 * uploadPhoto:
 *  上传头像
 * Update On:
 *  2012/9/20 12:00
 * Resource Information:
 *  API - /user/upload_photo.json
 *  支持格式 - json
 *  HTTP请求方式 - POST
 *  是否需要登录 - YES
 *  访问授权限制 - NO
 * Example:
 *  Resource - URL: http://localhost:3000/user/upload_photo.json
 *  Resource - Object: {
 *  "code": 200,
 *  "msg": "上传头像成功",
 *  "fid": "505c2fcef2f7c2974f000028" 
 * } 
 * @param {FormData}  fd (required) 图片相关信息对象
 * @return {code} 响应结果状态码
 * @return {msg} 响应结果信息
 * @return {fid} 图片ID
 */
exports.uploadPhoto = function(req_, res_){

  var uid = req_.session.user._id;
  // Get file list from the request
  var filearray;
  if (req_.files.files instanceof Array) {
    filearray = req_.files.files;
  } else {
    filearray = [];
    filearray.push(req_.files.files);
  }

  dbfile.gridfsSave(uid, filearray, function(err, fileinfos){
    if(err){
      return res_.send(json.errorSchema(500, err));
    }else{
      return res_.send(json.dataSchema({items: fileinfos}));
    }
  });
};

/**
 * setPhoto:
 *  设置头像
 * Update On:
 *  2012/9/20 12:00
 * Resource Information:
 *  API - /user/set_photo.json
 *  支持格式 - json
 *  HTTP请求方式 - POST
 *  是否需要登录 - YES
 *  访问授权限制 - NO
 * @param {String}  uid (required) 用户ID
 * @param {String}  fid (required) 图片ID
 * @param {String}  x (required) x坐标
 * @param {String}  y (required) y坐标
 * @param {String}  width (required) 图片宽度
 */
exports.setPhoto = function(req, res){
  user.setPhoto(req, res);
};

/**
 * getUserList:
 *  查询用户列表
 * Update On:
 *  2012/10/31 12:00
 * Resource Information:
 *  API - /user/list.json
 *  支持格式 - json
 *  HTTP请求方式 - GET
 *  是否需要登录 - NO
 *  访问授权限制 - NO
 * @param {String}  uid 用户ID
 * @param {String}  firstLetter 首字母
 * @param {Number}  start 起始位置
 * @param {Number}  count 返回数量
 * @return {code} 错误状态码
 * @return {msg} 错误信息
 * @return {result} 查得的用户对象数组
 */
exports.getUserList = function(req_, res_){

  var firstLetter  = req_.query.firstLetter
    , uid = req_.query.uid || req_.session.user._id
    , start = req_.query.start
    , limit = req_.query.count
    , kind = req_.query.kind;

  var condition_ = {};
  condition_.kind = kind;
  condition_.firstLetter = firstLetter;
  condition_.uid = uid;
  condition_.start = start;
  condition_.limit = limit;
  condition_.gid = req_.query.gid;
  condition_.keywords = req_.query.keywords;

  user.getUserList(condition_, function(err, result){
    if (err) {
      return res_.send(err.code, json.errorSchema(err.code, err.message));
    } else {
      return res_.send(json.dataSchema({items: result}));
    }    
  });
};

/**
 * follow:
 *  关注某人
 * Update On:
 *  2012/10/31 12:00
 * Resource Information:
 *  API - /user/follow.json
 *  支持格式 - json
 *  HTTP请求方式 - POST
 *  是否需要登录 - YES
 *  访问授权限制 - NO
 * @param {String}  uid (required) 对象用户ID
 * @return {code} 错误状态码
 * @return {msg} 错误信息
 * @return {result} 对象用户的对象
 */
exports.follow = function(req_, res_){

  var currentuid = req_.session.user._id;
  user.follow(currentuid, req_.body.uid, function(err, result){
    json.send(res_, err, {"items": result});
  });
};

/**
 * unfollow:
 *  取消关注某人
 * Update On:
 *  2012/10/31 12:00
 * Resource Information:
 *  API - /user/unfollow.json
 *  支持格式 - json
 *  HTTP请求方式 - POST
 *  是否需要登录 - YES
 *  访问授权限制 - NO
 * @param {String}  uid (required) 对象用户ID
 * @return {code} 错误状态码
 * @return {msg} 错误信息
 * @return {result} 对象用户的对象
 */
exports.unfollow = function(req_, res_){

  var currentuid = req_.session.user._id;

  user.unfollow(currentuid, req_.body.uid, function(err, result){
    json.send(res_, err, {"items": result});
  });
};

/**
 * friends:
 *  Get Friends List
 * Update On:
 *  2013/02/08
 */
exports.friends = function(req_, res_) {

  var uids = req_.query.uids ? req_.query.uids.split(",") : []
    , start_ = req_.query.start || 0
    , limit_ = req_.query.limit || 20;

  user.listByUids(uids, start_, limit_, function(err, result){
    if (err) {
      return res_.send(err.code, json.errorSchema(err.code, err.message));
    } else {
      return res_.send(json.dataSchema({items: result}));
    }
  });

};

/**
 * 获取自己上传的文件列表
 */
exports.myFiles = function(req_, res_) {
  var uid = req_.session.user._id
    , type = req_.query.type || "application"
    , start = req_.query.start || 0
    , limit = req_.query.limit || 20;

  dbfile.list(uid, type, start, limit, function(err, result){
    if(err){
      return res_.send(json.errorSchema(err.code, err.message));
    }else{
      return res_.send(json.dataSchema({items: result}));
    }
  });
};

/**
 * 注册
 */
exports.register = function(req_, res_) {
  var email = req_.body.email
    , host = req_.headers.host;

  user.register(email, host, function(err, result){
    if (err) {
      return res_.send(err.code, json.errorSchema(err.code, err.message));
    } else {
      return res_.send(json.dataSchema(result));
    }
  });
};

/**
 * 完成注册
 */
exports.registerConfirm = function(req_, res_) {
  var emailtoken = req_.body.emailtoken
    , email = req_.body.email;

  user.registerConfirm(email, emailtoken, function(err, result){
    if (err) {
      return res_.send(err.code, json.errorSchema(err.code, err.message));
    } else {
      return res_.send(json.dataSchema(result));
    }
  });
};

//yukari
exports.list = function(req_, res_) {

    var start = req_.query.start
        , limit = req_.query.count
        , keyword = req_.query.keyword
        , company = req_.session.user.companyid
    user.list(start, limit, keyword, company, function(err, result) {
        if (err) {
            return res_.send(err.code, json.errorSchema(err.code, err.message));
        } else {
            return res_.send(json.dataSchema(result));
        }
    });
};
// 获取指定用户
exports.searchOne = function(req_, res_) {

    var userid = req_.query.userid;

    user.searchOne(userid, function(err, result) {
        if (err) {
            return res_.send(err.code, json.errorSchema(err.code, err.message));
        } else {
            return res_.send(json.dataSchema(result));
        }
    });
};
// 添加用户
exports.add = function(req_, res_) {

    var uid = req_.session.user._id;
    var userData = req_.body;
        userData.companyid = req_.session.user.companyid;
    user.add(uid, userData, function(err, result) {
        if (err) {
            return res_.send(err.code, json.errorSchema(err.code, err.message));
        } else {
            return res_.send(json.dataSchema(result));
        }
    });
};
// 更新用户
exports.update = function(req_, res_) {

    var uid = req_.session.user._id;
    user.update(uid, req_.body, function(err, result) {
        if (err) {
            return res_.send(err.code, json.errorSchema(err.code, err.message));
        } else {
            return res_.send(json.dataSchema(result));
        }
    });
};
// 下载模板
exports.downloadTemp = function(req_, res_) {
  user.downloadTemp(req_, res_);
};
// 用户一括登录
exports.import = function(req_, res_) {
  user.import(req_, res_);
};

