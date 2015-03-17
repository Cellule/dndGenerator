require("../../requireHooks");
var gen = require("./npcGenerator");

gen.readTables("npcData/tables", function(err, data) {
  if(err) {
    return console.log(err);
  }
  console.log(gen.generate(require("./npcData/schema"), data));
});
