var datastore = require("../../controllers/ctrl_datastore");

describe("DataStore Controllers", function() {

  
  // it("create datastore", function(done) {
    
  //   var document = {};
  //   document.date = "2013/05/01";
  //   datastore.create("asdfasdfsa", "turnover_create", document, function(err, result) {
  //     console.log(result);

  //     done();
  //   });
  // });

  // it("update datastore", function(done) {
    
  //   var document = {};
  //   datastore.update("asdfasdfsa", "testupdate", {createby: "asdfasdfsa"}, document, function(err, result) {
  //     console.log(result);

  //     done();
  //   });
  // });

  it("find datastore", function(done) {
    
    datastore.find("51921d0b9ebbff39e6000001", "turnover_list", {month: "2013/05"}, 0, 10, function(err, result) {
      console.log(result);

      done();
    });
  });

  // it("update by id datastore", function(done) {
    
  //   datastore.find("asdfasdfsa", "testfind", {createby: "asdfasdfsa"}, 0, 10, function(err, result) {
  //     var document = {name: "88888888"};
  //     datastore.updateById("asdfasdfsa", "testupdate", result[0]._id, document, function(err, result) {
  //       console.log(result);

  //       done();
  //     });
  //   });
  // });


});
