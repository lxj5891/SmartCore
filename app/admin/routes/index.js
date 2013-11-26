
"use strict";


exports.guidingApi = function(app){

  app.get("/", function (req, res) {

    res.render("admin_home", {"title": "title"});
  });

  app.get("/user/add", function (req, res) {

    res.render("user/add", {"title": "添加用户"});
  });

  app.get("/group/add", function (req, res) {

    res.render("group/add", {"title": "添加用户"});
  });
};
