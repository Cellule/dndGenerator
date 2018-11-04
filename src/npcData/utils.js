export const debugGen = process.env.NODE_ENV === "development";

export function chooseRandomWithWeight(arr, totalWeight) {
  var rnum = ((Math.random() * totalWeight) + 1) | 0;
  var i = 0;
  while(rnum > 0) {
    rnum -= arr[i++].w;
  }
  return arr[i - 1].v;
}

export function getGroups(val) {
  if (typeof val !== "string" || val.length === 0) {
    return "";
  }
  val = val.replace("{\\n}", "\n");
  var r = val.match(/{((\\{|\\}|[^{}])*)}|((\\{|\\}|[^{}])+)/g).map(function(g) {
    const mapGroup = () => {
      //todo: replace escaped \{ and \}
      if(g[0] === "{") {
        var res = {};
        for (const op of operators) {
          var m = g.match(op.regex);
          if (m) {
            return op.makeOperator(m);
          }
        }
        return res;
      }
      return g;
    }
    const r = mapGroup();
    if (debugGen && typeof r !== "string") {
      r.original = g;
    }
    return r;
  });
  return r;
}

function isNumber(n) {
  return typeof n === "number";
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
const operators = [
// {%v1=%v2}
  {regex: /^{%(.+)=%(.*)}/, makeOperator: function(m) {
    var v1 = m[1], v2 = m[2];
    return function operator(data, context) {
      context.vars[v1] = +context.vars[v2];
    };
  }},
// {%v1=15}
  {regex: /^{%(.+)=(.*)}/, makeOperator: function(m) {
    var v1 = m[1], value = +m[2];
    return function operator(data, context) {
      context.vars[v1] = value;
    };
  }},
// {%v1+%v2}
  {regex: /^{%(.+)\+%(.*)}/, makeOperator: function(m) {
    var v1 = m[1], v2 = m[2];
    return function operator(data, context) {
      context.vars[v1] += +context.vars[v2];
    };
  }},
// {%v1+15}
  {regex: /^{%(.+)\+(.*)}/, makeOperator: function(m) {
    var v1 = m[1], value = +m[2];
    return function operator(data, context) {
      context.vars[v1] += value;
    };
  }},
// {%v1-%v2}
  {regex: /^{%(.+)-%(.*)}/, makeOperator: function(m) {
    var v1 = m[1], v2 = m[2];
    return function operator(data, context) {
      context.vars[v1] -= +context.vars[v2];
    };
  }},
// {%v1-15}
  {regex: /^{%(.+)-(.*)}/, makeOperator: function(m) {
    var v1 = m[1], value = +m[2];
    return function operator(data, context) {
      context.vars[v1] -= value;
    };
  }},
// {%v1}
  {regex: /^{%(.+)}/, makeOperator: function(m) {
    var v1 = m[1];
    return function operator(data, context) {
      return context.vars[v1] | 0;
    };
  }},
// {$s1=$s2}
  {regex: /^{\$(.+)=\$(.*)}/, makeOperator: function(m) {
    var s1 = m[1], s2 = m[2];
    return function operator(data, context) {
      context.vars[s1] = String(context.vars[s2]);
    };
  }},
// {$s1=du text lala.}
  {regex: /^{\$(.+)=(.*)}/, makeOperator: function(m) {
    var s1 = m[1], text = m[2];
    return function operator(data, context) {
      context.vars[s1] = text;
    };
  }},
// {$s1+$s2}
  {regex: /^{\$(.+)\+\$(.*)}/, makeOperator: function(m) {
    var s1 = m[1], s2 = m[2];
    return function operator(data, context) {
      context.vars[s1] += String(context.vars[s2]);
    };
  }},
// {$s1+du text lala.}
  {regex: /^{\$(.+)\+(.*)}/, makeOperator: function(m) {
    var s1 = m[1], text = m[2];
    return function operator(data, context) {
      context.vars[s1] += text;
    };
  }},
// {$s1}
  {regex: /^{\$(.+)}/, makeOperator: function(m) {
    var s1 = m[1];
    return function operator(data, context) {
      return context.vars[s1];
    };
  }},
  {regex: /^{\\n}$/, makeOperator: function() {
    return function operator() {
      return "\n";
    };
  }},
// {table}
  {regex: /^{(.*)}/, makeOperator: function(m) {
    var tablename = m[1];
    return function operator(data, context, options) {
      var t = data.tables[tablename];
      if(!t) {
        console.log("Unable to find table [%s]", tablename);
        return undefined;
      }

      function chooseOption(index) {
        if((index >>> 0) >= t.options.length) {
          console.warn("Index [%d] for table [%s]", index, tablename);
          return chooseRandomWithWeight(t.options, t.w);
        }
        /*if(__DEV__) {
          console.log(
            "Table [%s] option forced to [%s]",
            tablename,
            t.options[index].original
          );
        }*/
        return t.options[index].v;
      }

      if(tablename === "race" && isNumber(options.race)) {
        return chooseOption(options.race);
      } else if(tablename === "forcealign" && isNumber(options.alignment)) {
        return chooseOption(options.alignment);
      } else if(tablename === "hooks" && isNumber(options.plothook)) {
        return chooseOption(options.plothook);
      } else if(tablename.match(/gender$/) && isNumber(options.gender)) {
        return chooseOption(options.gender);
      }
      if(isNumber(options.subrace) &&
        (
          tablename === "raceelf" ||
          tablename === "racedwarf" ||
          tablename === "racegnome" ||
          tablename === "racehalfling" ||
          tablename === "racegenasi"
        )
      ) {
        return chooseOption(options.subrace);
      }

      if(isNumber(options.classorprof)) {
        if(tablename === "occupation") {
          return chooseOption(options.classorprof);
        } else if(
          isNumber(options.occupation1) &&
          options.classorprof === 0 &&
          tablename === "class"
        ) {
          return chooseOption(options.occupation1);
        } else if(
          isNumber(options.occupation1) &&
          options.classorprof === 1 &&
          tablename === "profession"
        ) {
          return chooseOption(options.occupation1);
        } else if(
          isNumber(options.occupation1) &&
          isNumber(options.occupation2) &&
          options.classorprof === 1 &&
          (
            tablename === "learned" ||
            tablename === "lesserNobility" ||
            tablename === "professional" ||
            tablename === "workClass" ||
            tablename === "martial" ||
            tablename === "underclass" ||
            tablename === "entertainer"
          )
        ) {
          return chooseOption(options.occupation2);
        }
      }
      return chooseRandomWithWeight(t.options, t.w);
    };
  }}
];
