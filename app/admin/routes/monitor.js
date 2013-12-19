
"use strict";

var monitor = require("../apis/monitor");

exports.guiding = function(app){

  // json
  app.get("/admin/monitor/get.json", function(req, res) {
    monitor.get(req, res);
  });

  // html
  app.get("/admin/monitor/log", function (req, res) {

    res.render("smartadmin/admin_monitor_log", {"title": "log"});
  });

};
