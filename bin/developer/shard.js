var cmd = require("./command");

var startMongoDb = "/opt/mongodb/bin/mongod -f /opt/mongodb/mongod.conf"
  , startMongoCfg = "/opt/mongoconfig/bin/mongod -f /opt/mongoconfig/mongocfg.conf"
  , stopMongoDb = "cat /opt/mongodb/data/mongod.lock | xargs kill"
  , stopMongoCfg = "cat /opt/mongoconfig/data/mongod.lock | xargs kill"
  , startMongos = "/opt/mongos/bin/mongos -f /opt/mongos/mongos.conf";

// 关闭数据库
if (0) {
  // stop config
  cmd.runRemoteCommand("db1", stopMongoCfg, function(err, out){
    if (err) {
      return console.log(err);
    }
    console.log("host: db1, shutdown config ok");
  });
  cmd.runRemoteCommand("db2", stopMongoCfg, function(err, out){
    if (err) {
      return console.log(err);
    }
    console.log("host: db2, shutdown config ok");
  });
  cmd.runRemoteCommand("db3", stopMongoCfg, function(err, out){
    if (err) {
      return console.log(err);
    }
    console.log("host: db3, shutdown config ok");
  });

  // stop db
  cmd.runRemoteCommand("db2", stopMongoDb, function(err, out){
    if (err) {
      return console.log(err);
    }
    console.log("host: db2, shutdown db ok");
  });
  cmd.runRemoteCommand("db3", stopMongoDb, function(err, out){
    if (err) {
      return console.log(err);
    }
    console.log("host: db3, shutdown db ok");
  });
}

// 启动数据库
if (0) {
  // stop db
  cmd.runRemoteCommand("db2", startMongoDb, function(err, out){
    if (err) {
      return console.log(err);
    }
    console.log("host: db2, start db ok");
  });
  cmd.runRemoteCommand("db3", startMongoDb, function(err, out){
    if (err) {
      return console.log(err);
    }
    console.log("host: db3, start db ok");
  });

  // stop config
  cmd.runRemoteCommand("db1", startMongoCfg, function(err, out){
    if (err) {
      return console.log(err);
    }
    console.log("host: db1, start config ok");
  });
  cmd.runRemoteCommand("db2", startMongoCfg, function(err, out){
    if (err) {
      return console.log(err);
    }
    console.log("host: db2, start config ok");
  });
  cmd.runRemoteCommand("db3", startMongoCfg, function(err, out){
    if (err) {
      return console.log(err);
    }
    console.log("host: db3, start config ok");
  });
}

// 启动mongos
if (0) {
  cmd.runRemoteCommand("db1", startMongos, function(err, out){
    if (err) {
      return console.log(err);
    }
    console.log("host: db1, start mongos ok");
  });
}

// 添加 shard host
if (0) {
  cmd.runDBCommand({ addShard: "db2:27017", maxSize: 0, name: "shard2" }, function(err, result){
    if (err) {
      return console.log(err);
    }
    console.log("add shard2 ok");
  });
  cmd.runDBCommand({ addShard: "db3:27017", maxSize: 0, name: "shard3" }, function(err, result){
    if (err) {
      return console.log(err);
    }
    console.log("add shard3 ok");
  });
}

// 允许 shard db
if (0) {
  cmd.runDBCommand({ enableSharding: "yukari" }, function(err, result){
    if (err) {
      return console.log(err);
    }
    console.log("enable shard yukari ok");
  });
}

// 设定 shard collection
if (1) {
  cmd.runDBCommand({ shardCollection: "yukari.fs.chunks", key: {"_id": "hashed"} }, function(err, result){
    if (err) {
      return console.log(err);
    }
    console.log(result);
    console.log("enable shard yukari.fs.chunks ok");
  });
}