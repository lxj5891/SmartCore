
"use strict";

var csv       = require("csv")
  , _         = require("underscore")
  , conf      = require("config").db
  , util      = require("../../lib/util")
  , cmd       = require("../../lib/command")
  , common    = require("./common");

/**
 * 输出CSV与数据库映射额定义文件，CSV例子文件
 */
exports.define = function() {
  common.define("UserMapping.json", "UserSample.csv", __dirname + "/user.json");
};

/**
 * 导入数据
 * @param {String} mapping 映射关系文件
 * @param {String} file CSV数据文件
 */
exports.imp = function(mapping, file) {

  var counter = 0
    , columns = {}
    , mappingString = util.ejsParser(mapping, {});

  csv().from.path(file, common.csvFormat())
    .transform(function(row, index, callback) {

      // 获取csv标题，并确定项目的下标
      if (index === 0) {

        _.each(row, function(item, index) {
          columns[item] = index;
        });

        callback();
        return;
      }

      // CSV行转换成JSON对象
      var user = JSON.parse(mappingString);
      _.each(columns, function(val, key) {
        common.setJsonValue(user, common.lookupPath(user, key), row[val]);
      });

      // 写入数据库
      cmd.insertData(conf.dbname, "users", user, function(err) {
        if (err) {
          console.log(err);
          return callback(err);
        }

        counter++;
        return callback(err, row);
      });
    })
    .on("error", function(error) {
      console.log(error);
    })
    .on("end", function() {
      console.log("  recored count : " + counter);
      console.log("ok!");
    });

};

/**
 * 数据导出
 * @param {String} file CSV文件
 */
exports.exp = function(file) {
  console.log("start export.");

  // 获取数据库数据
  cmd.loadData(conf.dbname, "users", function(err, data) {

    if (err) {
      console.log(err);
      return;
    }

    file = file || "users.csv";
    console.log("  output csv file : " + file);

    csv().from.array(data)
      .to.path(file, common.csvFormat())
      .transform(function(row) {

        // TODO: 按照Mapping的定义输出内容
        return JSON.stringify(row) + "\r\n";
      })
      .on("error", function(error) {
        console.log(error);
      })
      .on("end", function() {
        console.log("  recored count : " + data.length);
        console.log("ok!");
      });
  });
};
