var _         = require("underscore")
  , check     = require("validator").check
  , sanitize  = require("validator").sanitize
  , ctrl_notification = require("../controllers/ctrl_notification")
  , user      = require('../modules/mod_user')
  , group     = require("../modules/mod_group")
  , regi      = require('../modules/mod_register')
  , util      = require("../core/util")
  , amqp      = require('../core/amqp')
  , log       = require('../core/log')
  , error     = require('../core/errors')
  , auth      = require('../core/auth')
  , async     = require("async")
  , mail      = require("../core/mail");


/**
 * find user list by q
 */
exports.findUserList = function(q_, callback_){

  user.find(q_, function(err, result){
    if (err) {
      return callback_(new error.InternalServer(err));
    }

    if (!result) {
      return callback_(new error.NotFound(__("user.error.notFound")));
    }

    return callback_(err, result);
  });
};

/**
 * 获取用户信息
 */
exports.getUser = function(uid_, callback_){

  user.at(uid_, function(err, result){
    if (err) {
      return callback_(new error.InternalServer(err));
    }

    if (!result) {
      return callback_(new error.NotFound(__("user.error.notFound")));
    }

    //result.password = undefined;
    user.followerIds(uid_, function(err, followerIds){
      var json = result.toJSON();
      json.follower = followerIds;      
      return callback_(err, json);
    });
  });
};

/**
 * 给定复数个用户ID，获取用户详细信息列表
 */
exports.listByUids = function(uids_, start_, limit_, callback_){

  // 开始
  if (start_) {
    if (isNaN(start_)){
      return callback_(new error.BadRequest(__("user.error.wrongStart")));
    }
    start_ = start_ < 0 ? 0 : start_;
  }

  // 件数
  if (limit_) {
    if (isNaN(limit_)){
      return callback_(new error.BadRequest(__("user.error.wrongCount")));
    }

    // limit = 0默认获取所有数据，添加限制
    limit_ = limit_ < 1 ? 1 : limit_;
    limit_ = limit_ > 100 ? 100 : limit_;
  }

  user.many(uids_, start_, limit_, function(err, result){
    if (err) {
      return callback_(new error.InternalServer(err));
    }

    // 过滤密码
    _.each(result, function(item){
      item.password = undefined;
    });

    callback_(err, result);
  });
};

/**
 * 获取用户一览
 */
exports.getUserList = function(condition_, callback_){
  var kind_ = condition_.kind;
  var firstLetter_ = condition_.firstLetter;
  var uid_ = condition_.uid;
  var start_ = condition_.start;
  var limit_ = condition_.limit;
  var keywords_ = condition_.keywords;


  // 开始
  if (start_) {
    if (isNaN(start_)){
      return callback_(new error.BadRequest(__("user.error.wrongStart")));
    }
    start_ = start_ < 0 ? 0 : start_;
  }

  // 件数
  if (limit_) {
    if (isNaN(limit_)){
      return callback_(new error.BadRequest(__("user.error.wrongCount")));
    }

    // limit = 0默认获取所有数据，添加限制
    limit_ = limit_ < 1 ? 1 : limit_;
    limit_ = limit_ > 100 ? 100 : limit_;
  }

  // 首字母过滤
  if (firstLetter_) {
    firstLetter_ = sanitize(firstLetter_).xss();
  }

  if(!kind_){
    kind_ = "all";
  }

  // 获取所有用户
  if (kind_ == "all") {
    user.at(uid_, function(err, follower) {
      if (err) {
        return callback_(new error.InternalServer(err));
      }

      user.headMatch(firstLetter_, keywords_, start_, limit_, function(err, result){
        if (err) {
          return callback_(new error.InternalServer(err));
        }

        // 过滤密码, 标记是否已经关注
        _.each(result, function(item){
          if (follower) {
            item._doc.followed = _.some(follower.following, function(u){return u == item._id;});
          }
          item._doc.password = undefined;
        });

        exports._setUserDepartment(result, callback_);
      });
    });
  }

  // 获取关注我的人
  if (kind_ == "follower") {
    user.follower(firstLetter_, keywords_, uid_, start_, limit_, function(err, result){
      if (err) {
        return callback_(new error.InternalServer(err));
      }

      // 过滤密码
      _.each(result, function(item){
        item.password = undefined;
      });

      exports._setUserDepartment(result, callback_);
    });
  }

  // 获取我关注的人
  if (kind_ == "following") {
    user.at(uid_, function(err, result) {
      if (err) {
        return callback_(new error.InternalServer(err));
      }

      if (!result) {
        return callback_(new error.NotFound(__("user.error.notFound")));
      }

      var uids = result.following;
      user.following(firstLetter_, keywords_, uids, start_, limit_, function(err, result){
        if (err) {
          return callback_(new error.InternalServer(err));
        }

        // 过滤密码
        _.each(result, function(item){
          item.password = undefined;
        });

        exports._setUserDepartment(result, callback_);
      });

    });
  }

  if(kind_ == "group") {
    var gid = condition_.gid;
    group.at(gid, function(err, result){
      if (err) {
        return callback_(new error.InternalServer(err));
      }

      var uids = result.member;

      user.headMatchByUids(firstLetter_, keywords_, uids, start_, limit_, function(err, result){
        if (err) {
          return callback_(new error.InternalServer(err));
        }
        // callback_(err, result);
        exports._setUserDepartment(result, callback_);
      });
    });
  }

};


exports._setUserDepartment = function(users, callback){
  async.forEach(users, function(user, cb){
    var condition = {};
    condition.type = 2;
    condition.uid = user._id;
    condition.joined = true;
    group.headMatch(condition, function(err,groups){
      if(groups && groups.length > 0){
        user._doc.department = groups[0];
      }
      cb(err);
    });
  }, function(err){
    callback(err, users);
  });
};

/**
 * 创建用户
 */
exports.createUser = function(userid_, userinfo_, callback_) {

  var pass = util.checkString(userinfo_.password);
  var pass2 = util.checkString(userinfo_.password2);
  var username = util.checkObject(userinfo_.uname);
  var useremail = util.checkObject(userinfo_.email);
  // var usertel = util.checkObject(userinfo_.tel);
  var date = Date.now();

  var info = {"uid": username
    , "name": {"name_zh": username}
    , "password": auth.sha256(pass)
    , "email": {
      "email1": useremail
    }
    , createat: date
    , createby: userid_
    , updateat: date
    , updateby: userid_
  };

  // 校验密码
  if (!pass || !pass2) {
    return callback_(new error.BadRequest(__("user.error.emptyPwd")));
  }

  if (util.isAllNull(username)) {
    return callback_(new error.BadRequest(__("user.error.emptyName")));
  }

  // 密码
  if (pass !== pass2) {
    return callback_(new error.BadRequest(__("user.error.emptyName")));
  }

  // 邮件
  var retObj = checkEmail(useremail);
  if (retObj.code) {
    return callback_(new error.BadRequest(retObj));
  }

  // 电话
  // retObj = checkTel(usertel);
  // if (retObj.code) {
  //   return callback_(new error.BadRequest(retObj));
  // }

  // 确认登陆邮件
  user.find({"email": useremail}, function(err, result) {
    if (err) {
      return new callback_(error.InternalServer(__("user.error.foundError")));
    }

    if (result.length > 0) {
      return callback_(new error.BadRequest(__("user.error.registed")));
    }

    // 创建用户
    user.create(info, function(err, result){
      if (err) {
        return new callback_(error.InternalServer(__("user.error.savedError")));
      }

      // 过滤密码
      result.password = undefined;
      return callback_(err, result);
    });

  });
};


/**
 * 更新用户信息
 *
 */
exports.updateUser = function(currentuser, obj, callback_){

  var u = util.checkObject(obj);
  var uid = u._id;

  if(!uid || (currentuser && uid !== currentuser._id)){
    return callback_(new error.BadRequest(__("user.error.wrongId")));
  }

  if(util.isAllNull(u.name)){
    return callback_(new error.BadRequest(__("user.error.emptyName")));
  }
  
  // TODO
  // 2013/6/28 临时对应先不验证邮箱
  if (u.email) {
    var retObj = checkEmail(u.email);
    if(retObj.code){
      return callback_(new error.BadRequest(retObj.msg));
    }

    retObj = checkTel(u.tel);
    if(retObj.code){
      return callback_(new error.BadRequest(retObj.msg));
    }
  }
  

  var newval = {};
  var password_new = u.password_new;
  if(password_new) {
    var pwd = password_new.pwd;
    var pwd1 = password_new.pwd1;

    if(u.password !== auth.sha256(pwd)){
      return callback_(new error.BadRequest(__("user.error.wrongPwd")));
    }

    newval.password = auth.sha256(pwd1);
  }

  var photo = u.photo;
  if(photo){
    amqp.sendPhoto({
        "id": uid
      , "fid": photo.fid
      , "x": photo.x
      , "y": photo.y
      , "width": photo.width
      , "collection": "users"
      });
  }
  
  if (u.tel) {
    newval.tel = u.tel;
  }

  if (u.name) {
    newval.name = u.name;
  }

  if (u.email) {
    newval.email = u.email;
  }

  if(u.custom) {
    newval.custom = u.custom;
  }

  if(u.title) {
    newval.title = u.title;
  }

  if(u.address) {
    newval.address = u.address;
  }

  if(u.birthday) {
    newval.birthday = u.birthday;
  }

  if(u.lang) {
    newval.lang = u.lang;
  }

  if(u.timezone) {
    newval.timezone = u.timezone;
  }

  user.update(uid, newval, function(err, result){
    return callback_(err, result);
  });
};

/**
 * 验证是否可以登陆
 */
exports.approved = function (userid_, passwd_, callback_) {

  if (!userid_ || !passwd_) {
    return callback_(new error.BadRequest("There is no user name or bad password."));
  }

  // 查询数据库
  //yukari 追加无效,和删除flag
  user.find({"uid": userid_,"valid":1,"active":1}, function(err, result) {

    // 查询出错
    if (err) {
      return callback_(new error.InternalServer("Failed to get user information."));
    }

    // 用户不存在
    if (!result || result.length <=0) {
      return callback_(new error.NotFound("The user does not exist."));
    }

    // 用户密码不正确
    if (result[0].password !== auth.sha256(passwd_)) {
      return callback_(new error.BadRequest("The password is incorrect."));
    }

    return callback_(null, result[0]);
  });

};

exports.uploadPhoto = function(uid_, fid_, callback_){
  log.out("debug", "user photo start upload");

  user.update(uid_, {"photo": {big: fid_}, "editby": uid_, "editat": new Date()}, function(err, result){
    if (err) {
      return callback_(new error.InternalServer(err));
    }

    return callback_(err, result);
  });
};

exports.setPhoto = function(req/*, res*/){
  var id = req.body.id;
  var fid = req.body.fid;
  var x = req.body.x;
  var y = req.body.y;
  var width = req.body.width;
  
  amqp.sendPhoto({
      "id": id
    , "fid": fid
    , "x": x
    , "y": y
    , "width": width
    , "collection": "users"
    });
};

/**
 * 加关注
 */
exports.follow = function(currentuid_, followeruid_, callback_){

  if (!followeruid_) {
    return callback_(new error.BadRequest(__("user.error.emptyName")));
  }

  if (!currentuid_) {
    return callback_(new error.BadRequest(__("user.error.wrongUser")));
  }

  if (followeruid_ == currentuid_) {
    return callback_(new error.BadRequest(__("user.error.cannotFollowSelf")));
  }

  user.at(currentuid_, function(err, result) {
    if (err) {
      return callback_(new error.InternalServer(err));
    }

    if (!result) {
      return callback_(new error.NotFound(__("user.error.notFound")));
    }

    user.follow(currentuid_, followeruid_, function(err, result) {
      if (err) {
        return callback_(new error.InternalServer(err));
      }
      // console.log(result);
      var follow = {
        currentuid_: currentuid_,
        followeruid_:followeruid_
      };

      ctrl_notification.createForFollow(follow);
      return callback_(err, result.friends);
    });
  });
};

/**
 * 取消关注
 */
exports.unfollow = function(currentuid_, followeruid_, callback_){

  user.at(currentuid_, function(err, result) {
    if (err) {
      return callback_(new error.InternalServer(err));
    }

    if (!result) {
      return callback_(new error.NotFound(__("user.error.notFound")));
    }

    user.unfollow(currentuid_, followeruid_, function(err, result) {
      if (err) {
        return callback_(new error.InternalServer(err));
      }

      return callback_(err, result.friends);
    });
  });

};


/**
 * 注册新邮箱
 */
exports.register = function(email_, host_, callback_){

  // 生成uuid
  var emailtoken = auth.uuid()
    , data = {
      "email": email_
    , "uuid": emailtoken
    , "createat": Date.now()
    };

  // uuid和邮件配对保存到数据库中
  regi.create(data, function(err/*, result*/){
    if (err) {
      return callback_(new error.InternalServer(err));
    }

    // 发送邮件
    mail.sendMail(email_, emailtoken, host_, function(err, result) {
      if (err) {
        return callback_(new error.InternalServer(err));
      }

      return callback_(err, result);
    });
  });

};

/**
 * 确认注册的邮箱
 */
exports.registerConfirm = function(email_, emailtoken_, callback_){

  // 确认token，邮箱是否匹配
  regi.find(emailtoken_, function(err, result){
    if (err) {
      return callback_(new error.InternalServer(err));
    }

    if (!result || result.length <= 0) {
      return callback_(new error.Forbidden(__("user.error.wrongToken")));
    }

    if (email_ != result[0].email) {
      return callback_(new error.Forbidden(__("user.error.wrongEmailConfirm")));
    }

    // 生成用户信息
    var userinfo = {
        password: email_
      , password2: email_
      , uname: email_
      , email: email_
      };

    // TODO: 设定正确的系统管理员的ID
    exports.createUser("0", userinfo, function(err, result){
      if (err) {
        return callback_(new error.InternalServer(err));
      }
      return callback_(err, result);
    });
  });

};


//***************************private function and variable*********************
function isEmail(email){
  try{
    check(email).isEmail();
    return true;
  }catch(e){
    return false;
  }
}

function isTel(tel){
  try{
    check(tel).regex(util.getTelRegex());
    return true;
  }catch(e){
    return false;
  }
}

function checkEmail(email){
  var ret = {};
  if(util.isAllNull(email)){
    ret.code = 400;
    ret.msg = __("user.error.emptyEmail");
    return ret;
  }
  if("object" !== typeof(email)){
    if(!isEmail(email)){
      ret.code = 400;
      ret.msg = __("user.error.wrongEmail");
    }
  }else{
    for(var p in email){
      if(!isEmail(email[p])){
        ret.code = 400;
        ret.msg = __("user.error.wrongEmail");
        break;
      }
    }
  }
  return ret;
}

function checkTel(tel){
  var ret = {};
  if(util.isAllNull(tel)){
    ret.code = 400;
    ret.msg = __("user.error.emptyTel");
    return ret;
  }
  if("object" !== typeof(tel)){
    if(!isTel(tel)){
      ret.code = 400;
      ret.msg = __("user.error.wrongTel");
    }
  }else{
    for(var p in tel){
      if(!isTel(tel[p])){
        ret.code = 400;
        ret.msg = __("user.error.wrongTel");
        break;
      }
    }
  }
  return ret;
}

// function hideUserProperties(u){
//   u.password = undefined;
//   u.expire = undefined;
// }


/**
 * 给指定的Object添加用户信息，该Object需要包User的ID
 */
exports.appendUser = function(data, uidcolumn, callback_) {

  var uids = [];

  _.each(data, function(one) {
    uids.push(one[uidcolumn]);
  });

  user.find({"_id": {$in: uids}}, function(err, users){
   
    // 将Mongoose对象变成普通的Object
    // var result = JSON.parse(JSON.stringify(data));

    // 添加用户信息
    _.each(data, function(one){
      var u = _.find(users, function(item){return one[uidcolumn] == item._id;})
        , target = one._doc || one;

      if (u) {
        target.user = {"_id": u._id, "name": u.name, "photo": u.photo, "title": u.title};
      }
    });

    callback_(err, data);
  });

};

//yukri
exports.list = function(start_, limit_,companyid_, callback_) {

    var start = start_ || 0
        , limit = limit_ || 20
        , condition = {
              valid  : 1
            , companyid:  companyid_
        };
    user.total(companyid_,function(err, count){
        if (err) {
            return callback_(new error.InternalServer(err));
        }
        user.list(condition, start, limit, function(err, result){
            console.log(err);
            if (err) {
                return callback_(new error.InternalServer(err));
            }
            return callback_(err,  {totalItems: count, items:result});
        });
    });
};

exports.add = function (uid,  userInfo, callback_) {
    userInfo.createat = new Date();
    userInfo.createby = uid;
    userInfo.editat = new Date();
    userInfo.editby = uid;
    userInfo.uid = userInfo.userid;
    if (userInfo.password && userInfo.password.length < 20) {
      userInfo.password = auth.sha256(userInfo.password);
    }

    user.create(userInfo, function(err, result){
        if (err) {
            return callback_(new error.InternalServer(err));
        }
        return callback_(err, result);
    });
}

exports.update = function(uid_,userInfo, callback_) {
    userInfo.editat = new Date();
    userInfo.editby = uid_;
    if (userInfo.password && userInfo.password.length < 20) {
      userInfo.password = auth.sha256(userInfo.password);
    }
    user.update(userInfo.id, userInfo, function(err, result){
        if (err) {
            return callback_(new error.InternalServer(err));
        }

        return callback_(err, result);
    });

};
exports.searchOne = function( uid_, callback_) {
    user.searchOne(uid_, function(err, result){
        if (err) {
            return callback_(new error.InternalServer(err));
        }
        return callback_(err, result);
    });

};
exports.remove = function(uid_,compId_, callback_){
  var obj = {
    valid:0,
    editat:new Date(),
    editby:uid_
  };
  user.remove(compId_,obj,function(err,result){
    callback_(err, result);
  });
}
exports.active = function(uid_,compId_,active_ ,  callback_){
  var obj = {
    active:active_,
    editat:new Date(),
    editby:uid_
  };
  user.active(compId_,obj,function(err,result){
    callback_(err, result);
  });
}

