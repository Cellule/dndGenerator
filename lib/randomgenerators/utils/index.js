var operators = require("./operators");
var path = require("path");
var _ = require("lodash");

var exports = module.exports = {};

exports.chooseRandomWithWeight = require("./chooseRandomWithWeight");
exports.getGroups = function(val) {
  if(_.isEmpty(val) || !_.isString(val)) {
    return "";
  }
  val = val.replace("{\\n}", "\n");
  var r = val.match(/{((\\{|\\}|[^{}])*)}|((\\{|\\}|[^{}])+)/g).map(function(g) {
    //todo: replace escaped \{ and \}
    if(g[0] === "{") {
      var res = {};
      _.any(operators, function(op) {
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
};

exports.tablesPath = path.resolve(__dirname, "../npcData/tables");
