
"use strict";

var fs        = require("fs")
  , path      = require("path")
  , ejs       = require("ejs")
  , program   = require("commander")
  , argv      = require("optimist").argv;


/**
 * 显示帮助信息
 */
function showHelp() {

  // 定义帮助信息
  program
    .version("0.0.1")
    .option("-a, --api", "generate api layer code")
    .option("-c, --controller", "generate controllers layer code")
    .option("-m, --module", "generate module layer code")
    .option("-u, --unit", "generate unit test code")
    .option("-N, --name", "module name")
    .option("-A, --author", "program author");

  // 定义帮助信息中的例子
  program.on("--help", function(){
    console.log("  Examples:");
    console.log("");
    console.log("    $ node bin/run_generator.js -acmu --name=hello --author=r2space@gmail.com");
    console.log("");
  });

  program.parse(process.argv);
}

/**
 * 读取模板文件，带入参数，生成结果文件
 * 模板文件目录为 /bin/template
 * @param templateFile
 * @param resultFile
 * @param parameters
 */
function parseFile(templateFile, resultFile, parameters) {

  // 读取模板文件
  var template = fs.readFileSync(__dirname + templateFile, "utf8");

  // 转换模板文件
  var result = ejs.render(template, parameters);

  // 输出
  var out = path.resolve(__dirname , "..") + resultFile;
  fs.writeFileSync(out, result);
}

/**
 * 生成API层代码
 * @param name 代码文件名
 * @param author 作者
 */
function createApis(name, author) {

  var parameters = {
    author: author
  , name: name
  };

  parseFile("/template/api.tmpl", "/api/" + name + ".js", parameters);
}

/**
 * 生成controllers层代码
 * @param name 代码文件名
 * @param author 作者
 */
function createControllers(name, author) {

  var parameters = {
    author: author
  , name: name
  };

  parseFile("/template/controller.tmpl", "/controllers/ctrl_" + name + ".js", parameters);
  if (argv.u) {
    parseFile("/template/unit_ctrl.tmpl", "/test/controllers/test_ctrl_" + name + ".js", parameters);
  }
}

/**
 * 生成Modules层代码
 * @param name 代码文件名
 * @param author 作者
 */
function createModules(name, author) {

  var parameters = {
    author: author
  , name: name
  , objectName: name.charAt(0).toUpperCase() + name.substring(1)
  };

  parseFile("/template/module.tmpl", "/modules/mod_" + name + ".js",parameters);
  if (argv.u) {
    parseFile("/template/unit_mod.tmpl", "/test/modules/test_mod_" + name + ".js",parameters);
  }
}

/**
 * 生成代码文件
 */
function generate() {

  var author = argv.author ? argv.author : "dummy@dreamarts.co.jp"
    , name = argv.name ? argv.name : "sample";

  if (argv.a) {
    createApis(name.toLowerCase(), author);
  }

  if (argv.c) {
    createControllers(name.toLowerCase(), author);
  }

  if (argv.m) {
    createModules(name.toLowerCase(), author);
  }
}

showHelp();
generate();

// ---------------------------
// 自动创建工程
// 启动文件，文件夹等
//function createProject() {
//
//}

// 生成配置文件
//function createConfige() {
//
//}


// 生成一整套操作用的


// 根据js文件，生成mocha测试代码框架


// 自动发布到npm上

// 生成 routes

