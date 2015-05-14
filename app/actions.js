var Actions = require("items-store/Actions");

// All the actions of the application

exports.Todo = Actions.create([
	"add",
	"update",
	"reload"
]);

var request = require("superagent");
function getJson(path, options, callback) {
  request.get(path)
    .query(options || {})
    .set("Accept", "application/json")
    .type("json")
    .end(callback);
}

exports.Npc = {
  generate: getJson.bind(null, "/npc")
}
