
var user = require("../controllers/ctrl_user")
  , turnover_list = exports;

turnover_list.version = "0.0.1";
turnover_list.collection = "turnover";

turnover_list.befor = function(param, start, limit, callback) {

  console.log("turnover_list_befor");

  var month = param.month;
  var condition = {date: new RegExp("^" + month + ".*$", "i")};

  var err = null;
  callback(err, condition, start, limit);

};

turnover_list.after = function(document, callback) {

  console.log("turnover_list_after");

  console.log(document);
  // 添加用户信息
  user.appendUser(document, "editby", function(err, result){
    console.log(result);
    callback(err, result);
  });

};

