
"use strict";

var csv       = require("csv")
  , _         = require("underscore")
  , conf      = require("config").db
  , util      = require("../../lib/util")
  , cmd       = require("../../lib/command")
  , common    = require("./common");


exports.define = function() {
  common.define("UserMapping.json", "UserSample.csv", __dirname + "/user.json");
};

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

exports.exp = function() {

};
