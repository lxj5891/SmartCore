
"use strict";

var master     = require("../apis/master");

exports.guiding = function(app){

  // json
  app.get("/admin/master/get.json", function(req, res) {
    master.get(req, res);
  });

  app.get("/admin/master/list.json", function(req, res) {
    master.getList(req, res);
  });

  app.post("/admin/master/add.json", function(req, res) {
    master.add(req, res);
  });

  app.put("/admin/master/update.json", function(req, res) {
    master.update(req, res);
  });

  app.put("/admin/master/delete.json", function(req, res) {
    master.delete(req, res);
  });

  // html
  app.get("/admin/master/list", function (req, res) {

    res.render("smartadmin/admin_master_list", {"title": "title"});
  });

  app.get("/admin/master/add", function (req, res) {

    res.render("smartadmin/admin_master_update", {"title": "title", user: req.session.user,
      masterId: "", "operation": "add"} );
  });

  app.get("/admin/master/edit/:id", function (req, res) {

    res.render("smartadmin/admin_master_update", {"title": "title", user: req.session.user,
      masterId: req.params.id, "operation": "update"} );
  });

  app.get("/admin/master/detail/:id", function (req, res) {

    res.render("smartadmin/admin_master_detail", {"title": "title", user: req.session.user, masterId: req.params.id});
  });

};
