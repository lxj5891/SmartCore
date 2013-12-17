
"use strict";

var user     = require("../apis/user");

exports.guiding = function(app){

  // json
  app.get("/login/user.json", function(req, res) {
    user.login(req, res);
  });

  app.get("/admin/user/get.json", function(req, res) {
    user.get(req, res);
  });

  app.get("/admin/user/list.json", function(req, res) {
    user.getList(req, res);
  });

  app.post("/admin/user/add.json", function(req, res) {
    user.add(req, res);
  });

  app.put("/admin/user/update.json", function(req, res) {
    user.update(req, res);
  });

  app.put("/admin/user/delete.json", function(req, res) {
    user.delete(req, res);
  });

  // html
  app.get("/admin/user/list", function (req, res) {

    res.render("smartadmin/admin_user_list", {"title": "title"});
  });

  app.get("/admin/user/add", function (req, res) {

    res.render("smartadmin/admin_user_update", {"title": "title", user: req.session.user,
      userId: "", "operation": "add"} );
  });

  app.get("/admin/user/edit/:id", function (req, res) {

    res.render("smartadmin/admin_user_update", {"title": "title", user: req.session.user,
      userId: req.params.id, "operation": "update"} );
  });

  app.get("/admin/user/detail/:id", function (req, res) {

    res.render("smartadmin/admin_user_detail", {"title": "title", user: req.session.user, userId: req.params.id});
  });

};
