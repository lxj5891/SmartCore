/**
 * @file 日志API
 * @author lizheng
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

var json = require("../core/json")
  , log = require("../controllers/ctrl_log");

/**
 * getLogList:
 *  得到日志列表
 * Update On:
 *  2012/10/30 18:00
 * Resource Information:
 *  API - /log/list.json
 *  支持格式 - json
 *  HTTP请求方式 - GET
 *  是否需要登录 - YES
 *  访问授权限制 - NO
 * @return {code} 错误状态码
 * @return {msg} 错误信息
 * @return {result} 获取的日志对象列表
 */
exports.getLogList = function(req, res) {
  var condition = {
      startTime : req.query.startTime
    , endTime : req.query.endTime
    , user : req.query.user
    , host : req.query.host
    , source : req.query.source
    , type : req.query.type
    , level : req.query.level
    , category : req.query.category
    , code : req.query.code
    , message : req.query.message
    , start : req.query.start
    , limit : req.query.limit
    };

  log.total(condition, function(err, count) {
    if(err){
      return res.send(json.errorSchema(err.code, err.message));
    }else{
      if(count === 0) {
        return res.send(json.dataSchema({totalItems: count, items:[]}));
      } else {
        log.getList(condition, function(err, list) {
          if(err){
            return res.send(json.errorSchema(err.code, err.message));
          }else{
            return res.send(json.dataSchema({totalItems: count, items:list}));
          }
        });
      }
    }
  });
};

/**
 * getLogDetail:
 *  得到日志详情
 * Update On:
 *  2012/10/31 13:20
 * Resource Information:
 *  API - /log/detail.json
 *  支持格式 - json
 *  HTTP请求方式 - GET
 *  是否需要登录 - YES
 *  访问授权限制 - NO
 * @return {code} 错误状态码
 * @return {msg} 错误信息
 * @return {result} 获取的日志对象列表
 */
exports.getLogDetail = function(req, res) {

  log.get(req.query.id, function(err, result) {
    if(err){
      return res.send(json.errorSchema(err.code, err.message));
    }else{
      return res.send(json.dataSchema(result));
    }
  });
};


