
var _         = require("underscore")
  , mongo     = require('mongoose')
  , util      = require('util')
  , log       = require('../core/log')
  , async     = require("async")
  , user      = require('../modules/mod_user')
  , fulltext  = require("../modules/mod_fulltextsearch")
  , dbfile    = require('../controllers/ctrl_dbfile.js')
  ;

/**
 * 创建索引
 */
exports.create = function(uid_, type_, target_, lang_, words_, callback_) {

  var date = new Date();

  async.forEach(words_, function(word, callback){

    var data = {
        "type": type_
      , "target": target_
      , "lang": lang_
      , "word": word.keyword
      , "count": word.count
      , "createby": uid_
      , "createat": date
    }

    fulltext.create(data, function(err, result){
      if (err) { 
        return callback_(new error.InternalServer(err)); 
      }
      callback(err, result);
    });

  }, function(err){
    err = err ? new error.InternalServer(err) : null;
    callback_(err, words_.length);
  });

};

/**
 * 检索全文检索索引表，获取消息ID，
 * 用这些消息ID，再获取消息详细信息
 */
exports.searchMessage = function(uid_, words_, lang_, start_, limit_, callback_) {

  // TODO: 权限控制
  var message = require("../modules/mod_message");

  fulltext.search(words_, lang_, "3", start_, limit_, function(err, result){
    if (err) {
      return callback_(new error.InternalServer(err));
    }

    var mids = [];
    _.each(result, function(mid) {
      mids.push(mid.target);
    });

    async.waterfall([
      function(callback) {
        message.listByIds(uid_, mids, function(err, result){
          err = err ? new error.InternalServer(err) : null;
          callback(err, result);
        });
      },

      function(msgs, callback) {

        var user = require('../controllers/ctrl_user');
        user.appendUser(msgs, "createby", function(err, result){
          callback(err, result);
        });
      }
    ]
    , function(err, result){
      callback_(err, result);
    });

  });
}

/**
 * 检索全文检索索引表，获取文件ID，
 * 用这些文件ID，再获取文件详细信息
 */
exports.searchFile = function(words_, lang_, start_, limit_, callback_) {

  // TODO: 权限控制

  fulltext.search(words_, lang_, "4", start_, limit_, function(err, result){
    if (err) {
      return callback_(new error.InternalServer(err));
    }

    var fids = [];
    _.each(result, function(mid) {
      fids.push(mid.target);
    });


    async.waterfall([
      function(callback) {
        dbfile.getByIds(fids, function(err, result) {
          err = err ? new error.InternalServer(err) : null;
          callback(err, result);
        });
      },

      function(msgs, callback) {
        var uids = [];
        _.each(msgs, function(msg) {
          uids.push(msg.createby);
        });

        user.find({"_id": {$in: uids}}, function(err, result){

          _.each(msgs, function(msg) {
            msg.user = _.find(result, function(u){u._id == msg.createby});
          });

          callback(err, result);
        });
      }
    ],
    function(err, result) {
      callback_(err, result);
    });

  });
}

exports.removeByTarget = function(target_, callback_) {
  fulltext.remove({"target": target_}, function(err, callback_) {
    err = err ? new error.InternalServer(err) : null;
    callback_(err, result);
  });
}

