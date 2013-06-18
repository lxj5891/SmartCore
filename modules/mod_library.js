/**
 * Library:
 * Copyright (c) 2012 Author Name l_li
 */

var mongo = require('mongoose')
  , conn = require('./connection')
  , schema = mongo.Schema;

function model() {
  return conn().model('Library', Library);
}

var Library = new schema({
    name: {type: String, required: true}
  , file: {type: String, required: true}
  , thumbnail: {type: String}
  , type: {type: String}
  , category: {type: String}
  , description: {type: String}
  , createby: {type: String}
  , createat: {type: Date}
  , editby: {type: String}
  , editat: {type: Date}
  });

exports.create = function(file_, callback_) {

  var library = model();
  var file = new library(file_);

  file.save(function(err, ret) {
    callback_(err, ret);
  });

};

exports.at = function(id_, callback_) {
  var library = model();

  library.findById(id_, function(err, g) {
    callback_(err, g);
  });
};

exports.some = function(callback_) {
  var library = model();
  start_ = start_ > 0 ? start_ : 1;  //default value is 0
  firstLetter_ = firstLetter_ ? firstLetter_ : "";
  var reg = new RegExp("^" + firstLetter_.toLowerCase() + ".*$", "i");

  var fieldObj = {"name": reg};
  var optionObj = {"sort": {"name": "asc"}, "skip": start_-1};

  if(uid_){
    fieldObj.member = uid_;
  }
  if(count_){
    optionObj.limit = count_;
  }

  if(!gidArr_){
    library.find(fieldObj).setOptions(optionObj).exec(function(err, libraryList){
      callback_(err, libraryList);
    });
  }else{
    library.find(fieldObj).where("_id")
      //.in(gidArr_)
      .setOptions(optionObj)
      .exec(function(err, libraryList){
        callback_(err, libraryList);
      });
  }
};


exports.all = function(callback_) {
  var library = model();
  start_ = start_ > 0 ? start_ : 1;  //default value is 0
  firstLetter_ = firstLetter_ ? firstLetter_ : "";
  var reg = new RegExp("^" + firstLetter_.toLowerCase() + ".*$", "i");

  var fieldObj = {"name": reg};
  var optionObj = {"sort": {"name": "asc"}, "skip": start_-1};

  if(uid_){
    fieldObj.member = uid_;
  }
  if(count_){
    optionObj.limit = count_;
  }

  if(!gidArr_){
    library.find(fieldObj).setOptions(optionObj).exec(function(err, libraryList){
      callback_(err, libraryList);
    });
  }else{
    library.find(fieldObj)
      .where("_id")
      //.in(gidArr_)
      .setOptions(optionObj)
      .exec(function(err, libraryList){
        callback_(err, libraryList);
      });
  }
};


exports.search = function(keywords_, callback_) {
  
  var library = model()
    , regex = new RegExp("^" + keywords_.toLowerCase() +'.*', "i");
  
  library.find({name: regex})
    .select('_id name')
    .skip(0).limit(5)
    .sort({name: 'asc'})
    .exec(function(err, librarys){
      callback_(librarys);
    });
};


exports.list = function(callback_) {
  var library = model();
  start_ = start_ > 0 ? start_ : 1;  //default value is 0
  firstLetter_ = firstLetter_ ? firstLetter_ : "";
  var reg = new RegExp("^" + firstLetter_.toLowerCase() + ".*$", "i");

  var fieldObj = {"name": reg};
  var optionObj = {"sort": {"name": "asc"}, "skip": start_-1};

  if(uid_){
    fieldObj.member = uid_;
  }
  if(count_){
    optionObj.limit = count_;
  }

  if(!gidArr_){
    library.find(fieldObj).setOptions(optionObj).exec(function(err, libraryList){
      callback_(err, libraryList);
    });
  }else{
    library.find(fieldObj)
      .where("_id")
      //.in(gidArr_)
      .setOptions(optionObj)
      .exec(function(err, libraryList){
        callback_(err, libraryList);
      });
  }
};

exports.update = function(gid_, gobj_, callback_) {
  var library = model();

  library.findByIdAndUpdate(gid_, gobj_, function(err, g){
    callback_(err, g);
  });
};

exports.at = function(gid_, callback_){
  var library = model();

  library.findById(gid_, function(err, g){
    callback_(err, g);
  });
};

exports.find = function(args_, callback_){
  var library = model();

  library.find(args_, function(err, g){
    if(g && g.length < 1){
      g = null;
    }
    callback_(err, g);
  });
};

exports.remove = function(gid_, callback_){
  var library = model();
  library.findByIdAndRemove(gid_, function(err, g){
    callback_(err, g);
  });
};

exports.search = function(keywords_, callback_) {
  
  var library = model()
    , regex = new RegExp("^" + keywords_.toLowerCase() +'.*', "i");
  
  library.find({name: regex})
    .select('_id name')
    .skip(0).limit(5)
    .sort({name: 'asc'})
    .exec(function(err, librarys){
      callback_(librarys);
    });
};

exports.fullsearch = function(keywords_, callback_) {
  
  var library = model();
  library.find({keywords: keywords_})
    .select('_id name editby editat')
    .skip(0).limit(5)
    .sort({name: 'asc'})
    .exec(function(err, librarys){
      callback_(librarys);
    });
};
