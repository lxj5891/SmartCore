
"use strict";

var group     = require("../apis/group");

exports.guiding = function(app){

  // json
  app.get("/admin/group/get.json", function(req, res) {
    group.get(req, res);
  });

  app.get("/admin/group/list.json", function(req, res) {
    group.getList(req, res);
  });

  app.post("/admin/group/add.json", function(req, res) {
    group.add(req, res);
  });

  app.put("/admin/group/update.json", function(req, res) {
    group.update(req, res);
  });

  app.put("/admin/group/delete.json", function(req, res) {
    group.delete(req, res);
  });

  // html
  app.get("/admin/group/list", function (req, res) {

    res.render("smartadmin/admin_group_list", {"title": "title"});
  });

  app.get("/admin/group/add", function (req, res) {

    res.render("smartadmin/admin_group_update", {"title": "title", group: req.session.group,
      groupId: "", "operation": "add"} );
  });

  app.get("/admin/group/edit/:id", function (req, res) {

    res.render("smartadmin/admin_group_update", {"title": "title", group: req.session.group,
      groupId: req.params.id, "operation": "update"} );
  });

  app.get("/admin/group/detail/:id", function (req, res) {

    res.render("smartadmin/admin_group_detail", {"title": "title", group: req.session.group, groupId: req.params.id});
  });

};
