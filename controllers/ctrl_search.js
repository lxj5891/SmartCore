
var sync = require('async')
  , _       = require("underscore")
  , dbfile = require("../controllers/ctrl_dbfile")
  , user = require("../modules/mod_user")
  , group = require("../modules/mod_group")
  , solr      = require('../core/solr')
  , fulltext = require("../controllers/ctrl_fulltextsearch");


/**
 * 检索用户
 */
exports.user = function(condition_, callback_) {

  var keywords_ = condition_.keywords
    , login_ = condition_.login
    , scope_ = condition_.scope;

  sync.parallel({
    user: function(callback) {
      user.search(keywords_, function(err, users){
        if(scope_ == "1"){
          callback(err, users);
        }else{
          group.getAllUserByGid(scope_, function(err, uids){
            var result = [];
            _.each(users, function(u){
              if(_.contains(uids, u._id.toString())){
                result.push(u);
              }
            });
            callback(err, result);
          });
        }
      });
    },
    group: function(callback) {
      group.search(keywords_, function(err, groups){

        group.getAllGroupByUid(login_, function(err,viewable){
          var gids = [];
          var groupViewable = [];
          _.each(viewable, function(g){gids.push(g._id.toString());});
          _.each(groups, function(g){
            if(_.contains(gids,g._id.toString())){
              groupViewable.push(g);
            }
          });
          
          if(scope_ == "1"){
            callback(err, groupViewable);
          }else{
            group.childDepartments([scope_], function(err, children){
              var gids = [scope_];
              _.each(children, function(g){gids.push(g._id.toString());});
              //console.log(gids);
              var result = [];
              _.each(groupViewable, function(g){
                if(_.contains(gids, g._id.toString())){
                  result.push(g);
                }
              });
              callback(err, result);
            });
          }

        });

        
      });
    }
  },
  
  function(err, results){
    callback_(err, results);
  });

}

/**
 * 全机能检索
 */
exports.quick = function(uid_, keywords_, callback_) {
  
  sync.parallel({
    file: function(callback) {
      dbfile.search(keywords_, uid_, function(err, files){
        callback(err, files.slice(0,5));
      });
    },
    user: function(callback) {
      user.search(keywords_, function(err, users){
        callback(err, users.slice(0,5));
      });
    },
    group: function(callback) {
      group.search(keywords_, function(err, groups){
        group.getAllGroupByUid(uid_, function(err,viewable){
          var gids = [];
          var result = [];
          var index = 0;
          _.each(viewable, function(g){gids.push(g._id.toString());});
          _.each(groups, function(g){
            if(index < 5 && _.contains(gids,g._id.toString())){
              result.push(g);
              index++;
            }
          });
          callback(err, result);
        });
      });
    }
  },
  
  function(err, results){
    callback_(err, results);
  });

}

exports.full = function(uid_, keywords_, callback_) {
  
  sync.parallel({
    file: function(callback) {
      dbfile.search(keywords_,uid_,function(err, files){
        callback(err, files);
      });
    },
    user: function(callback) {
      user.search(keywords_, function(err, users){
        callback(err, users);
      });
    },
    group: function(callback) {
      group.search(keywords_, function(err, groups){
        group.getAllGroupByUid(uid_, function(err,viewable){
          var gids = [];
          var result = [];
          _.each(viewable, function(g){gids.push(g._id.toString());});
          _.each(groups, function(g){
            if(_.contains(gids,g._id.toString())){
              result.push(g);
            }
          });
          callback(err, result);
        });
      });
    }
    // message: function(callback) {
    //   fulltext.searchMessage(uid_, keywords_, "chinese", 0, 20, function(err, messages){
    //     callback(err, messages);
    //   });
    // }
    // filecontent: function(callback) {
    //   fulltext.searchFile(keywords_, "chinese", 0, 20, function(err, messages){
    //     callback(err, messages);
    //   });
    // }
  },
  
  function(err, results){
    callback_(err, results);
  });

}