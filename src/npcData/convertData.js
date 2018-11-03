var fs = require("fs");
var path = require("path");
var _ = require("lodash");

function readDataFile(filename) {
  var data = fs.readFileSync(filename, {encoding: "utf8"});
  if(!data) {
    return null;
  }

  var splitData = data.split("\r\n");
  var npcData = {output: splitData[0], tables: {}};

  splitData.shift();
  var curTable = null;
  splitData.forEach(function(line) {
    if(line.length === 0) {
      curTable = null;
    } else if(!curTable) {
      curTable = line;
      npcData.tables[curTable] = [];
    } else {
      var splitResult = /^(\d+) (.*)$/.exec(line);
      if(splitResult) {
        var weight = +splitResult[1];
        var val = splitResult[2].replace(/{\\n}/g, "\n");
        npcData.tables[curTable].push({w: weight, v: val});
      }
    }
  });
  return npcData;
}

function beautify(content) {
  return content
    .replace(/,{/g, ",\n  {")
    .replace(/"(.)":/g, " $1:")
    .replace("[{", "[\n  {")
    .replace("}]", "}\n]");
}

function convertToJson5(src, dstFolder) {
  var data = readDataFile(src);
  _.each(data.tables, function(table, tablename) {
    var dst = path.resolve(dstFolder, tablename + ".json5");
    fs.writeFileSync(dst, beautify(JSON.stringify(table)));
  });
}

convertToJson5("npcData.txt", "tables");
