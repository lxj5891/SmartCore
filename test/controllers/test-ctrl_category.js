var category = require("../../controllers/ctrl_category");

describe("Category Controllers", function() {

  // it("create category", function(done) {
    
  //   var items = [{
  //       name: "lalala"
  //     , value: "0"
  //     }, {
  //       name: "ririri"
  //     , value: "1"
  //     }
  //   ];

  //   category.create("lilin", "aaa", "bbb", null, "description", items, function(err, result) {
      
  //     var items = [{
  //         name: "uuuuuu"
  //       , value: "3"
  //       }, {
  //         name: "nnnnnn"
  //       , value: "4"
  //       }
  //     ];
  //     category.addItem("lilin", result[0]._id, items, function(err, result) {

  //       console.log(result);
  //       done();
  //     });

  //   });
  // });


  // it("findById category", function(done) {
    
  //   category.findById("519b12d591374e0829000001", function(err, result) {

  //     console.log(result);
  //     done();
  //   });
  // });

  it("find category", function(done) {
    
    category.find("aaa", null, 0, 10, function(err, result) {

      console.log(result);
      done();
    });
  });

});