import operators from "./operators"
var path = require("path");
var _ = require("lodash");

export var chooseRandomWithWeight = require("./chooseRandomWithWeight");
export function getGroups(val) {
  if(_.isEmpty(val) || !_.isString(val)) {
    return "";
  }
  val = val.replace("{\\n}", "\n");
  var r = val.match(/{((\\{|\\}|[^{}])*)}|((\\{|\\}|[^{}])+)/g).map(g => {
    //todo: replace escaped \{ and \}
    if(g[0] === "{") {
      var res = {};
      _.any(operators, op => {
        var m = g.match(op.regex);
        if(m) {
          res = op.makeOperator(m);
          return true;
        }
        return false;
      });
      return res;
    }
    return g;
  });
  return r;
}

export var tablesPath = path.resolve(__dirname, "../npcData/tables");
