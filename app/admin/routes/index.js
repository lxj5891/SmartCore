
"use strict";


exports.guidingApi = function(app){

  app.get("/", function (req, res) {

    res.render("admin_home", {"title": "title"});
  });
}
