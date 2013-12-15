
"use strict";

var readline  = require("readline")
  , fs        = require("fs")
  , util      = require("../../lib/util");

/**
 * 生成API层代码
 * @param {String} name 对象名称
 * @param {String} author 作者
 */
function createApis(name, author) {

  var tmplFile = __dirname + "/template/mvc_api.tmpl"
    , codeFile = "api/" + name + ".js";
  util.ejsParser(tmplFile, { author: author, name: name }, codeFile);
}

/**
 * 生成controllers层代码
 * @param {String} name 对象名称
 * @param {String} author 作者
 */
function createControllers(name, author) {

  var tmplFile = __dirname + "/template/mvc_controller.tmpl"
    , codeFile = "controllers/ctrl_" + name + ".js";
  util.ejsParser(tmplFile, { author: author, name: name }, codeFile);

  tmplFile = __dirname + "/template/unit_controller.tmpl";
  codeFile = "test/controllers/test_ctrl_" + name + ".js";
  util.ejsParser(tmplFile, { author: author, name: name }, codeFile);
}

/**
 * 生成Modules层代码
 * @param {String} name 对象名称
 * @param {String} author 作者
 */
function createModules(name, author) {

  var tmplFile = __dirname + "/template/mvc_model.tmpl"
    , codeFile = "models/mod_" + name + ".js";
  util.ejsParser(tmplFile, { author: author, name: name }, codeFile);

  tmplFile = __dirname + "/template/unit_controller.tmpl";
  codeFile = "test/models/test_mod_" + name + ".js";
  util.ejsParser(tmplFile, { author: author
    , name: name
    , objectName: name.charAt(0).toUpperCase() + name.substring(1)
    }, codeFile);
}

/**
 * 生成Views层代码
 * @param {String} name 对象名称
 * @param {String} author 作者
 */
function createViews(name, author) {

  var tmplFile = __dirname + "/template/mvc_view.tmpl"
    , codeFile = "views/" + name + ".html";
  util.ejsParser(tmplFile, { author: author, name: name }, codeFile);
}

/**
 * 添加路由
 * @param {String} name 对象名称
 * @param {String} author 作者
 */
function appendRoutes(name) {
  var rs = fs.createReadStream("app/admin/routes/index.js", { encoding: "utf8", autoClose: true })
    , ws = fs.createWriteStream("index.js.new", { encoding: "utf8", autoClose: true })
    , rl = readline.createInterface({ "input": rs, "output": ws });

  var tmplFile = __dirname + "/template/mvc_view.tmpl"
    , routeString = util.ejsParser(tmplFile, { name: name });

  rl.on("line", function(line) {
    ws.write(routeString);
    ws.write(line);
  });
}

/**
 * 生成代码文件
 * @param {String} name 对象名称
 * @param {String} author 作者
 */
exports.create = function(name, author) {
//  createApis(name, author);
//  createControllers(name, author);
//  createModules(name, author);
//  createViews(name, author);
  appendRoutes(name);
};
