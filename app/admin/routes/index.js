
"use strict";

var i18n        = require("../apis/i18n")
  , master     = require("../apis/master");

exports.guiding = function(app){

  app.get("/admin", function (req, res) {

    res.render("smartadmin/admin_home", {"title": "title"});
  });

  app.get("/admin/user/add", function (req, res) {

    res.render("smartadmin/user/add", {"title": "添加用户"});
  });

  app.get("/admin/group/add", function (req, res) {

    res.render("smartadmin/group/add", {"title": "添加用户"});
  });

  app.get("/admin/i18n/add", function (req, res) {

    res.render("smartadmin/admin_i18n_add", {"title": "添加翻译", "key": ""});
  });

  app.get("/admin/i18n/edit/:key", function (req, res) {

    res.render("smartadmin/admin_i18n_add", {"title": "更新翻译", "key": req.params.key});
  });

  app.get("/admin/i18n/list", function (req, res) {

    res.render("smartadmin/admin_i18n_list", {"title": "翻译一览", "key": req.params.key});
  });

  app.get("/admin/i18n/categorys.json", function (req, res) {

    i18n.getCategorys(req, res);
  });

  app.get("/admin/i18n/langs.json", function (req, res) {

    i18n.getLangs(req, res);
  });

  app.get("/admin/i18n/get.json", function (req, res) {

    i18n.get(req, res);
  });

  app.post("/admin/i18n/add.json", function (req, res) {

    i18n.add(req, res);
  });

  app.get("/admin/i18n/list.json", function (req, res) {

    i18n.getList(req, res);
  });

  app.get("/admin/master/list", function (req, res) {

    res.render("smartadmin/admin_master_list", {"title": "title"});
  });

  app.get("/admin/master/add", function (req, res) {

    res.render("smartadmin/admin_master_update", {"title": "title", user: req.session.user, masterId: ""} );
  });

  app.get("/admin/master/update/:id", function (req, res) {

    res.render("smartadmin/admin_master_update", {"title": "title", user: req.session.user, masterId: req.params.id} );
  });

  app.get("/master/detail/:id", function (req, res) {

    res.render("smartadmin/admin_master_detail", {"title": "title", user: req.session.user, masterId: req.params.id});
  });

  app.post("/master/add.json", function(req, res) {
    master.add(req, res);
  });

  app.get("/master/get.json", function(req, res) {
    master.get(req, res);
  });
};
