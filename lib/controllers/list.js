var listsDb = require("../database").list;
var todosDb = require("../database").todo;
var uuid = require("uuid");

module.exports = function addControllers(app) {
  app.get("/_/list/*", function(req, res) {
    var list = req.params[0];
    res.setHeader("Content-Type", "application/json");
    list = listsDb.get(list, []);
    var items = {};
    list.forEach(function(itemId) {
      items["_" + itemId] = todosDb.get(itemId, {});
    });
    res.end(JSON.stringify({
      list: list,
      items: items
    }));
  });

  app.post("/_/list/*", function(req, res) {
    var list = req.params[0];
    res.setHeader("Content-Type", "application/json");
    var newList = listsDb.update(list, req.body);
    var additionalItems = {};
    newList = newList.map(function(item) {
      if(typeof item === "string") {
        return item;
      }
      var newId = uuid.v4();
      todosDb.set(newId, item);
      additionalItems["_" + newId] = item;
      return newId;
    });
    listsDb.set(list, newList);
    res.end(JSON.stringify({
      list: newList,
      items: additionalItems
    }));
  });
};
