
"use strict";

var csv       = require("csv")
  , _         = require("underscore")
  , conf      = require("config").db
  , util      = require("../../lib/util")
  , cmd       = require("../../lib/command")
  , common    = require("./common");


exports.define = function() {
  common.define("GroupMapping.json", "GroupSample.csv", __dirname + "/group.json");
};

exports.imp = function(mapping, file) {

  console.log("start import.");
  console.log("  input mapping file : " + mapping);
  console.log("  input csv file : " + file);

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
      var group = JSON.parse(mappingString);
      _.each(columns, function(val, key) {
        common.setJsonValue(group, common.lookupPath(group, key), row[val]);
      });

      // 写入数据库
      cmd.insertData(conf.dbname, "groups", group, function(err) {
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

exports.exp = function(file) {
  console.log("start export.");

  // 获取数据库数据
  cmd.loadData(conf.dbname, "groups", function(err, data) {

    if (err) {
      console.log(err);
      return;
    }

    file = file || "groups.csv";
    console.log("  output csv file : " + file);

    csv().from.array(data)
      .to.path(file, common.csvFormat())
      .transform(function(row) {

        // TODO: 按照Mapping的定义输出内容
        return JSON.stringify(row);
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
