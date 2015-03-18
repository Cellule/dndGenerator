require("../../requireHooks");
var gen = require("./npcGenerator");
var utils = require("./utils");

gen.readTables(utils.tablesPath, function(err, data) {
  if(err) {
    return console.log(err);
  }
  console.log(gen.generate(require("./npcData/schema"), data));
});
