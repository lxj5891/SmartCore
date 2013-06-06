
var purchase = exports
  , user = require("../controllers/ctrl_user");

purchase.version = "0.0.1";
purchase.collection = "purchase";

purchase.befor = function(params, start, limit, callback) {

  console.log("purchase_find_befor");

  var condition = {date: params.date}
    , err = null;

  start = 0;
  limit = 1;

console.log(condition);
  callback(err, condition, start, limit);

};

purchase.after = function(document, callback) {

  console.log("purchase_find_after");

console.log(document);

  // 添加用户信息
  user.appendUser(document, "editby", function(err, result){
    callback(err, result);
  });

};

