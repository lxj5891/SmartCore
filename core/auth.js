var crypto = require('crypto')
  , confapp = require('config').app
  , confcookie = require('config').cookie
  , log = require('./log');


var spliter = "\t";

/**
 * Calculates the digest of all of the passed data to the hmac.
 * 可选的algorithm - 'sha1', 'md5', 'sha256', 'sha512'
 * 可选的encoding - 'hex', 'binary', 'base64'
 */
exports.sha256 = function(str){
  return crypto.createHmac('sha256', confapp.hmackey).update(str).digest('hex');
};


/**
 * 发行Cookie，cookie内容加密，并设定有效期限
 * 包含以下内容：用户ID，邮件地址（存放邮件地址的目的是，为了对应将来有可能支持的邮件地址作为ID登陆）
 */
exports.issueCookie = function(user, res) {
  var encrypted = exports.encrypt(user._id + spliter + user.email, confcookie.secret);
  // res.cookie(confcookie.key, encrypted, {"maxAge": confcookie.timeout, "httpOnly": false});
  res.cookie(confcookie.key, encrypted);
};


/**
 * 清除Cookie
 */
exports.clearCookie = function(res) {
  res.clearCookie(confcookie.key);
}


/**
 * 抽取Cookie
 */
exports.passCookie = function(req) {

  // var cookie = req.signedCookies[confcookie.key];
  var cookie = req.cookies[confcookie.key];
  if (!cookie) {
    return null;
  }

  var decrypted = exports.decrypt(cookie, confcookie.secret);
  return decrypted.split(spliter);
};


/**
 * 加密，密码在配置文件里
 * 使用的Algorithm - 'aes192'
 * 使用的encoding - 'hex'
 * 内容的encoding - 'utf-8'
 */
exports.encrypt = function(str, secret) {
  var cipher = crypto.createCipher("aes192", secret);
  var crypted = cipher.update(str, "utf8", "hex");
  return crypted + cipher.final("hex");
}


/**
 * 解密，密码在配置文件里
 * 使用的Algorithm - 'aes192'
 * 使用的encoding - 'hex'
 * 内容的encoding - 'utf-8'
 */
exports.decrypt = function(str, secret) {
  var decipher = crypto.createDecipher("aes192", secret);
  var decrypted = decipher.update(str, "hex", "utf8");
  return decrypted + decipher.final("utf8");
}

// rfc4122 v4
exports.uuid = function() {
  var result = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });

  return result;
}

/**
 * 登陆处理，不额外发行cookie
 */
exports.login = function(req, res, user) {
  req.session.user = user;

  // 将用户ID保存到头信息里，用于移动终端开发。
  res.setHeader("userid", user._id);
  
  // exports.issueCookie(user, res);
}

/**
 * 注销
 */
exports.logout = function(req, res){
  req.session.destroy();
  // exports.clearCookie(res);
};


