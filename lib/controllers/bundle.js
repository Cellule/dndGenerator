var todosDb = require("../database").todo;
var listsDb = require("../database").list;

module.exports = function addControllers(app, options) {
  // require the page rendering logic
  var renderApplication = options.prerender ?
    require("../../build/prerender/main.js") :
    require("../../config/simple.js");

  // load bundle information from stats
  var stats = require("../../build/stats.json");

  var publicPath = stats.publicPath;

  var STYLE_URL = options.separateStylesheet &&
    (publicPath + "main.css?" + stats.hash);
  var SCRIPT_URL = publicPath + [].concat(stats.assetsByChunkName.main)[0];
  var COMMONS_URL = publicPath + [].concat(stats.assetsByChunkName.commons)[0];

  app.get("/*", function(req, res) {
    renderApplication(req.path, {
      TodoItem: function(item, callback) {
        callback(null, todosDb.get(item.id, {}));
      },
      TodoList: function(item, callback) {
        callback(null, listsDb.get(item.id, []));
      }
    }, SCRIPT_URL, STYLE_URL, COMMONS_URL, function(err, html) {
      if(err) {
        return res.end();
      }
      res.contentType = "text/html; charset=utf8";
      res.end(html);
    });
  });
};
