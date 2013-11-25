/**
 * @file 管理数据库连接
 *  默认的collection名称前面会自动添加prefix
 *  如果需要指定自定义的名称，则可以在schema里明确指出（为了对应多个应用共享一个数据库而设计）
 *  prefix与schema在config文件里定义.
 *  code是用来指定数据库实例的，当多个公司公用一个数据库是，每个公司的使用自己独立的数据库实例
 *  此时，数据库实例的名字即为coede（code是随机生成的8为数）.
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var _       = require("underscore")
  , mongo   = require("mongoose")
  , util    = require("util")
  , log     = require("./log")
  , conf    = process.env.TEST ? require("config").testdb : require("config").db;

/**
 * Connection map
 *  key   : code
 *  value : connection instance
 */
var connections = {};

/**
 * 创建一个新的连接
 * @param {String} host 数据库地址
 * @param {Number} port 数据库端口
 * @param {String} code 数据库标识符
 * @param {Number} pool 数据库连接池个数
 * @returns {Object} 数据库连接对象
 */
function createConnection(host, port, code, pool) {

  log.info("Database host: " + host);
  log.info("Database port: " + port);
  log.info("Database code: " + code);
  log.info("Database pool: " + pool);

  var conn = mongo.createConnection(
    util.format("mongodb://%s:%d/%s", host, port, code), { server: { poolSize: pool } }
  );

  connections[code] = conn;
  return conn;
}

/**
 * 取得连接
 * @param {String} code 数据库标识符
 * @returns {Object} 数据库连接对象
 */
function getMongoConnection(code) {

  // Set default dbname
  code = code || conf.dbname;

  var conn = connections[code];
  var host = conf.host;
  var port = conf.port;
  var poolSize = conf.pool;

  // 无连接
  if (!conn) {

    log.info("Create a connection.");
    return createConnection(host, port, code, poolSize);
  }

  // 如果连接被断开, 重新建立连接
  if (conn.readyState === 0) {

    log.info("Re-new the connection.");
    return createConnection(host, port, code, poolSize);
  }

  return conn;
}

/**
 * 获取指定collection的model
 * 如果该collection不存在，则会从新创建一个collection
 * 这时collection的名字会加前缀（前缀需在）
 * @param code 系统
 * @param name
 * @param schema
 */
exports.model = function(code, name, schema) {

  var conn = getMongoConnection(code)
    , collection = "";

  // 没有特别指定的collection名，统一添加前缀
  if (conf.schema && _.has(conf.schema, name)) {
    collection = conf.schema[name];
  } else {
    collection = (conf.prefix || "") + name;
  }

  log.debug("Collection name: " + collection);
  return conn.model(collection, schema);
};
