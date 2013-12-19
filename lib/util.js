/**
 * @file 通用工具类
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var fs          = require("fs")
  , ejs         = require("ejs")
  , os          = require("os")
  , _           = require("underscore");

/**
 * 简单生成随机4位字符串
 */
exports.randomGUID4 = function() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
};

/**
 * 简单生成随机8位字符串, 会有重复数据生成
 * GUID : Global Unique Identifier
 */
exports.randomGUID8 = function() {
  return exports.randomGUID4() + exports.randomGUID4();
};

/**
 * 读取模板文件，带入参数，生成结果文件，如果没有指定结果文件，则返回解析后的字符串
 * @param {String} templateFile ejs模板文件
 * @param {Object} parameters 模板文件参数对象
 * @param {String} resultFile 结果文件，如果没有指定则以字符串的形式返回解析的内容
 * @returns {String}
 */
exports.ejsParser = function(templateFile, parameters, resultFile) {

  // 读取模板文件
  var template = fs.readFileSync(templateFile, "utf8");

  // 转换模板文件
  var result = ejs.render(template, parameters);

  // 没有指定输出文件，则返回字符串
  if (!resultFile) {
    return result;
  }

  // 输出文件
  fs.writeFileSync(resultFile, result);
  return undefined;
};

/**
 * 判断客户端是否是浏览器
 * @param {Object} req 请求
 * @returns {*}
 */
exports.isBrowser = function(req) {

  var userAgent = req.headers["user-agent"].toLowerCase();

  if (userAgent.match(/mozilla.*/i)) {
    return true;
  }

  return false;
};

/**
 * 返回客户端类型
 * @param {Object} req 请求
 * @returns {*} 浏览器返回‘mozilla‘，ios应用返回’app名称‘
 */
exports.clientType = function(req) {
  var userAgent = req.headers["user-agent"].toLowerCase();
  return userAgent.split("/")[0];
};


/**
 * 获取AP服务器IP地址的数组，获取的IP地址放到global对象中缓存
 * @returns 返回IP地址
 */
exports.ip = function() {

  if (global.addresses) {
    return global.addresses;
  }

  var interfaces = os.networkInterfaces()
    , addresses = [];

  _.each(interfaces, function(item) {
    _.each(item, function(address) {
      if (address.family === "IPv4" && !address.internal) {
        addresses.push(address.address);
      }
    });
  });

  global.addresses = addresses;
  return global.addresses;
};

// ---------------------------- 以下未整理

var sanitize = require('validator').sanitize
  , check     = require("validator").check
  ;

exports.format_date = function (date, friendly) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();

  if (friendly) {
    var now = new Date();
    var mseconds = -(date.getTime() - now.getTime());
    var time_std = [ 1000, 60 * 1000, 60 * 60 * 1000, 24 * 60 * 60 * 1000 ];
    if (mseconds < time_std[3]) {
      if (mseconds > 0 && mseconds < time_std[1]) {
        return Math.floor(mseconds / time_std[0]).toString() + ' 秒前';
      }
      if (mseconds > time_std[1] && mseconds < time_std[2]) {
        return Math.floor(mseconds / time_std[1]).toString() + ' 分钟前';
      }
      if (mseconds > time_std[2]) {
        return Math.floor(mseconds / time_std[2]).toString() + ' 小时前';
      }
    }
  }

  //month = ((month < 10) ? '0' : '') + month;
  //day = ((day < 10) ? '0' : '') + day;
  hour = ((hour < 10) ? '0' : '') + hour;
  minute = ((minute < 10) ? '0' : '') + minute;
  second = ((second < 10) ? '0': '') + second;

  var thisYear = new Date().getFullYear();
  year = (thisYear === year) ? '' : (year + '-');
  return year + month + '月' + day + '日 ' + hour + ':' + minute;
};


exports.stringFormat = function(src,key,newStr) { 

    var reg=new RegExp ("({{"+key+"}})","g"); 
    src = src.replace(reg, newStr); 
    return src; 
  };

exports.checkString = function(value){	
	if("string" === typeof(value)){
		return sanitize(sanitize(value).trim()).xss();
	}else{
		return value;
	}
};

exports.checkObject = function(obj){
	if("object" !== typeof(obj)){
		return exports.checkString(obj);
	}
	for(var p in obj){
		if("object" === typeof(obj[p])){
			obj[p] = exports.checkObject(obj[p]);
		}else{
			obj[p] = exports.checkString(obj[p]);
		}
	}
	return obj;
};

exports.getTelRegex = function(){
  return new RegExp("((\\d{11})|^((\\d{7,8})|(\\d{4}|\\d{3})-(\\d{7,8})|(\\d{4}|\\d{3})-(\\d{7,8})-(\\d{4}|\\d{3}|\\d{2}|\\d{1})|(\\d{7,8})-(\\d{4}|\\d{3}|\\d{2}|\\d{1}))$)");
	//return /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/;
};

exports.toObjectIdArray = function(str) {
	var arr = [];

	if(!str){
		return null;
	}else{
		arr = str.split(",");
    for(var i = 0; i < arr.length; i++){
      arr[i] = arr[i].trim();
      if(!arr[i] || !arr[i].match(/^[abcdef0-9]{24}$/)){
        arr.splice(i, 1);
        i--;
      }
    }
	}

  if(arr.length === 0){
    return null;
  }else{
    return arr;
  }
};

exports.isAllNull = function(obj){
	if("object" === typeof(obj)){
		for(var p in obj){
			if("object" !== typeof(obj[p]) && obj[p]){
				return false;
			}
		}
		return true;
	}else{
		return (obj ? false : true);
	}
};

/**
 * unit test ok
 * 将深层内嵌的Json转换成一层
 *  例 {a: 1, b: {c: 2}} to { a: 1, 'b.c': 2 }
 * @param prefix
 * @param origin
 * @param result
 * @param without 可以指定转换对象外的key，默认_id为对象外
 */
exports.unindentJson = function (prefix, origin, result, without) {
  result = result || {};
  without = typeof without !== 'undefined' ? without : ["_id"];

  for (var key in origin) {
    var val = origin[key]
      , newkey = prefix ? prefix + "." + key : key;

    if (without.indexOf(key) < 0 && (exports.isHash(val)||exports.isArray(val))) {
      exports.unindentJson(newkey, val, result);
    } else {
      result[newkey] = val;
    }
  }
};

/**
 * unit test ok
 * 判断是否是Hash
 */
exports.isHash = function(obj) {

  if (obj instanceof Array) {
    return false;
  }

  if (Object.prototype.toString.call( obj ) === "[object Object]") {
  //if (typeof obj === "object") {
    return true;
  }

  return false;
};

exports.isArray = function(value) {
	// return value instanceof Array;
	return Object.prototype.toString.call( value ) === "[object Array]";
};

exports.isDate = function(value) {
	// return value instanceof Date;
	return Object.prototype.toString.call( value ) === "[object Date]";
};



exports.isEmail = function(email){
  try{
    check(email).isEmail();
    return true;
  }catch(e){
    return false;
  }
};

exports.isTel = function (tel){
  try{
    check(tel).regex(exports.getTelRegex());
    return true;
  }catch(e){
    return false;
  }
};

exports.isUrl = function (url){
    try{
        check(url).isUrl();
        return true;
    }catch(e){
        return false;
    }
};
exports.quoteRegExp = function(s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};
