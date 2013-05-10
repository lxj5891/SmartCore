var assert  = require("assert")
  , _       = require("underscore")
  , log     = require("../../core/log")
  , group    = require("../../controllers/ctrl_group")
  , modgroup = require("../../modules/mod_group");

console.log(0);
describe("Group Controllers", function() {

  var operationDate = new Date()
    , groupid = []
    , newGroup = {
        name: "newGroup"
      , member: "1234567890"
      , description: "description"
      , category: "none"
      , createby: "li"
      , createat: operationDate
      , editby: "li"
      , editat: operationDate
    };

  // 创建组
  it("create test user", function(done) {
    modgroup.create(newGroup, function(err, result) { groupid.push(result._id); });

    newGroup.name = "newGroup1";
    modgroup.create(newGroup, function(err, result) { groupid.push(result._id); });

    newGroup.name = "newGroup2";
    modgroup.create(newGroup, function(err, result) { groupid.push(result._id); done(); });
  });

  // 
  it("test groupListByMember function", function(done) {
    group.groupListByMember("1234567890", 1, 5, function(err, result) {
      assert.equal(err, null, "Error should be null.");
      assert.equal(result[0].name, "newGroup1", "The group name should be correct.");

      removeTestData(groupid);
      done();
    });
  });

});

/**
 * 删除测试用的组
 */
function removeTestData(gids) {
  _.each(gids, function(gid){
    modgroup.delete(gid, function(err, result){});
  });
}