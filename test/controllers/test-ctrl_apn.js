
// jscoverage or original library
var apn = process.env.COVER ?
  require('../../cover_modules/ctrl_apn') :
  require('../../controllers/ctrl_apn');

describe("Apn Module", function() {

  it("test create", function(done) {
    
    apn.update("li", "device1", "xy1", function(err, result) {

      console.log(result);
      done();
    });
  });

  it("test find", function(done) {
    
    apn.find("xy1", function(err, result) {

      console.log(result);
      done();
    });
  });

  it("test remove", function(done) {
    
    apn.remove("device1", function(err, result) {

      console.log(result);
      done();
    });
  });

});