
"use strict";

var readline  = require("readline")
  , fs        = require("fs")
  , fsext     = require("fs-extra")
  , path      = require("path")
  , util      = require("../../lib/util");

var LINE_BREAK = "\r\n";

/**
 * 生成API层代码
 * @param {String} name 对象名称
 * @param {String} author 作者
 */
function createApis(name, author) {

  var tmplFile = path.resolve(__dirname, "..") + "/template/mvc_api.tmpl"
    , codeFile = "api/" + name + ".js";

  if (!fs.existsSync(codeFile)) {
    util.ejsParser(tmplFile, { author: author, name: name }, codeFile);
    console.log("    create : " + codeFile);
  }
}

/**
 * 生成controllers层代码
 * @param {String} name 对象名称
 * @param {String} author 作者
 */
function createControllers(name, author) {

  var tmplFile = path.resolve(__dirname, "..") + "/template/mvc_controller.tmpl"
    , codeFile = "controllers/ctrl_" + name + ".js";
  if (!fs.existsSync(codeFile)) {
    util.ejsParser(tmplFile, { author: author, name: name }, codeFile);
    console.log("    create : " + codeFile);
  }

  tmplFile = path.resolve(__dirname, "..") + "/template/unit_controller.tmpl";
  codeFile = "test/controllers/test_ctrl_" + name + ".js";
  if (!fs.existsSync(codeFile)) {
    util.ejsParser(tmplFile, { author: author, name: name }, codeFile);
    console.log("    create : " + codeFile);
  }
}

/**
 * 生成Modules层代码
 * @param {String} name 对象名称
 * @param {String} author 作者
 */
function createModules(name, author) {

  var tmplFile = path.resolve(__dirname, "..") + "/template/mvc_model.tmpl"
    , codeFile = "models/mod_" + name + ".js";
  if (!fs.existsSync(codeFile)) {
    util.ejsParser(tmplFile, { author: author, name: name }, codeFile);
    console.log("    create : " + codeFile);
  }

  tmplFile = path.resolve(__dirname, "..") + "/template/unit_controller.tmpl";
  codeFile = "test/models/test_mod_" + name + ".js";
  if (!fs.existsSync(codeFile)) {
    util.ejsParser(tmplFile, { author: author
      , name: name
      , objectName: name.charAt(0).toUpperCase() + name.substring(1)
      }, codeFile);
    console.log("    create : " + codeFile);
  }
}

/**
 * 生成Views层代码
 * @param {String} name 对象名称
 * @param {String} author 作者
 */
function createViews(name, author) {

  var tmplFile = path.resolve(__dirname, "..") + "/template/mvc_view.tmpl"
    , codeFile = "views/" + name + ".html";
  if (!fs.existsSync(codeFile)) {
    util.ejsParser(tmplFile, { author: author, name: name }, codeFile);
    console.log("    create : " + codeFile);
  }
}

/**
 * 添加路由
 * @param {String} name 对象名称
 * @param {String} author 作者
 */
function appendRoutes(name) {

  var tmplFile = path.resolve(__dirname, "..") + "/template/mvc_routes.tmpl"
    , codeFile = "routes/index.js"
    , tempFile = codeFile + ".temp"
    , rs = fs.createReadStream(codeFile, { encoding: "utf8", autoClose: true })
    , ws = fs.createWriteStream(tempFile, { encoding: "utf8", autoClose: true })
    , rl = readline.createInterface({ "input": rs, "output": ws });

  // 如果路由文件不存在，则什么也不做
  if (!fs.existsSync(codeFile)) {
    return;
  }

  // 读取每一行，并输出到新文件中
  rl.on("line", function(line) {

    // 输出到新的临时文件中
    ws.write(line + LINE_BREAK);

    // 如果匹配exports行，则在其下面追加
    if (line.match(/^exports\.guiding[ ]*=.*$/i)) {
      ws.write(LINE_BREAK);
      ws.write(util.ejsParser(tmplFile, { name: name }));
    }
  });

  // 监视读取流的结束，用临时文件替换原始文件
  // 注：感觉应该监视输出流的结束事件更为合适。但，在没有明确调用end方法是，close事件不被触发，所以使用了rs的close事件。
  rs.on("close", function() {

    // 用临时文件，替换原来文件
    fsext.copy(tempFile, codeFile, function(err) {
      if (err) {
        console.log(err);
        return;
      }

      // 成功，则删除临时文件
      fsext.removeSync(tempFile);
    });
  });
}

/**
 * 生成代码文件
 * @param {String} name 对象名称
 * @param {String} author 作者
 */
exports.create = function(name, author) {
  createApis(name, author);
  createControllers(name, author);
  createModules(name, author);
  createViews(name, author);
  appendRoutes(name);
};
