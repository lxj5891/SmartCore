
"use strict";

/**
 * 设定配置文件位置，因为执行ctrl需要配置文件的支持
 */
process.env.NODE_CONFIG_DIR = __dirname + "/config";
process.env.LOG4JS_CONFIG = __dirname + "/config/log4js.json";

var fs        = require("fs")
  , program   = require("commander")
  , argv      = require("optimist").argv
  , sync      = require("async")
  , context   = require("../lib/context")
  , loader    = require("../lib/loader")
  , constant  = require("../lib/constant")
  , ctrl      = require("../lib/controllers/ctrl_i18n");


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

showHelp();
readPhraseFile();
update();
