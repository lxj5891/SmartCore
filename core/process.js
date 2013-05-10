
/**
 * Process:
 * Copyright (c) 2013 Author Name l_li
 */

var app = require('config').app
  , amqp = require('../core/amqp')
  , exec = require('child_process').exec;


/**
 * 更新全文检索用索引
 *  全文检索以语言为单位，保存双份索引
 */
exports.updateFulltextIndex = function (id, type, data) {

  if (app.queue == "true") {

    // 经MQ启动
    amqp.send({
        "target": id
      , "type":type
      , "body": data
    });
console.log(data);
  }

  if (app.queue == "false") {

    // 启动命令
    var param = " " + id + " " + type + " '" + data + "'";

    // 直接启动
    var child = exec(app.analyzer + param, function(error, stdout, stderr){

      if (error != null) {
        console.log(error);
      }
    });
  }

}

/**
 * 发送通知消息
 */
exports.sendNotice = function (argument) {

  if (mq.enable) {
    // 经MQ启动

  } else {
    // 直接启动
  }
}

/**
 * 编辑图片
 */
exports.editPhoto = function (argument) {

  if (mq.enable) {
    // 经MQ启动

  } else {
    // 直接启动
  }
}


