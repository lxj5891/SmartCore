
var hello = exports;

hello.version = "0.0.1";
hello.collection = "turnover";

hello.befor = function(condition, start, limit, callback) {

  console.log("turnover_find_befor");

  console.log(callback);

  var err = null;
  callback(err, condition, start, limit);

};

hello.after = function(document, callback) {
  console.log("turnover_find_after");


  console.log(document);

  document[0].aaa = "asdfasdfasdfa";

  var err = null;
  callback(err, document);
};

