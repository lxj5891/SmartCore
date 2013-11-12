
/**
 * Module dependencies.
 */

var express     = require("express")
  , http        = require("http")
  , ejs         = require("ejs")
  , path        = require("path")
  , routes      = require("./app/admin/routes");

var app = express();

app.configure(function(){
  app.set("port", process.env.PORT || 3000);

  /**
   * Middleware
   * 生成?准favicon.ico，防止favicon.ico的404??
   */
  // app.use(express.favicon());

  /**
   * Middleware
   * ??Access log和Error log
   */
  app.use(express.logger("dev"));

  /**
   * Middleware
   * ??response data?gzip
   */
  // app.use(express.compress());

  /**
   * Middleware
   * 包含json(), urlencoded(), multipart()三个middleware
   */
//  app.use(express.bodyParser({"uploadDir": confapp.tmp}));

  /**
   * Middleware
   * 用于模?DELETE and PUT方法
   * 可以在form里放在<input type="hidden" name="_method" value="put" />来模?
   */
  app.use(express.methodOverride());

  /**
   * Middleware
   * 解析cookie
   */
//  app.use(express.cookieParser(confcookie.secret));

  /**
   * Middleware
   * 提供基于cookie的session
   */
//  app.use(express.session({
//      "secret": confsession.secret
//    , "key": confsession.key
//    , "cookie": {"maxAge": confsession.timeout * 60 * 60 * 1000}
//    , "store": new store({"db": confdb.dbname, "host": confdb.host, "port": confdb.port})
//    })
//  );

  /**
   * Middleware
   * CSRF支持。需要在?定csrftoken的前面。
   */
//  app.use(express.csrf());

//  /**
//   * 系?定?
//   */
//  app.use(middleware.authenticate); // ??
//  app.use(middleware.csrftoken);    // 生成CsrfToken
//  app.use(middleware.lang);         // ?定?言
//  app.use(middleware.parseError);   // ?常?理
//  app.use(middleware.timeout);      // ?定超?

  // 端口
  app.set("port", process.env.PORT || 3000);
  app.set("views", path.join(process.cwd(), "app/admin/views"));
  app.set("view engine", "html");
  app.engine("html", ejs.__express);

});

/**
 * 以??模式??是有效的?定放在?里
 */
app.configure("development", function(){
  app.use(express.errorHandler());
});

/**
 * route
 */
routes.guidingApi( app );

/**
 * 启动服务
 */
http.createServer(app).listen(app.get("port"), function(){
  console.log("Express server listening on port " + app.get("port"));
});
