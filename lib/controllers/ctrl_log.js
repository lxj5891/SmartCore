/**
 * @file 日志的controller
 * @author lizheng
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

var error = require("../core/errors")
  , util=require("../core/util")
  , log = require("../modules/mod_log");

/**
 * 获取日志件数
 * @param rawCondition 查询条件
 * @param callback 返回件数
 */
exports.total = function(rawCondition, callback) {

  var condition = createCondition(rawCondition);

  log.total(condition, function(err, count) {
    err = err ? new error.InternalServer(err) : null;
    return callback(err, count);
  });

};

/**
 * 获取日志一览
 * @param rawCondition 查询条件
 * @param start 数据开始位置
 * @param limit 数据件数
 * @param callback 返回日志一览
 */
exports.getList = function(rawCondition, callback) {

  var condition = createCondition(rawCondition);

  log.getList(condition, rawCondition.start, rawCondition.limit, function(err, result) {
    err = err ? new error.InternalServer(err) : null;
    return callback(err, result);
  });

};

/**
 * 获取日志详情
 * @param docId 文档标识
 * @param callback 返回日志详情
 */
exports.get = function(docId, callback) {

  log.get(docId, function(err, result){
    err = err ? new error.InternalServer(err) : null;
    return callback(err, result);
  });

};

/**
 * 条件组合
 * @param rawCond 原始条件
 * @returns {{$and: Array}}
 */
function createCondition(rawCond) {

  var conds = [];

  if(rawCond.startTime) { // 日志输出的开始时间
    conds.push({ time : { $gt: Number(rawCond.startTime) } });
  }
  if(rawCond.endTime) { // 日志输出的结束时间
    conds.push({ time : { $lte: Number(rawCond.endTime) } });
  }

  var arr = ["user", "host", "source", "type", "level", "category", "code"];
  for(var i = 0; i < arr.length; i++) {
    var condName = arr[i];
    if(rawCond[condName]) {
      var tempCond = {};
      if(util.isArray(rawCond[condName])) {
        if(rawCond[condName].length > 0) {
          tempCond[condName] = { $in: rawCond[condName] };
          conds.push(tempCond);
        }
      } else {
        tempCond[condName] = rawCond[condName];
        conds.push(tempCond);
      }
    }
  }

  if(rawCond.message) { // 详细信息
    conds.push({ message : { $regex : rawCond.message, $options: 'i' } });
  }

  if(conds.length === 0) {
    return {};
  } else {
    return {$and : conds};
  }
}


