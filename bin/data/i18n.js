/**
 * @file i18n数据导入导出功能
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var conf      = require("config").db
  , csv       = require("csv")
  , _         = require("underscore")
  , cmd       = require("../../lib/command");

/**
 * CSV格式的设定
 * @param lang
 * @returns {{quoted: boolean, columns: Array, header: boolean}}
 */
function csvFormat(lang) {
  var format = {
    quoted: true
  , columns: ["category", "key", "valid", "updateAt", "updateBy", "createAt", "createBy"]
  , header: true
  };

  // 添加要输出的语言列
  _.each(lang, function(item) {
    format.columns.splice(2, 0, "lang." + item);
  });

  return format;
}

/**
 * 数据导入，从CSV文件导入数据到DB
 * @param {String} file 文件名，缺省时为 ["i18ns.csv]"
 * @param {String} lang 导入的语言，缺省时为 ["ja", "zh", "en"]
 */
exports.imp = function(file, lang) {

  var counter = 0;
  file = file || "i18ns.csv";
  lang = lang || ["ja", "zh", "en"];

  console.log("  input csv file : " + file);
  console.log("  input csv lang : " + lang);

  csv().from.path(file, csvFormat(lang))
    .transform(function(row, index, callback) {

      if (index === 0) {
        callback();
        return;
      }

      // 将lang的列转换为json对象
      row.lang = {};
      _.each(lang, function(item) {
        row.lang[item] = row["lang." + item];
        delete row["lang." + item];
      });

      cmd.insertData(conf.dbname, "i18ns", row, function(err) {
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
 * 从数据库里读取i18n数据，输出到CSV文件中
 * @param {String} file 文件名，缺省时为 ["i18ns.csv]"
 * @param {String} lang 导入的语言，缺省时为 ["ja", "zh", "en"]
 */
exports.exp = function(file, lang) {

  console.log("start export.");

  // 获取数据库数据
  cmd.loadData(conf.dbname, "i18ns", function(err, data) {

    file = file || "i18ns.csv";
    lang = lang || ["ja", "zh", "en"];

    console.log("  output csv file : " + file);
    console.log("  output csv lang : " + lang);

    if (err) {
      console.log(err);
      return;
    }

    csv().from.array(data)
      .to.path(file, csvFormat(lang))
      .transform(function(row) {

        // 转换数据库行到CSV输出用对象
        var data = {
          "key":      row.key
        , "createAt": row.createAt
        , "createBy": row.createBy
        , "updateAt": row.updateAt
        , "updateBy": row.updateBy
        , "valid":    row.valid
        , "category": row.category
        };

        // 将lang的json对象转换为列
        _.each(lang, function(item) {
          data["lang." + item] = row.lang[item];
        });

        return data;
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

