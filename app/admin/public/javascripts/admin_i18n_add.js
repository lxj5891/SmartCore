$(function () {
  'use strict';

  //画面表示
  render();

  //事件追加
  events();

});

var langCache = {};

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
        langCache[lang.langCode] = lang.langName;
        $("#langUl").append(_.template(tmpl, {
            "langCode": lang.langCode
          , "langName": lang.langName
        }));
      });
    }
  });

  var key = $("#key").val();
  if(key) {
    smart.doget("/i18n/get.json?key=" + key, function(err, result) {
      if (err) {
        smart.error(err, i18n["js.common.search.error"], false);
      } else {
        $("#inputCategory").val(result.category);
        $("#inputKey").val(key);
        var lang = result.lang;
        var langCodes = _.keys(lang);
        _.each(langCodes, function(langCode) {
          addLang(langCode, langCache[langCode], lang[langCode]);
        });
      }
    });
  }

}

function events() {

  $("#save").click(save);
}

function save() {

  var category = $("#inputCategory").val();
  var key = _.str.trim($("#inputKey").val());

  if(key === "") {
    alert("词条key不能为空！");
    return;
  }

  var trans = {};

  $("input[name='langText']").each(function() {
    var langCode = $(this).attr("langCode");
    trans[langCode] = $("#" + langCode + "Text").val();
  });

  if(_.isEmpty(trans)) {
    alert("翻译不能为空！");
    return;
  }

  var data = {
    category: category
    , key: key
    , trans: trans
  };

  smart.dopost("/i18n/add.json" , data, function(err) {
    if (err) {
      smart.error(err, i18n["js.common.search.error"], false);
    } else {

      alert("更新成功");
    }
  });

}

function selectCategory(category) {
  $("#inputCategory").val(category);
}

function addLang(langCode, langName, langText) {

  $("#" + langCode + "Li").hide();

  var tmpl = $('#tmpl_lang_row').html();

  $("#langDiv").after(_.template(tmpl, {
      "langCode": langCode
    , "langName": langName
    , "langText": langText ? langText : ""
    }));
}

function clearLang(langCode) {
  $("#" + langCode + "Text").val("");
}

function removeLang(langCode) {
  $("#" + langCode + "Row").remove();
  $("#" + langCode + "Li").show();
}
















