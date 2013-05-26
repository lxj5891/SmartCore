
var user = require("../controllers/ctrl_user")
  , turnover_list = exports;

turnover_list.version = "0.0.1";
turnover_list.collection = "turnover";

turnover_list.befor = function(param, start, limit, callback) {

  console.log("turnover_list_befor");

  var condition = {};

  // 如果指定了月份
  if (param.month) {
    condition = {date: new RegExp("^" + param.month + ".*$", "i")};
  }

  // 如果指定了起始日
  if (param.from) {
    condition = {date: {$lte: param.from}};
  }


  var err = null;
  callback(err, condition, start, limit);
};

turnover_list.after = function(document, callback) {

  console.log("turnover_list_after");

  // 添加用户信息
  user.appendUser(document, "editby", function(err, result){
    callback(err, result);
  });

};

