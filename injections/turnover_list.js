
var hello = exports;

hello.version = "0.0.1";
hello.collection = "turnover";

hello.befor = function(param, start, limit, callback) {

  console.log("list befor");

  var month = param.month;
  var condition = {date: new RegExp("^" + month + ".*$", "i")};
  // var condition = {date: "2013/05/12"};

  var err = null;
  callback(err, condition, start, limit);

};

hello.after = function(document, callback) {
  console.log("list after");

  var err = null;
  callback(err, document);
};

