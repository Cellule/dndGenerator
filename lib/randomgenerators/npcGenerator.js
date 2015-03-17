var fs = require("fs");
var _ = require("lodash");

class NPCData {
  constructor() {
    this.output = "";
    this.tables = {};
  }
}

/*
All supported operations
{%v1=%v2} : v1 = v2
{%v1=15} : v1 = 15
{%v1+%v2} : v1 = v1 + v2
{%v1+15} : v1 = v1 + 15
{%v1-%v2} : v1 = v1 - v2
{%v1-15} : v1 = v1 - 15
{%v1} : output v1
{$s1=$s2} : s1 = s2
{$s1=du text lala.} : s1 = txt
{$s1+$s2} : s1 = s1 + s2
{$s1+du text lala.} : s1 = s1 + txt
{$s1} : output s1
{\n} : output an endline
{table} : replace by table element
*/
var operations = [
// {%v1=%v2}
  {regex: /^{%(.+)=%(.*)}/, makeOperator(m) {
    var v1 = m[1], v2 = m[2];
    return function operator(data, context) {
      context.vars[v1] = +context.vars[v2];
    };
  }},
// {%v1=15}
  {regex: /^{%(.+)=(.*)}/, makeOperator(m) {
    var v1 = m[1], value = +m[2];
    return function operator(data, context) {
      context.vars[v1] = value;
    };
  }},
// {%v1+%v2}
  {regex: /^{%(.+)\+%(.*)}/, makeOperator(m) {
    var v1 = m[1], v2 = m[2];
    return function operator(data, context) {
      context.vars[v1] += +context.vars[v2];
    };
  }},
// {%v1+15}
  {regex: /^{%(.+)\+(.*)}/, makeOperator(m) {
    var v1 = m[1], value = +m[2];
    return function operator(data, context) {
      context.vars[v1] += value;
    };
  }},
// {%v1-%v2}
  {regex: /^{%(.+)-%(.*)}/, makeOperator(m) {
    var v1 = m[1], v2 = m[2];
    return function operator(data, context) {
      context.vars[v1] -= +context.vars[v2];
    };
  }},
// {%v1-15}
  {regex: /^{%(.+)-(.*)}/, makeOperator(m) {
    var v1 = m[1], value = +m[2];
    return function operator(data, context) {
      context.vars[v1] -= value;
    };
  }},
// {%v1}
  {regex: /^{%(.+)}/, makeOperator(m) {
    var v1 = m[1];
    return function operator(data, context) {
      return context.vars[v1];
    };
  }},
// {$s1=$s2}
  {regex: /^{\$(.+)=\$(.*)}/, makeOperator(m) {
    var s1 = m[1], s2 = m[2];
    return function operator(data, context) {
      context.vars[s1] = String(context.vars[s2]);
    };
  }},
// {$s1=du text lala.}
  {regex: /^{\$(.+)=(.*)}/, makeOperator(m) {
    var s1 = m[1], text = m[2];
    return function operator(data, context) {
      context.vars[s1] = text;
    };
  }},
// {$s1+$s2}
  {regex: /^{\$(.+)\+\$(.*)}/, makeOperator(m) {
    var s1 = m[1], s2 = m[2];
    return function operator(data, context) {
      context.vars[s1] += String(context.vars[s2]);
    };
  }},
// {$s1+du text lala.}
  {regex: /^{\$(.+)\+(.*)}/, makeOperator(m) {
    var s1 = m[1], text = m[2];
    return function operator(data, context) {
      context.vars[s1] += text;
    };
  }},
// {$s1}
  {regex: /^{\$(.+)}/, makeOperator(m) {
    var s1 = m[1];
    return function operator(data, context) {
      return context.vars[s1];
    };
  }},
  {regex: /^{\\n}$/, makeOperator() {
    return function operator() {
      return "\n";
    };
  }},
// {table}
  {regex: /^{(.*)}/, makeOperator(m) {
    var tablename = m[1];
    return function operator(data, context, options) {
      var t = data.tables[tablename];
      if(!t) {
        return undefined;
      }
      if(tablename === "race" && options.race !== null) {
        return t.options[options.race].val;
      }
      else if(tablename === "forcealign" && options.alignment !== null) {
        return t.options[options.alignment].val;
      }
      else if(tablename === "gender" && options.gender !== null) {
        return t.options[options.gender].val;
      }
      if(options.classorprof !== null) {
        if(tablename === "occupation") {
          return t.options[options.classorprof].val;
        }
        else if(options.classorprof === 0 && tablename === "class") {
          return t.options[options.occupation1].val;
        }
        else if(options.classorprof === 1 && tablename === "profession") {
          return t.options[options.occupation1].val;
        }
        else if(options.classorprof === 1 && (tablename === "learned" ||
                     tablename === "lesserNobility" ||
                     tablename === "professional" ||
                     tablename === "workClass" ||
                     tablename === "martial" ||
                     tablename === "underclass" ||
                     tablename === "entertainer")) {
          return t.options[options.occupation2].val;
        }
      }
      var rnum = ((Math.random() * t.weight) + 1) | 0;
      var i = 0;
      while(rnum > 0) {
        rnum -= t.options[i++].weight;
      }
      return t.options[i - 1].val;
    };
  }}
];

function getGroups(val) {
  val = val || "";
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

export function readDataFile(filename, cb) {
  fs.readFile(filename, {encoding: "utf8"}, (err, data) => {
    if(err) {
      return cb(err);
    }
    var npcData = new NPCData();
    var splitData = data.split("\r\n");
    npcData.output = splitData[0];

    splitData.shift();
    var curTable = null,
      totalWeight = 0;
    splitData.forEach(line => {
      if(line.length === 0) {
        if(curTable) {
          npcData.tables[curTable].weight = totalWeight;
        }
        curTable = null;
        totalWeight = 0;
      } else if(!curTable) {
        curTable = line;
        npcData.tables[curTable] = {weight: 0, options: []};
      } else {
        var splitResult = /^(\d+) (.*)$/.exec(line);
        if(splitResult) {
          var weight = +splitResult[1];
          var val = getGroups(splitResult[2]);
          npcData.tables[curTable].options.push({weight: weight, val: val});
          totalWeight += weight;
        }
      }
    });
    if(curTable) {
      npcData.tables[curTable].weight = totalWeight;
    }
    cb(null, npcData);
  });
}

export function generate(output, data, options) {
  options = options || {};
  options.race = options.race !== undefined ? options.race|0 : null;
  options.classorprof = options.classorprof !== undefined ? options.classorprof|0 : null;
  options.occupation1 = options.occupation1 !== undefined ? options.occupation1|0 : null;
  options.occupation2 = options.occupation2 !== undefined ? options.occupation2|0 : null;
  options.alignment = options.alignment !== undefined ? options.alignment|0 : null;
  options.gender = options.gender !== undefined ? options.gender|0 : null;

  var groupOutput = getGroups(output);
  var context = {vars: {}};
  function processGroups(groups) {
    var result = "";
    groups.forEach(instruction => {
      if(_.isString(instruction)) {
        result += instruction;
      }
      else if(_.isFunction(instruction)) {
        var insRes = instruction(data, context, options);
        if(insRes) {
          if(_.isArray(insRes)) {
            result += processGroups(insRes);
          }
          else {
            result += insRes;
          }
        }
      }
      else if(_.isArray(instruction)) {
        result += processGroups(instruction);
      }
    });
    return result;
  }
  return processGroups(groupOutput);
}
