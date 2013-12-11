"use strict";

// 注册事件
function events() {

  $("#signIn").bind("click", function(event){

    window.location = "/admin";
    return false;
  });
}

$(function () {

  // 注册事件
  events();
});
