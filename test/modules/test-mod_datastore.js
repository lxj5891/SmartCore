var assert  = require("assert")
  , _       = require("underscore");

// jscoverage or original library
var datastore = process.env['COVER'] 
  ? require('../../cover_modules/mod_datastore')
  : require('../../modules/mod_datastore');

describe("Store Module", function() {

  var operationDate = new Date()
    , dataid
    , newGroup = {
        "name": "newGroup"
      , "member": ""
      , "description": "description"
      , "secure": 2
      , "category": "none"
      , "createby": "li"
      , "createat": operationDate
      , "editby": "li"
      , "editat": operationDate
    };

  /*****************************************************************/
  // 创建组
  it("test create function", function(done) {
    datastore.create("aaa", newGroup, function(err, result) {

      dataid = result[0]._id;

      // 更新
      delete newGroup._id;
      newGroup.name = "asdfasdfasdf";
      datastore.updateById("aaa", dataid, newGroup, function(err, result) {
        done();
      });
    });
  });

  it("test update function", function(done) {
    newGroup.name = "updateupdateupdate";
    datastore.update("aaa", {secure: 2}, newGroup, function(err, result) {
      console.log(result);
      done();
    });
  });

  it("test find function", function(done) {
    datastore.find("aaa", {secure: 2}, 0, 2, function(err, result) {
      console.log(result);

      datastore.findById("aaa", result[0]._id, function(err, result){

        console.log(result);
        done();
      });
    });
  });


});