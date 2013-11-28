
"use strict";

var i18n        = require("../apis/i18n");

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

  app.get("/i18n/add", function (req, res) {

    res.render("admin_i18n_add", {"title": "添加翻译"});
  });

  app.get("/i18n/add", function (req, res) {

    res.render("admin_i18n_add", {"title": "添加翻译"});
  });

  app.get("/i18n/categorys.json", function (req, res) {

    i18n.getCategorys(req, res);
  });

  app.get("/i18n/langs.json", function (req, res) {

    i18n.getLangs(req, res);
  });

  app.post("/i18n/add.json", function (req, res) {

    i18n.add(req, res);
  });
};
