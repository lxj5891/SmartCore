
var turnover_update = exports;

turnover_update.version = "0.0.1";
turnover_update.collection = "turnover";

turnover_update.befor = function(condition, document, callback) {

  console.log("turnover_update_befor");

  var data = {
      category: document.category
    , amount: document.amount
    , editby: document.editby
    , editat: document.editat
    };


  var err = null;
  callback(err, condition, data);

};

turnover_update.after = function(document, callback) {
  console.log("turnover_update_after");

  var err = null;
  callback(err, document);
};

