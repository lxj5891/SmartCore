
var purchase_update = exports;

purchase_update.version = "0.0.1";
purchase_update.collection = "purchase";

purchase_update.befor = function(condition, document, callback) {

  console.log("purchase_update_befor");

  var data = {
      category: document.category
    , amount: document.amount
    , editby: document.editby
    , editat: document.editat
    };


  var err = null;
  callback(err, condition, data);

};

purchase_update.after = function(document, callback) {
  console.log("purchase_update_after");

  var err = null;
  callback(err, document);
};

