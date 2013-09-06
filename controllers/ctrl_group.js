var log = require('../core/log')
  , error = require("../core/errors")
  , group = require("../modules/mod_group")
  , amqp  = require('../core/amqp')
  , ctrl_notification = require('../controllers/ctrl_notification')
  , _ = require("underscore");

exports.createGroup = function (g_, creator_, callback_) {

  if (!g_.name) {
    return callback_(new error.BadRequest("组织名称不能为空"));
  }

  var date = new Date()
    , member = g_.member;

  member.push(creator_);
  member = _._.uniq(member);

  var data = {
      "name": g_.name
    , "member": member
    , "secure": g_.secure
    , "type": "1"
    , "description": g_.description
    , "category": g_.category
    , "createby": creator_
    , "createat": date
    , "editby": creator_
    , "editat": date
    , "valid" : g_.valid      //yukari
    , "companyid" : g_.companyid //yukari
  };

  // 允许组织重名的组存在，所以不判断是否已经有同名的组
  group.create(data, function(err, result){
    err = err ? new error.InternalServer(err) : null;
    return callback_(err, result);
  });
};

/**
 *
 */
exports.getGroupList = function(condition_, callback_) {
  
  group.headMatch(condition_, function(err, result){
    err = err ? new error.InternalServer(err) : null;
    return callback_(err, result);
  });
};

/**
 * 获取指定UID所属的组
 */
exports.groupListByMember = function(uid_, start_, limit_, callback_) {
  group.headMatch(null, uid_, null, start_, limit_, function(err, result){
    err = err ? new error.InternalServer(err) : null;

    return callback_(err, result);
  });
}

/**
 * 给指定的组设定头像
 */
exports.updateGroupPhoto = function(gid_, uid_, fid_, callback_) {
  group.update(gid_, {"photo": {big: fid_}, "editby": uid_, "editat": new Date()}, function(err, result){
    return callback_(err ? new error.InternalServer(err) : null, result);
  });
}

exports.updateGroup = function(gobj_, callback_) {
  var gid = gobj_ ? gobj_._id : "";

  if(!gid){
    return callback_(new error.BadRequest("组织ID不能为空"));
  }

  var updateObj = {};
  for(var i in gobj_){
    if(i.toString() !== "_id"){
      if(i.toString() == "photo"){
        var photo = gobj_[i];
        if(photo){
          amqp.sendPhoto({
              "id": gid
            , "fid": photo.fid
            , "x": photo.x
            , "y": photo.y
            , "width": photo.width
            , "collection": "groups"
          });
        }
      } else{
        updateObj[i] = gobj_[i];
      }
    }
  }
  updateObj.member = _._.uniq(updateObj.member);
  group.update(gid, updateObj, function(err, g) {
    err = err ? new error.InternalServer(err) : null;
    return callback_(err, g);
  });
};

exports.setPhoto = function(req, res){
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
    , "collection": "groups"
  });
};

exports.getGroup = function(gid_, callback_){
  if(!gid_){
    return callback_(new error.BadRequest("组织ID为空"));
  }

  group.at(gid_, function(err, g){
    err = err ? new error.InternalServer(err) : null;
    return callback_(err, g);
  });
};

exports.deleteGroup = function(gid_, callback_){
  if(!gid_){
    return callback_(new error.BadRequest("组织ID不能为空"));
  }

  group.delete(gid_, function(err, g){
    err = err ? new error.InternalServer(err) : null;
    return callback_(err, g);
  });
};

exports.addMember = function(gid_, uid_, userid_, callback_){

  uid_ = uid_ || userid_;
  if (!uid_) {
    return callback_(new error.BadRequest("无效的用户"));
  }

  if (!gid_) {
    return callback_(new error.BadRequest("组织ID不能为空"));
  }

  

  group.addMember(gid_, uid_, function(err, result){
    err = err ? new error.InternalServer(err) : null;
    // console.log(result);
    if(uid_!=userid_){
      //发通知
      var invite = {
        uid       : uid_
      , userid    : userid_  
      , type      : "invite"
      , msg       : "被加入"
      , groupName : result.name.name_zh
      , groupId   : result._id
      }
      ctrl_notification.createForInvite(invite);
    }
    return callback_(err, result);
  });

  // group.at(gid_, function(err, g){
  //   if(err){
  //     return callback_(new error.InternalServer(err));
  //   }else{
  //     if(uids_ === undefined){ //login user want to join this topic
  //       if(userid_ == g.createby){
  //         return callback_(new error.BadRequest("当前用户为创建者，请添加其他用户"));
  //       }else if(_.contains(g.member, userid_)){
  //         return callback_(new error.BadRequest("已经在该组织中了"));
  //       }else{
  //         g.member.push(userid_);
  //         g.save(function(err, result){
  //           err = err ? new error.InternalServer(err) : null;
  //           return callback_(err, result);
  //         });
  //       }
  //     }else{
  //       uids_ = uids_.split(",");
  //       if(uids_){
  //         for(var i = 0; i < uids_.length; i++){
  //           if(!_.contains(g.member, uids_[i])){
  //             g.member.push(uids_[i]);
  //           }
  //         }
  //         g.save(function(err, result){
  //           err = err ? new error.InternalServer(err) : null;
  //           return callback_(err, result);
  //         });
  //       }
  //     }
  //   }
  // });
};

exports.removeMember = function(gid_, uid_, userid_, callback_){

  uid_ = uid_ || userid_;
  if (!uid_) {
    return callback_(new error.BadRequest("无效的用户"));
  }

  if (!gid_) {
    return callback_(new error.BadRequest("组织ID不能为空"));
  }

  group.removeMember(gid_, uid_, function(err, result){
    err = err ? new error.InternalServer(err) : null;
    // console.log(result);
    if(uid_!=userid_){
      //发通知
      var remove = {
        uid       : uid_
      , userid    : userid_  
      , type      : "remove"
      , msg       : "被移除"
      , groupName : result.name.name_zh
      , groupId   : result._id
      }
      ctrl_notification.createForRemove(remove);
    }
    return callback_(err, result);
  });

  // group.at(gid_, function(err, g){
  //   if(err){
  //     return callback_(new error.InternalServer(err));
  //   }else{
  //     if(uids_ === undefined){
  //       if(userid_ == g.createby){
  //         return callback_(new error.BadRequest("当前用户为创建者，只能删除组织不能退出组织"));
  //       }else if(!_.contains(g.member, userid_)){
  //         return callback_(new error.BadRequest("当前用户并未在该组织中"));
  //       }else{
  //         g.member = removeOneMember(g.member, userid_, g.createby);
  //         g.save(function(err, result){
  //           err = err ? new error.InternalServer(err) : null;
  //           return callback_(err, result);
  //         });
  //       }
  //     }else{
  //       uids_ = uids_.split(",");
  //       if(uids_){
  //         for(var i = 0; i < uids_.length; i++){
  //           g.member = removeOneMember(g.member, uids_[i], g.createby);
  //         }

  //         g.save(function(err, result){
  //           err = err ? new error.InternalServer(err) : null;
  //           return callback_(err, result);
  //         });
  //       }
  //     }
  //   }
  // });
};

/**
 * 获取组的成员一览
 */
exports.getMember = function(gid_, firstLetter, start_, limit_, callback_){
  group.at(gid_, function(err, result){
    if (err) {
      return callback_(new error.InternalServer(err));
    }

    var user = require("../modules/mod_user")
      , uids = result.member;

    user.headMatchByUids(firstLetter, "", uids, start_, limit_, function(err, result){
      if (err) {
        return callback_(new error.InternalServer(err));
      }
      callback_(err, result);
    });
  });
};

//***************************private function*********************
function removeOneMember(member, id, creator){
  for(var i = 0; i < member.length; i++){
    if(member[i] == id && id != creator){
      member.splice(i, 1);
    }
  }
  return member;
}

//yukari
exports.list = function(start_, limit_,companyid_, callback_) {

  var start = start_ || 0
    , limit = limit_ || 20
    , condition = {
            valid:1
            ,companyid : companyid_
    };
  group.total(condition,function(err, count){
    if (err) {
      return callback_(new error.InternalServer(err));
    }
    group.list(condition, start, limit, function(err, result){
      console.log(err);
      if (err) {
        return callback_(new error.InternalServer(err));
      }
      return callback_(err,  {totalItems: count, items:result});
    });
  });
};
/**
 * 获取组的成员一览
 */
exports.getGroupWithMemberByGid = function(gid_, callback_){
  group.at(gid_, function(err, group){
    if (err) {
      return callback_(new error.InternalServer(err));
    }

    var user = require("../modules/mod_user")
      , uids = group.member;

    user.headMatchByUids("", "", uids, "0", "0", function(err, result){
      if (err) {
        return callback_(new error.InternalServer(err));
      }
      group._doc.users = result;
      callback_(err, group);
    });
  });
};


// get group list by ids
exports.listByGids = function(gids_, start_, limit_, callback_){

  // 开始
  if (start_) {
    if (isNaN(start_)){
      return callback_(new error.BadRequest(__("group.error.wrongStart")));
    }
    start_ = start_ < 0 ? 0 : start_;
  }

  // 件数
  if (limit_) {
    if (isNaN(limit_)){
      return callback_(new error.BadRequest(__("group.error.wrongCount")));
    }

    // limit = 0默认获取所有数据，添加限制
    limit_ = limit_ < 1 ? 1 : limit_;
    limit_ = limit_ > 100 ? 100 : limit_;
  }

  group.many(gids_, start_, limit_, function(err, result){
    if (err) {
      return callback_(new error.InternalServer(err));
    }

    callback_(err, result);
  });
};
