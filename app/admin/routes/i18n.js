
"use strict";

var i18n     = require("../apis/i18n");

exports.guiding = function(app) {

  // json

  app.post("/admin/i18n/update.json", function (req, res) {

    i18n.update(req, res);
  });

  app.get("/admin/i18n/list.json", function (req, res) {

    i18n.getList(req, res);
  });

  // html

  app.get("/admin/i18n/list", function (req, res) {

    res.render("smartadmin/admin_i18n_list", {"title": "翻译一览", "key": req.params.key});
  });
};
