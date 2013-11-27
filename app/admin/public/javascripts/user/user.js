$(function () {
  'use strict';

  //画面表示
  render();

  //事件追加
  events();

});

function render() {

}

function events() {

  $("#save").click(save);
}

function save() {

  var user = {
    userName : $("#userName").val(),
    password : $("#password").val(),
    last     : $("#last").val(),
    middle   : $("#middle").val(),
    first    : $("#first").val(),
    groups   : [],
    email    : $("#email").val(),
    lang     : $("#lang").val(),
    timezone : $("#timezone").val(),
    status   : $("#status").val()
  };




}