
"use strict";

var i18n     = require("../apis/i18n");

exports.guiding = function(app) {

  // json
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

  app.post("/admin/i18n/update.json", function (req, res) {

    i18n.update(req, res);
  });

  app.get("/admin/i18n/list.json", function (req, res) {

    i18n.getList(req, res);
  });

  // html
  app.get("/admin/i18n/add", function (req, res) {

    res.render("smartadmin/admin_i18n_update", {"title": "添加翻译", "key": ""});
  });

  app.get("/admin/i18n/edit/:key", function (req, res) {

    res.render("smartadmin/admin_i18n_update", {"title": "更新翻译", "key": req.params.key});
  });

  app.get("/admin/i18n/list", function (req, res) {

    res.render("smartadmin/admin_i18n_list", {"title": "翻译一览", "key": req.params.key});
  });
};
