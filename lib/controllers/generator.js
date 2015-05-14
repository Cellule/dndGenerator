var gen = require("./../randomgenerators/npcGenerator");
var utils = require("./../randomgenerators/utils");
var schema = require("../randomgenerators/npcData/schema");

var npcData;
gen.readTables(utils.tablesPath, function(err, data) {
  if(err) {
    return console.error(err);
  }
  npcData = data;
  //console.log(gen.generate(require("./npcData/schema"), data));
});


export default function addControllers(app, options) {
  app.get("/_/npc", function(req, res, next) {
    var npc = gen.generate(schema, npcData, req.query);
    res.send(npc);
  });
}
