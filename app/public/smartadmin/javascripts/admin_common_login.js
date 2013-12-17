"use strict";

// 注册事件
function events() {

  $("#signIn").bind("click", function(event){

    var username = $("#name").val()
      , password = $("#pass").val();


    if (username.length <= 0 || password.length <= 0) {
      alert("ユーザ名とパスワードを入力してください。");
    } else {
      smart.doget("login/user.json?name=" + username+"&password=" + password, function(err, result) {
        if (err) {
          return alert("ユーザ名、またはパスワードが正しくありません。");
        }
        window.location = "/admin";
      });
    }
  });
}

$(function () {

  // 注册事件
  events();
});
