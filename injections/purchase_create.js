
var purchase = exports;

purchase.version = "0.0.1";
purchase.collection = "purchase";

purchase.befor = function(document, callback) {

  console.log("purchase_create_befor");

  console.log(document);
  console.log(callback);

  var err = null;
  callback(err, document);

};

purchase.after = function(document, callback) {
  console.log("purchase_create_after");

  callback(document);
};

