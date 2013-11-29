
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

    res.render("admin_i18n_add", {"title": "添加翻译", "key": ""});
  });

  app.get("/i18n/edit/:key", function (req, res) {

    res.render("admin_i18n_add", {"title": "更新翻译", "key": req.params.key});
  });

  app.get("/i18n/list", function (req, res) {

    res.render("admin_i18n_list", {"title": "翻译一览", "key": req.params.key});
  });

  app.get("/i18n/categorys.json", function (req, res) {

    i18n.getCategorys(req, res);
  });

  app.get("/i18n/langs.json", function (req, res) {

    i18n.getLangs(req, res);
  });

  app.get("/i18n/get.json", function (req, res) {

    i18n.get(req, res);
  });

  app.post("/i18n/add.json", function (req, res) {

    i18n.add(req, res);
  });

  app.get("/i18n/list.json", function (req, res) {

    i18n.getList(req, res);
  });
};
