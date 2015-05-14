var gen = require("./../randomgenerators/npcGenerator");
var utils = require("./../randomgenerators/utils");
var schema = require("../randomgenerators/npcData/schema");
var possibleOptions = require("./../randomgenerators/possibleOptions");
var _ = require("lodash");

var npcData;
gen.readTables(utils.tablesPath, function(err, data) {
  if(err) {
    return console.error(err);
  }
  npcData = data;
  //console.log(gen.generate(require("./npcData/schema"), data));
});


export default function addControllers(app, options) {
  app.get("/_/npc", function(req, res) {
    var generatorOptions = _.pick(
      req.query,
      (n, query) => !!possibleOptions.hasOwnProperty(query)
    );

    generatorOptions = _.transform(generatorOptions, (result, n, key) => {
      result[key] = parseInt(n)|0;
    });

    console.log("Generating npc with options: %j", generatorOptions);
    var npc = gen.generate(schema, npcData, req.query);
    res.send(npc);
  });
}
