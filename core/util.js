var sanitize = require('validator').sanitize;

exports.stringFormat = function(src,key,newStr) { 

    var reg=new RegExp ("({{"+key+"}})","g"); 
    src = src.replace(reg, newStr); 
    return src; 
} 

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
	return /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/;
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
}

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
}

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
}

exports.isArray = function(value) {
	// return value instanceof Array;
	return Object.prototype.toString.call( value ) === "[object Array]";
}

exports.isDate = function(value) {
	// return value instanceof Date;
	return Object.prototype.toString.call( value ) === "[object Date]";
}

/**
 * 如果是浏览器访问，负责画面的迁移
 */
exports.isBrowser = function(req) {
  var isSmartPhone = false;

  // 单元测试
  isSmartPhone = isSmartPhone || req.headers["user-agent"].match(/^otest.*$/i);
  // iPhone
  isSmartPhone = isSmartPhone || req.headers["user-agent"].match(/^SmartMessageIPhone.*$/i);
  // iPad
  isSmartPhone = isSmartPhone || req.headers["user-agent"].match(/^SmartMessageIPad.*$/i);

  return !isSmartPhone;
}
