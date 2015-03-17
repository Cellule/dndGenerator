var gen = require("./npcGenerator");
var util = require("util");
var beautify = require("js-beautify");

gen.readDataFile("npcData.txt", function(err, data){
  console.log(gen.generate(data.output, data));
});
