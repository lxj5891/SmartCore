
var hello = exports;

hello.version = "0.0.1";
hello.collection = "abcdefg";

hello.befor = function(condition, document, callback) {

  console.log("befor");

  console.log(document);
  console.log(callback);

  var err = null;
  callback(err, condition, document);

};

hello.after = function(document, callback) {
  console.log("after");

  var err = null;
  callback(err, document);
};

