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

      var tmpl = $('#tmpl_category_option').html();

      _.each(result, function(category) {
        $("#inputCategory").append(_.template(tmpl, {
          "category": category
        }));
      });
    }
  });

  // 2.获取语言
  smart.doget("/i18n/langs.json" , function(err, result) {
    if (err) {
      smart.error(err, i18n["js.common.search.error"], false);
    } else {

      var tmpl = $('#tmpl_lang_option').html();

      _.each(result, function(lang) {
        langCache[lang.langCode] = lang.langName;
        $("#inputLang").append(_.template(tmpl, {
            "langCode": lang.langCode
          , "langName": lang.langName
          }));
      });
    }
  });

}

function events() {

  $("#search").click(function() {
    search(0, 10000);
  });
}

function search(start, limit) {

  var category = $("#inputCategory").val();
  var key = _.str.trim($("#inputKey").val());
  var lang = $("#inputLang").val();

  if(category === "" && key === "") {
    alert("请输入分类或词条key！");
    return;
  }

  var container = $("#tableRows");
  container.html("");

  var query = "category=" + category + "&key=" + key + "&lang=" + lang + "&start=" + start + "&limit=" + limit;

  smart.doget("/i18n/list.json?" + query , function(err, result) {
    if (err) {
      smart.error(err, i18n["js.common.search.error"], false);
    } else {
      var tmpl = $("#tmpl_tablerow").html();
      if(lang) {
        $("#tableHead").html(_.template($("#tmpl_tablehead_detail").html(), {
          "langName": langCache[lang]
        }));

        _.each(result, function(item) {
          container.append(_.template(tmpl, {
              "category": item.category
            , "key": item.key
            , "value": item.lang[lang]
            , "_id": item._id.toString()
          }));
        });
      } else {
        $("#tableHead").html($("#tmpl_tablehead_status").html());

        _.each(result, function(item) {
          container.append(_.template(tmpl, {
              "category": item.category
            , "key": item.key
            , "value": ""
            , "_id": item._id.toString()
          }));

          var transStatus = "";
          _.each(_.keys(langCache), function(langCode) {
            var langValue = item.lang[langCode];
            var clazz = langValue ? "transed" : "untransed";
            transStatus += "<span class='" + clazz + "'>" + langCache[langCode] + "</span>, ";
          });

          if(transStatus !== "") {
            transStatus = transStatus.substring(0, transStatus.length - 2);
          }

          $("#" + item._id.toString()).html(transStatus);
        });
      }
    }
  });

}







