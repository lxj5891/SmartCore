
"use strict";

var i18n     = require("../apis/i18n");

exports.guiding = function(app){

  // json
  app.get("/admin/i18n/get.json", function(req, res) {
    i18n.get(req, res);
  });

  app.get("/admin/i18n/list.json", function(req, res) {
    i18n.getList(req, res);
  });

  app.post("/admin/i18n/add.json", function(req, res) {
    i18n.add(req, res);
  });

  app.put("/admin/i18n/update.json", function(req, res) {
    i18n.update(req, res);
  });

  app.put("/admin/i18n/delete.json", function(req, res) {
    i18n.delete(req, res);
  });

  // html
  app.get("/admin/i18n/list", function (req, res) {

    res.render("smartadmin/admin_i18n_list", {"title": "title"});
  });

  app.get("/admin/i18n/add", function (req, res) {

    res.render("smartadmin/admin_i18n_update", {"title": "title", user: req.session.user,
      i18nId: "", "operation": "add"} );
  });

  app.get("/admin/i18n/edit/:id", function (req, res) {

    res.render("smartadmin/admin_i18n_update", {"title": "title", user: req.session.user,
      i18nId: req.params.id, "operation": "update"} );
  });

  app.get("/admin/i18n/detail/:id", function (req, res) {

    res.render("smartadmin/admin_i18n_detail", {"title": "title", user: req.session.user, i18nId: req.params.id});
  });

};
