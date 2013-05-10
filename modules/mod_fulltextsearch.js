/**
 * FullTextSearch:
 * Copyright (c) 2013 Author Name li
 */

var _       = require("underscore")
  , mongo   = require('mongoose')
  , util    = require('util')
  , log     = require('../core/log')
  , conn    = require('./connection')
  , async   = require("async")
  , schema  = mongo.Schema;

/**
 * FullTextSearch Schema
 * 全文检索用索引，以分词后的单词为单位保存
 *
 * TODO: 考虑权限问题
 * TODO: 考虑文件大小的问题
 *
 */
var FullText = new schema({
    type: {type: String, description: "1:用户信息 2:组信息 3:消息信息 4:附件 5:文书 6:分类 7:私信"}
  , target: {type: String, description: "源"}
  , word: {type: String, description: "分词结果"}
  , lang: {type: String, description: "语言 japanese chinese"}
  , count: {type: Number, description: "单词出现的次数"}
  , createby: {type: String}
  , createat: {type: Date}
});

function model() {
  return conn().model('FullText', FullText);
}

/**
 * 创建索引
 */
exports.create = function(data_, callback_) {

  var fulltext = model();

  new fulltext(data_).save(function(err, result){
    callback_(err, result);
  });
};

exports.remove = function(condition_, callback_) {
  var fulltext = model();

  fulltext.remove(condition_, function(err, result){
    return callback_(err);
  });
}

/**
 * 关键字的模糊检索。前方一致检索，不区分大小写
 * 可以指定多个关键字，以数组的形式指定参数
 */
exports.search = function(words_, lang_, type_, start_, limit_, callback_) {

  var fulltext = model()
    , condition = {"lang": lang_, "type": type_}
    , start = start_ || 0
    , limit = limit_ || 20;

  // 数组
  if (words_ instanceof Array) {

    var or = [];
    _.each(words_, function(word){
      or.push(new RegExp("^" + word +'.*', "i"));
    });

    condition.$or = or;

  // 单个参数
  } else {

    condition.word = new RegExp("^" + words_.toLowerCase() +'.*', "i");
  }

  fulltext.find(condition).skip(start_).limit(limit_)
    .sort({"count": "desc"})
    .exec(function(err, result){
      callback_(err, result);
    });
};


