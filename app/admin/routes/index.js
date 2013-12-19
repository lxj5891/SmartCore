
"use strict";

var i18n          = require("./i18n")
  , master        = require("./master")
  , group         = require("./group")
  , user          = require("./user")
  , monitor       = require("./monitor");

exports.guiding = function(app){

  // html
  app.get("/", function (req, res) {

    res.render("smartadmin/admin_common_login", {"title": "title"});
  });

  app.get("/login", function (req, res) {

    res.render("smartadmin/admin_common_login", {"title": "login"});
  });

  app.get("/admin", function (req, res) {

    res.render("smartadmin/admin_common_home", {"title": "home"});
  });

  i18n.guiding(app);
  master.guiding(app);
  user.guiding(app);
  group.guiding(app);
  monitor.guiding(app);

};
