var util = require('util')
  , log = require('../core/log')
  , json = require("../core/json")
  , dbfile = require('../controllers/ctrl_dbfile');

exports.ioshistory = function(req_,res_){
  var fid = req_.query.fid;
  dbfile.detail(fid, function(err, result){
    return res_.send(json.dataSchema({items:result.history}));
  });
}

exports.list = function(req_, res_) {

  var uid = req_.query.uid || req_.session.user._id
  , type = req_.query.type || "application"
  , start = req_.query.start
  , limit = req_.query.count;

  dbfile.list(uid, type, start, limit, function(err, result) {
    if (err) {
      return res_.send(err.code, json.errorSchema(err.code, err.message));
    } else {
      return res_.send(json.dataSchema(result));
    }    
  });
};
exports.detailNew = function(req_,res_) {
  var fid = req_.query.fid;
  dbfile.detail(fid, function(err, result){
    return res_.send(json.dataSchema({file:result.file,user:result.owner}));
  });
}
exports.detail = function(req_, res_) {
  var fid = req_.query.fid;
  dbfile.detail(fid, function(err, result){
    return res_.send(json.dataSchema({items: result}));
  });
}

exports.history = function(req_, res_) {
  var fid = req_.query.fid;
  dbfile.history(fid, function(err, result){
    return res_.send(json.dataSchema({items: result}));
  });
};

exports.follow = function(req_, res_){
  var fid = req_.body.fid
    , uid = req_.session.user._id;

  dbfile.follow(fid, uid, function(err, result){
    return res_.send(json.dataSchema({items: result}));
  });
};

exports.unfollow = function(req_, res_){
  var fid = req_.body.fid
    , uid = req_.session.user._id;

  dbfile.unfollow(fid, uid, function(err, result){
    return res_.send(json.dataSchema({items: result}));
  });
};

exports.download = function(req_, res_) {
  dbfile.download(req_.query._id, function(err, doc, info){
    if (err) {
      return res_.send(err.code, json.errorSchema(err.code, err.message));
    } else {
      res_.header('Content-Length', info.length);
      res_.attachment(info.filename);
      res_.contentType(info.filename);
      return res_.send(doc);
    }    
  });
}

exports.upload = function(req_, res_) {

  var uid = req_.session.user._id;
  var fid = req_.body.fid;

  // Get file list from the request
  var filearray;
  if (req_.files.files instanceof Array) {
    filearray = req_.files.files;
  } else {
    filearray = new Array();
    filearray.push(req_.files.files);
  }

  dbfile.save(uid, fid, filearray, function(err, result){
    if (err) {
      return res_.send(err.code, json.errorSchema(err.code, err.message));
    } else {
      return res_.send(json.dataSchema({items: result}));
    }    
  });
}

exports.save = function(req_, res_){

  var uid = req_.session.user._id;
  
  // Get file list from the request
  var filearray;
  if (req_.files.files instanceof Array) {
    filearray = req_.files.files;
  } else {
    filearray = new Array();
    filearray.push(req_.files.files);
  }

  dbfile.gridfsSave(uid, filearray, function(err, result){
    if (err) {
      return res_.send(err.code, json.errorSchema(err.code, err.message));
    } else {
      return res_.send(json.dataSchema({items: result}));
    }    
  });
};

