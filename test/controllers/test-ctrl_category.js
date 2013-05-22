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

  //   category.create("lihao", "CCC", "DDD", null, "ggooodo", items, function(err, result) {
      
  //     var items = [{
  //         name: "dfdfd"
  //       , value: "3"
  //       }, {
  //         name: "asasa"
  //       , value: "4"
  //       }
  //     ];
  //     category.addItem("wew", result[0]._id, items, function(err, result) {

  //       console.log(result);
  //       done();
  //     });

  //   });
  // });


  it("findById category", function(done) {
    
    category.findById("519b12d591374e0829000001", function(err, result) {

      console.log(result);
      done();
    });
  });

  it("find category", function(done) {
    
    category.find("aaa", null, 0, 10, function(err, result) {

      console.log(result);
      done();
    });
  });

});



