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


module.exports = function addControllers(app, options) {
  app.get("/_/npc", function(req, res) {
    var generatorOptions = _.pick(
      req.query,
      function(n, query){ return !!possibleOptions.hasOwnProperty(query); }
    );
    generatorOptions = _.transform(generatorOptions, function(result, n, key) {
      result[key] = parseInt(n)|0;
    });
    if(__DEV__) {
      console.log("Generating npc with options: %j", generatorOptions);
    }
    var npc = gen.generate(schema, npcData, req.query);
    res.send(npc);
  });
};
