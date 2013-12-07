/**
 * @file MQ连接器
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var amqp = require("amqp")
  , mq = require("config").mq;

/**
 * 保存连接对象
 */
var connectionMap = {};

/**
 * MQ连接参数
 */
var args = {
    "host": mq.host
  , "port": mq.port
  , "user": mq.user
  , "password": mq.password
  };

var queueOption = {
    durable: true
  , autoDelete: false
  , confirm: false
  };

var messageOption = {
    mandatory: true
  , deliveryMode: 2
  };

/**
 * 获取连接
 * @param {String} queueName MQ的名称
 * @param {Function} callback 回调函数
 */
function getConnection(queueName, callback) {
  if (connectionMap[queueName]) {
    callback(connectionMap[queueName]);
    return;
  }

  args.queue = queueName;
  var connection = amqp.createConnection(args);
  connection.on("ready", function(){
    connection.queue(queueName, queueOption, function() {

      connectionMap[queueName] = connection;
      callback(connection);
    });
  });
}

/**
 * 向MQ发送消息
 * @param {String} queueName MQ的名称
 * @param {Object} message 要发送的消息
 */
exports.send = function(queueName, message) {
  getConnection(queueName, function(connection){
    connection.publish(queueName, message, messageOption);
  });
};
