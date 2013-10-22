
var amqp = require('amqp')
  , mq = require('config').mq
  , thumbq = require('config').thumbq
  , mq_photo = require('config').mq_photo
  , mq_apn = require('config').mq_apn;


exports.smartThumb = function(message){
  publish(thumbq, thumbq.queue, message);
};

/**
 * 分词，参数格式如下：
 *    message: 文本
 *  , language: 语言，"chinese" || "japanese"
 *  , collection: 保存的Collection
 *  , _id: Collection中的ID
 */
exports.send = function(message){
  publish(mq, mq.queue, message);
};

/**
 * 通知
 */
exports.notice = function(message) {
  publish(mq, mq.queue, message);
};


/**
 * 处理图片？
 */
exports.sendPhoto = function(message){
  publish(mq_photo, mq_photo.queue, message);
};

/**
 * 通过APN发送通知
 */
exports.sendApn = function(message){
  publish(mq_apn, mq_apn.queue, message);
};

function publish(mqConfig, queueName, message) {
  var mqConn = amqp.createConnection(mqConfig);
  var maxListeners = mqConfig.maxListeners || 0;
  mqConn.setMaxListeners(maxListeners);

  var options = { mandatory: true };

  mqConn.on("ready", function(){
    mqConn.publish(queueName, message, { mandatory: true }, function(){
      mqConn.end();
    });
  });
}
