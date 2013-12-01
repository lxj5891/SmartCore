$(function () {
  'use strict';

  //画面表示
  render();

  //事件追加
  events();

});

var langCache = {};

function render() {

  // 1.获取分类
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

  var key = $("#key").val();

  // 2.获取语言
  smart.doget("/i18n/langs.json" , function(err, result) {
    if (err) {
      smart.error(err, i18n["js.common.search.error"], false);
    } else {

      var tmpl = $('#tmpl_lang_li').html();

      _.each(result, function(lang) {
        langCache[lang.langCode] = lang.langName;
        if(!key && lang.isDefault === true) { // 默认语言
          addLang(lang.langCode, lang.langName);
        } else {
          $("#langUl").append(_.template(tmpl, {
            "langCode": lang.langCode
            , "langName": lang.langName
          }));
        }
      });
    }
  });

  if(key) {
    // 3.加载词条
    // TODO 应该放到“2.获取语言”的回调函数中
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
    alert(i18n["js.i18n.check.key.empty"]);
    $("#inputKey").focus();
    return;
  }

  var trans = {};

  $("input[name='langText']").each(function() {
    var langCode = $(this).attr("langCode");
    trans[langCode] = $("#" + langCode + "Text").val();
  });

  if(_.isEmpty(trans)) {
    alert(i18n["js.i18n.check.translation.empty"]);
    return;
  }

  var data = {
    category: category
    , key: key
    , trans: trans
  };

  smart.dopost("/i18n/add.json" , data, function(err) {
    if (err) {
      smart.error(err, i18n["js.common.save.error"], false);
    } else {

      alert(i18n["js.common.save.success"]);
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
















