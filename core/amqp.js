
var amqp = require('amqp')
  , mq = require('config').mq
  , thumbq = require('config').thumbq
  , mq_photo = require('config').mq_photo
  , mq_apn = require('config').mq_apn;


exports.smartThumb = function(message){
  var connection = amqp.createConnection(thumbq);
  var maxListeners = thumbq.maxListeners || 0;

  connection.setMaxListeners(maxListeners);

  connection.on('ready', function () {
    
    connection.publish(thumbq.queue, message);
  });
};

/**
 * 分词，参数格式如下：
 *    message: 文本
 *  , language: 语言，"chinese" || "japanese"
 *  , collection: 保存的Collection
 *  , _id: Collection中的ID
 */
exports.send = function(message){
  
  var connection = amqp.createConnection(mq);
  var maxListeners = mq.maxListeners || 0;

  connection.setMaxListeners(maxListeners);

  connection.on('ready', function () {
    connection.publish(mq.queue, message);
  });
};

/**
 * 通知
 */
exports.notice = function(message) {
  var connection = amqp.createConnection(mq);
  var maxListeners = mq.maxListeners || 0;

  connection.setMaxListeners(maxListeners);

  connection.on('ready', function() {
    connection.publish(mq.notification_queue, message);
  });
};


/**
 * 处理图片？
 */
exports.sendPhoto = function(message){
  var connection = amqp.createConnection(mq_photo);
  var maxListeners = mq_photo.maxListeners || 0;

  connection.setMaxListeners(maxListeners);

  connection.on("ready", function(){
    connection.publish(mq_photo.queue, message);
  });
};

/**
 * 通过APN发送通知
 */
exports.sendApn = function(message){
  var connection = amqp.createConnection(mq_apn);
  var maxListeners = mq_apn.maxListeners || 0;

  connection.setMaxListeners(maxListeners);

  connection.on("ready", function(){
    connection.publish(mq_apn.queue, message, { mandatory: true }, function(){
      connection.end();
    });
  });
};
