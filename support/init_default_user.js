var cmd = require("./command");

var data = {
  "uid" : "admin",
  "password" : "e02fbcbf42ccce4c2fab1aff636885153b2eda49681984b7baaaf2f780482014",
  "type" : 2,
  "lang" : "ja",
  "createat" : new Date(),
  "createby" : "script",
  "valid" : 1,
  "authority" : {
    "approve" : 0,
    "notice" : 0,
    "contents" : 0
  },
  "name" : {
    "name_zh" : "admin"
  },
  "active" : 1,
  "timezone" : "GMT+09:00"
}

cmd.insertData("yukari", "users", data, function(err, result){
  if (err) {
    return console.log(err);
  }
  console.log("insert data ok");
});
