$(function () {
  'use strict';

  //画面表示
  render();

  //事件追加
  events();

});

function render() {

  smart.doget("/i18n/categorys.json" , function(err, result) {
    if (err) {
      smart.error(err, i18n["js.common.search.error"], false);
    } else {

      var tmpl = $('#tmpl_category_li').html();

      _.each(result, function(category) {
        $("#categoryUl").append(_.template(tmpl, {
          "category": category
        }));
      });
    }
  });

  smart.doget("/i18n/langs.json" , function(err, result) {
    if (err) {
      smart.error(err, i18n["js.common.search.error"], false);
    } else {

      var tmpl = $('#tmpl_lang_li').html();

      _.each(result, function(lang) {
        $("#categoryUl").append(_.template(tmpl, {
          "langCode": lang.langCode,
          "langName": lang.langName
        }));
      });
    }
  });

}

function events() {

  $("#save").click(save);
}

function save() {


}

function selectCategory(category) {
  $("#inputCategory").val(category);
}

function addLang(langCode, langName) {

}