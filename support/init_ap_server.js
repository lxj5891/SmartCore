
var cmd = require("./command");

var gitPullSmart = "cd /opt/SmartCore && git pull"
  , gitPullYUKARi = "cd /opt/YUKARiWeb && git pull"
  , gitPullJava = "cd /opt/SmartTools && git pull";

var start = ""
  , smart = smart + "/usr/bin/forever start"
  , smart = smart + " -l /opt/YUKARiWeb/logs/forever.log"
  , smart = smart + " -o /opt/YUKARiWeb/logs/out.log"
  , smart = smart + " -e /opt/YUKARiWeb/logs/err.log"
  , smart = smart + " -a --sourceDir /opt/YUKARiWeb/"
  , smart = smart + " app.js"
  , restart = "cd /opt/YUKARiWeb && /usr/bin/forever restartall"
  , stop = "cd /opt/YUKARiWeb && /usr/bin/forever stopall";

var apnService = ""
  , joinService = ""
  , scissorService = ""
  , compile = "";

// 更新应用代码
if (0) {
  cmd.runRemoteCommand("ap1", gitPullSmart, function(err, result){
    if (err) {
      return console.log(err);
    }
    console.log(result);
    console.log("update ap1 smart core code ok");
  });

  cmd.runRemoteCommand("ap2", gitPullSmart, function(err, result){
    if (err) {
      return console.log(err);
    }
    console.log(result);
    console.log("update ap2 smart core code ok");
  });

  cmd.runRemoteCommand("ap1", gitPullYUKARi, function(err, result){
    if (err) {
      return console.log(err);
    }
    console.log(result);
    console.log("update ap1 yukari code ok");
  });

  cmd.runRemoteCommand("ap2", gitPullYUKARi, function(err, result){
    if (err) {
      return console.log(err);
    }
    console.log(result);
    console.log("update ap2 yukari code ok");
  });

  cmd.runRemoteCommand("mq1", gitPullJava, function(err, result){
    if (err) {
      return console.log(err);
    }
    console.log(result);
    console.log("update mq1 smart tool code ok");
  });
}

// 启动AP服务器
if (0) {
  cmd.runRemoteCommand("ap1", start, function(err, result){
    if (err) {
      return console.log(err);
    }
    console.log(result);
    console.log("start ap1 ok");
  });

  cmd.runRemoteCommand("ap2", start, function(err, result){
    if (err) {
      return console.log(err);
    }
    console.log(result);
    console.log("start ap2 ok");
  });
}

// 重启AP服务器
if (0) {
  cmd.runRemoteCommand("ap1", restart, function(err, result){
    if (err) {
      return console.log(err);
    }
    console.log(result);
    console.log("restart ap1 ok");
  });

  cmd.runRemoteCommand("ap2", restart, function(err, result){
    if (err) {
      return console.log(err);
    }
    console.log(result);
    console.log("restart ap2 ok");
  });
}

// 关闭AP服务器
if (0) {
  cmd.runRemoteCommand("ap1", stop, function(err, result){
    if (err) {
      return console.log(err);
    }
    console.log(result);
    console.log("restart ap1 ok");
  });

  cmd.runRemoteCommand("ap2", stop, function(err, result){
    if (err) {
      return console.log(err);
    }
    console.log(result);
    console.log("restart ap2 ok");
  });
}
