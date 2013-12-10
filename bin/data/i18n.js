
"use strict";

/**
 * 设定配置文件位置，因为执行ctrl需要配置文件的支持
 */
//process.env.NODE_CONFIG_DIR = __dirname + "/config";
//process.env.LOG4JS_CONFIG = __dirname + "/config/log4js.json";

var fs        = require("fs")
  , program   = require("commander")
  , argv      = require("optimist").argv
  , sync      = require("async")
  , conf      = require("config").db
  , csv       = require("csv")
  , _         = require("underscore")
  , context   = require("../../lib/context")
  , loader    = require("../../lib/loader")
  , constant  = require("../../lib/constant")
  , ctrl      = require("../../lib/controllers/ctrl_i18n")
  , cmd       = require("../../lib/command");


var file = argv.f
  , lang = argv.l
  , category = argv.c
  , words = {};

/**
 * 显示帮助信息
 */
function showHelp() {

  // 定义帮助信息
  program
    .version("0.0.1")
    .option("-f, --file", "i18n file")
    .option("-l, --lang", "language code: ex. ja, zh, en ...")
    .option("-c, --category", "application category: ex. yukari");

  // 定义帮助信息中的例子
  program.on("--help", function(){
    console.log("  Examples:");
    console.log("");
    console.log("    $ cd SmartCore");
    console.log("    $ node bin/run_loadi18n.js -f bin/ja.json -l zh -c yukari");
    console.log("");
  });

  program.parse(process.argv);
}

/**
 * 读取多国语文件
 */
function readPhraseFile() {

  if (!file) {
    return;
  }

  if (!fs.existsSync(file)) {
    return;
  }

  // 读取JS文件
  words = JSON.parse(fs.readFileSync(file, "utf8"));
}

/**
 * 更新数据库
 */
function update() {
  loader.initialize();

  // 创建空的Handler
  var handler = new context().bind({ session: { user: { _id: constant.DEFAULT_USER } } }, {});
  handler.addParams("lang", lang);
  handler.addParams("category", category);

  // 更新数据库
  sync.forEach(Object.keys(words), function(key, done) {
    handler.addParams("key", key);
    handler.addParams("value", words[key]);

    ctrl.add(handler, function(err, result) {

      if (err) {
        console.log(err);
        return;
      }
      done(err, result);
    });

  }, function() {
    console.log("ok!");
    process.exit(0);
  });
}

//showHelp();
//readPhraseFile();
//update();


exports.import = function() {

};

/**
 * 从数据库里读取i18n数据，输出到CSV文件中
 * @param file
 * @param lang
 */
exports.export = function(file, lang) {

  console.log("start export.");

  cmd.loadData(conf.dbname, "i18ns", function(err, data) {

    file = file || "i18ns.csv";
    lang = lang || ["ja", "zh", "en"];

    console.log("  output csv file : " + file);
    console.log("  output csv lang : " + lang);

    if (err) {
      console.log(err);
      return;
    }

    var outputFormat = {
      quoted: true
    , columns: ["category", "key", "updateAt", "updateBy", "createAt", "createBy"]
    , header: true
    };

    // 添加要输出的语言列
    _.each(lang, function(item) {
      outputFormat.columns.splice(2, 0, "lang." + item);
    });

    csv()
      .from.array(data)
      .to.path(file, outputFormat)
      .transform(function(row) {

        // 转换数据库行到CSV输出用对象
        return {
          "key":      row.key
        , "createAt": row.createAt
        , "createBy": row.createBy
        , "updateAt": row.updateAt
        , "updateBy": row.updateBy
        , "lang.ja":  row.lang.ja
        , "valid":    row.valid
        , "category": row.category
        };
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
