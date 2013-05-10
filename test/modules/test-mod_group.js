var assert  = require("assert")
  , _       = require("underscore")
  , log     = require("../../core/log");

// jscoverage or original library
var group = process.env['COVER'] 
  ? require('../../cover_modules/mod_group')
  : require('../../modules/mod_group');

describe("Group Module", function() {

  var operationDate = new Date()
    , groupid
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
    group.create(newGroup, function(err, result) {
      assert.equal(err, null, "Error should be null.");
      assert.notEqual(result._id, null, "The groupid shall be generated.");
      assert.equal(result.name, "newGroup", "The group name should be correct.");

      groupid = result._id.toString();
      done();
    });
  });

  /*****************************************************************/
  // 获取指定ID的组信息
  it("test at function", function(done) {
    group.at(groupid, function(err, result) {
      assert.equal(err, null, "Error should be null.");
      assert.notEqual(result, null, "Able to get group information.");
      assert.equal(result._id.toString(), groupid, "The groupid should be correct.");

      done();
    });
  });

  /*****************************************************************/
  // 给定条件检索组
  it("test find function", function(done) {
    group.find({"name": "newGroup"}, function(err, result) {
      assert.equal(err, null, "Error should be null.");
      assert.notEqual(result, null, "Able to get group information.");
      assert.equal(result.length, 1, "The groupid should be correct.");

      done();
    });
  });

  /*****************************************************************/
  // 更新指定ID的组
  it("test update function", function(done) {
    group.update(groupid, {"name": "oldGroup", "editat": "2012-12-21 00:00:00"}, function(err, result) {
      assert.equal(err, null, "Error should be null.");
      assert.notEqual(result, null, "Able to get group information.");
      assert.equal(result.name, "oldGroup", "The group name should be correct.");

      done();
    });
  });

  /*****************************************************************/
  // 删除组
  it("test delete function", function(done) {
    group.delete(groupid, function(err, result) {
      assert.equal(err, null, "Error should be null.");
      assert.notEqual(result, null, "Able to get group information.");
      assert.equal(result._id.toString(), groupid, "The groupid should be correct.");

      done();
    });
  });

  /*****************************************************************/
  // 组名的模糊检索
  it("test search function", function(done) {

    var gids = [];

    // 创建6个检索对象
    newGroup.name = "newGroup1";
    group.create(newGroup, function(err, result){
      gids.push(result._id);
    });
    newGroup.name = "newGroup2";
    group.create(newGroup, function(err, result){
      gids.push(result._id);
    });
    newGroup.name = "newGroup3";
    group.create(newGroup, function(err, result){
      gids.push(result._id);
    });
    newGroup.name = "newGroup4";
    group.create(newGroup, function(err, result){
      gids.push(result._id);
    });
    newGroup.name = "newGroup5";
    group.create(newGroup, function(err, result){
      gids.push(result._id);
    });
    newGroup.name = "newGroup6";
    group.create(newGroup, function(err, result){
      gids.push(result._id);
    });
    newGroup.name = "xxxxxx7";
    group.create(newGroup, function(err, result){
      gids.push(result._id);
    });

    group.search("newGroup", function(err, result) {
      assert.equal(err, null, "Error should be null.");
      assert.notEqual(result, null, "Able to get group information.");
      assert.equal(result.length, 5, "The group count should be correct.");

      removeTestData(gids);
      done();
    });
  });

  /*****************************************************************/
  // 获取以给定字母开头的组一览，同时可以指定某个人所属的组
  it("test headMatch function", function(done) {

    var gids = [];

    // 第一组测试数据
    newGroup.name = "bb1";
    group.create(newGroup, function(err, result){
      gids.push(result._id);
    });
    newGroup.name = "bb2";
    newGroup.member = ["u001", "u002"];
    group.create(newGroup, function(err, result){
      gids.push(result._id);
    });
    newGroup.name = "bb3";
    newGroup.member = ["u002", "u003"];
    group.create(newGroup, function(err, result){
      gids.push(result._id);
    });

    // 第二组测试数据
    newGroup.name = "aa2";
    group.create(newGroup, function(err, result){
      gids.push(result._id);
    });
    newGroup.name = "aa1";
    group.create(newGroup, function(err, result){
      gids.push(result._id);
    });

    // 测试Limit
    group.headMatch(null, null, null, 1, 3, function(err, result){
      assert.equal(err, null, "Error should be null.");
      assert.notEqual(result, null, "Able to get group information.");
      assert.equal(result.length, 3, "The limit should be correct.");
    });

    // 测试首字母过滤，Sort
    group.headMatch("a", null, null, 0, 3, function(err, result){
      assert.equal(err, null, "Error should be null.");
      assert.notEqual(result, null, "Able to get group information.");
      assert.equal(result.length, 2, "The limit should be correct.");

      assert.equal("aa1", result[0].name, "The first name should be correct.");

      removeTestData(gids);
      done();
    });
  });

  it("test childDepartments function", function(done) {

    var gids = [];

    // 第一层部门
    newGroup.name = "bb1";
    newGroup.type = "2";
    group.create(newGroup, function(err, result){
      gids.push(result._id);

      // 第二层部门
      newGroup.name = "bb2-1";
      newGroup.member = ["u001", "u002"];
      newGroup.parent = result._id;
      group.create(newGroup, function(err, result){
        gids.push(result._id);
      });

      newGroup.name = "bb2-2";
      newGroup.parent = result._id;
      group.create(newGroup, function(err, result){
        gids.push(result._id);

        // 第三层部门
        newGroup.name = "bb3";
        newGroup.parent = result._id;
        group.create(newGroup, function(err, result){
          gids.push(result._id);

          group.childDepartments([gids[0]], function(err, result){

            assert.equal(result.length, 3, "The child count should be correct.");
            removeTestData(gids);
            done();
          });
        });

      });
    });

  });

});

/**
 * 删除测试用的组
 */
function removeTestData(gids) {
  _.each(gids, function(gid){
    group.delete(gid, function(err, result){});
  });
}
