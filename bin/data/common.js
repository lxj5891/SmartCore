
"use strict";

var csv       = require("csv")
  , fsext     = require("fs-extra")
  , _         = require("underscore")
  , moment    = require("moment")
  , auth      = require("../../lib/auth")
  , util      = require("../../lib/util");

exports.csvFormat = function() {
  return {
    quoted: true
  , encoding: "utf8"
  };
};

exports.define = function(mapping, sample, template) {

  console.log("export mapping and sample file.");

  var user = JSON.parse(util.ejsParser(template, {}));

  // 输出映射结构文件
  fsext.writeJsonSync(mapping, user.mapping);
  console.log("    create : " + mapping);

  var csvData = [];
  csvData.push(_.keys(user.sample));
  csvData.push(_.values(user.sample));

  // 输出CSV例子文件
  csv().from.array(csvData)
    .to.path(sample, exports.csvFormat())
    .transform(function(row) {
      return row;
    })
    .on("error", function(error) {
      console.log(error);
    })
    .on("end", function() {
      console.log("    create : " + sample);
      console.log("ok!");
    });
};

// 如果有多个相同的名字，则只能返回一个
// 只对应一层嵌套
exports.lookupPath = function(json, key, base) {

  var result;

  _.each(json, function(jsonVal, jsonKey) {

    // 已经找到，则不再继续查找
    if (result) {
      return undefined;
    }

    // Array, String, Number, Date
    if (jsonVal.column === key) {
      result = base ? base + "." + jsonKey : jsonKey;
      return undefined;
    }

    // Hash（递归调用）
    if (_.isObject(jsonVal)) {
      result = exports.lookupPath(jsonVal, key, base ? base + "." + jsonKey : jsonKey);
      return undefined;
    }
  });

  return result;
};

/**
 * 给JSON对象赋值，深层嵌套时，path
 * @param json
 * @param path
 * @param val
 */
exports.setJsonValue = function(json, path, val) {

  if (_.isUndefined(path)) {
    return;
  }

  var keys = path.split(".")
    , nest = json;

  _.each(keys, function(key, index) {
    if (keys.length - 1 === index) {
      val = val || "";

      if (nest[key].type.toLowerCase() === "array") {
        nest[key] = val.split(",");
      } else if (nest[key].type.toLowerCase() === "date") {
        nest[key] = moment(val).toDate();
      } else if (nest[key].type.toLowerCase() === "number") {
        nest[key] = parseInt(val, 10);
      } else if (nest[key].type.toLowerCase() === "password") {
        nest[key] = auth.sha256(val);
      } else {
        nest[key] = val;
      }
    } else {
      nest[key] = _.isUndefined(nest[key]) ? {} : nest[key];
      nest = nest[key];
    }
  });
};
