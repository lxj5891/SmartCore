
var hello = exports;

hello.version = "0.0.1";
hello.collection = "turnover";

hello.befor = function(document, callback) {

  console.log("befor");

  console.log(document);
  console.log(callback);

  var err = null;
  callback(err, document);

};

hello.after = function(document, callback) {
  console.log("after");

  callback(document);
};

