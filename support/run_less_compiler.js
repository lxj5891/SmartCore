
"use strict";

var less      = require("less")
  , ph        = require("path")
  , fs        = require("fs")
  , program   = require("commander")
  , argv      = require("optimist").argv;


var lessDir = argv.f || ph.resolve(__dirname, "..") + argv.p
  , cssDir  = argv.f || ph.resolve(__dirname, "..") + argv.p;

/**
 * 显示帮助信息
 */
function showHelp() {

  // 定义帮助信息
  program
    .version("0.0.1")
    .option("-p, --path", "less file path")
    .option("-f, --fullpath", "less file full path");

  // 定义帮助信息中的例子
  program.on("--help", function(){
    console.log("  Examples:");
    console.log("");
    console.log("    $ node support/run_less_compiler.js -p /app/admin/public/stylesheets/");
    console.log("");
  });

  program.parse(process.argv);
}

/**
 * 编译less文件
 */
var compile = function(path) {

  var lessFileName = ph.basename(path);
  console.log("compile : " + lessFileName);

  var lessParser = new less.Parser({
      paths: [ ph.dirname(path) ]
    , filename: lessFileName
    });

  var contents = fs.readFileSync(path).toString();
  lessParser.parse(contents, function(err, tree) {
    if(err) {
      throw new Error(err);
    }

    var cssFilename = lessFileName.replace(/less$/, "css");
    fs.writeFileSync(ph.join(cssDir, cssFilename), tree.toCSS({yuicompress: false}));
  });
};

/**
 * 监视less文件
 */
var watch = function(filename) {

  var path = ph.join(lessDir, filename);
  if(!filename.match(/\.less$/) || !fs.statSync(path).isFile()) {
    return;
  }

  fs.watchFile(path, {persistent: true, interval: 500}, function() {
    compile(path);
  });

  compile(path);
};

// TODO: 新加文件，删除文件，重命名文件时的对应
function doCompile() {

  fs.readdirSync(lessDir).forEach(watch);
}

showHelp();
doCompile();
