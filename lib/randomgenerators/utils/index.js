import operators from "./operators"

export function chooseRandomWithWeight(arr, totalWeight) {
  var rnum = ((Math.random() * totalWeight) + 1) | 0;
  var i = 0;
  while(rnum > 0) {
    rnum -= arr[i++].w;
  }
  return arr[i - 1].v;
}

export function getGroups(val) {
  if(_.isEmpty(val) || !_.isString(val)) {
    return "";
  }
  val = val.replace("{\\n}", "\n");
  var r = val.match(/{((\\{|\\}|[^{}])*)}|((\\{|\\}|[^{}])+)/g).map(g => {
    //todo: replace escaped \{ and \}
    if(g[0] === "{") {
      var res = {};
      _.any(operations, op => {
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
