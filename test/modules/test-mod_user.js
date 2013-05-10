var assert  = require("assert")
  , _       = require("underscore")
  , log     = require("../../core/log")
  , auth    = require("../../core/auth");

// jscoverage or original library
var user = process.env['COVER'] 
  ? require('../../cover_modules/mod_user')
  : require('../../modules/mod_user');

describe("User Module", function() {

  // 测试数据
  var operationDate = new Date()
    , userid
    , newUser = {
        uid: "smart"
      , password: auth.sha256("smart")
      , email: {
        email1: "smart@dreamarts.com.cn"
      }
      , name: {
          first: "first"
        , last: "last"
      }
      , title: "CEO"
      , address: {
          country: "中国"
        , state: "大连"
      }
      , lang: "CN"
      , createby: "li"
      , createat: operationDate
      , editby: "li"
      , editat: operationDate
    };

  /*****************************************************************/
  // 创建用户
  it("test create function", function(done) {
    user.create(newUser, function(err, result) {
      assert.equal(err, null, "Error should be null.");
      assert.notEqual(result._id, null, "The userid shall be generated.");
      assert.equal(result.name.first, "first", "The user name should be correct.");
      assert.equal(result.name.last, "last", "The user name should be correct.");

      userid = result._id.toString();
      done();
    });
  });

  /*****************************************************************/
  // 获取指定ID的用户信息
  it("test at function", function(done) {
    user.at(userid, function(err, result) {
      assert.equal(err, null, "Error should be null.");
      assert.notEqual(result, null, "Able to get user information.");
      assert.equal(result._id.toString(), userid, "The userid should be correct.");

      done();
    });
  });

  /*****************************************************************/
  // 给定条件检索用户
  it("test find function", function(done) {
    user.find({"uid": "smart"}, function(err, result) {
      assert.equal(err, null, "Error should be null.");
      assert.notEqual(result, null, "Able to get user information.");
      assert.equal(result.length, 1, "The userid should be correct.");

      done();
    });
  });

  /*****************************************************************/
  // 更新指定用户信息
  it("test update function", function(done) {
    user.update(userid, {"name.first": "firstNew", "editat": "2012-12-21 00:00:00"}, function(err, result) {
      assert.equal(err, null, "Error should be null.");
      assert.notEqual(result, null, "Able to get user information.");
      assert.equal(result.name.first, "firstNew", "The user name should be correct.");

      done();
    });
  });

  /*****************************************************************/
  // 添加关注
  it("test follow function", function(done) {
    user.follow("1", userid, function(err, result) {});
    user.follow("2", userid, function(err, result) {
      assert.equal(err, null, "Error should be null.");
      assert.notEqual(result, null, "Able to get user information.");
      assert.equal(result.friends.length, 2, "The follower count should be correct.");

      done();
    });
  });

  /*****************************************************************/
  // 删除用户
  it("test delete function", function(done) {
    user.delete(userid, function(err, result) {
      assert.equal(err, null, "Error should be null.");
      assert.notEqual(result, null, "Able to get user information.");
      assert.equal(result._id.toString(), userid, "The userid should be correct.");

      done();
    });
  });

  /*****************************************************************/
  // 获取多个用户信息
  it("test many function", function(done) {

    var uids = [];

    // 创建2个检索对象
    user.create(newUser, function(err, result){
      uids.push(result._id);

      user.create(newUser, function(err, result){
        uids.push(result._id);

        // 确认检索多个用户
        user.many(uids, null, null, function(err, result) {
          assert.equal(err, null, "Error should be null.");
          assert.notEqual(result, null, "Able to get user information.");
          assert.equal(result.length, 2, "The user count should be correct.");

          removeTestData(uids);
          done();
        });
      });
    });
  });

  /*****************************************************************/
  // 用户名的模糊检索
  it("test search function", function(done) {

    var uids = [];

    // 创建6个检索对象
    newUser.name.first = "newUser1";
    user.create(newUser, function(err, result){
      uids.push(result._id);
    });
    newUser.name.first = "newUser2";
    user.create(newUser, function(err, result){
      uids.push(result._id);
    });
    newUser.name.first = "newUser3";
    user.create(newUser, function(err, result){
      uids.push(result._id);
    });
    newUser.name.first = "newUser4";
    user.create(newUser, function(err, result){
      uids.push(result._id);
    });
    newUser.name.first = "newUser5";
    user.create(newUser, function(err, result){
      uids.push(result._id);
    });
    newUser.name.first = "newUser6";
    user.create(newUser, function(err, result){
      uids.push(result._id);
    });
    newUser.name.first = "xxxxxx7";
    user.create(newUser, function(err, result){
      uids.push(result._id);
    });

    user.search("newUser", function(err, result) {
      assert.equal(err, null, "Error should be null.");
      assert.notEqual(result, null, "Able to get user information.");
      assert.equal(result.length, 5, "The user count should be correct.");

      removeTestData(uids);
      done();
    });
  });

  /*****************************************************************/
  // 获取以给定字母开头的用户一览，同时可以只检索朋友
  it("test headMatch function", function(done) {

    var uids = [], friends = [];

    // 第一用户测试数据
    newUser.name.first = "bb1";
    user.create(newUser, function(err, result){
      uids.push(result._id);
    });
    newUser.name.first = "bb2";
    newUser.member = ["u001", "u002"];
    user.create(newUser, function(err, result){
      uids.push(result._id);
    });
    newUser.name.first = "bb3";
    newUser.member = ["u002", "u003"];
    user.create(newUser, function(err, result){
      uids.push(result._id);
    });

    // 第二用户测试数据
    newUser.name.first = "aa2";
    newUser.friends = friends;
    user.create(newUser, function(err, result){
      uids.push(result._id);
    });
    newUser.name.first = "aa1";
    friends.push("u1");
    friends.push("u2");
    friends.push("u3");
    user.create(newUser, function(err, result){
      uids.push(result._id);
    });

    // 测试Limit
    user.headMatch(null, null, 1, 3, function(err, result){
      assert.equal(err, null, "Error should be null.");
      assert.notEqual(result, null, "Able to get user information.");
      assert.equal(result.length, 3, "The limit should be correct.");
    });

    // 测试首字母过滤，Sort
    user.headMatch("a", null, 0, 3, function(err, result){
      assert.equal(err, null, "Error should be null.");
      assert.notEqual(result, null, "Able to get user information.");
      assert.equal(result.length, 2, "The limit should be correct.");

      assert.equal("aa1", result[0].name.first, "The first name should be correct.");
    });

    // 测试检索盆友
    user.headMatch("a", "u2", 0, 3, function(err, result){
      assert.equal(err, null, "Error should be null.");
      assert.notEqual(result, null, "Able to get user information.");
      assert.equal(result.length, 1, "The limit should be correct.");

      assert.equal("aa1", result[0].name.first, "The first name should be correct.");

      removeTestData(uids);
      done();
    });
  });

  /*****************************************************************/
  // 获取以给定字母开头的用户一览，同时可以只检索朋友
  it("test structure function", function(done) {

    var result = user.structure();
    assert.equal(result[0].key, "uid", "The key should be correct.");
    assert.equal(result[0].type, "String", "The type should be correct.");
    assert.equal(result.length, 45, "The limit should be correct.");

    done();
  });

});

/**
 * 删除测试用的用户
 */
function removeTestData(uids) {
  _.each(uids, function(uid){
    user.delete(uid, function(err, result){});
  });
}
