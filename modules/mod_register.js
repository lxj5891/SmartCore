/**
 * Register:
 * Copyright (c) 2013 Author Name li
 */

var mongo = require('mongoose')
  , util = require('util')
  , log = require('../core/log')
  , conn = require('./connection')
  , schema = mongo.Schema;


/**
 * Register Schema
 */
var Register = new schema({
    email: {type: String}
  , uuid: {type: String}
  , createat: {type: Date}
});


/**
 * 创建注册信息
 */
exports.create = function(register_, callback_) {

  var register = model();

  new register(register_).save(function(err, ret){
    callback_(err, ret);
  });
};


/**
 * 获取指定ID的注册信息
 */
exports.at = function(id_, callback_){

  var register = model();

  register.findById(id_, function(err, result){
    callback_(err, result);
  });
};


/**
 * 删除注册信息
 */
exports.delete = function(id_, callback_){

  var register = model();

  register.findByIdAndRemove(id_, function(err, result){
    callback_(err, result);
  });
};

/**
 * 给定UUID检索注册信息
 */
exports.find = function(uuid_, callback_){

  var register = model();

  register.find({"uuid": uuid_}, function(err, result){
    callback_(err, result);
  });
};


function model() {
  return conn().model('Register', Register);
}
