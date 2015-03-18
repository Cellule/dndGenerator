var chooseRandomWithWeight = require("./chooseRandomWithWeight");
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
export default [
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
      return context.vars[v1] | 0;
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
        return t.options[options.race].v;
      }
      else if(tablename === "forcealign" && options.alignment !== null) {
        return t.options[options.alignment].v;
      }
      else if(tablename === "gender" && options.gender !== null) {
        return t.options[options.gender].v;
      }
      if(options.classorprof !== null) {
        if(tablename === "occupation") {
          return t.options[options.classorprof].v;
        }
        else if(options.classorprof === 0 && tablename === "class") {
          return t.options[options.occupation1].v;
        }
        else if(options.classorprof === 1 && tablename === "profession") {
          return t.options[options.occupation1].v;
        }
        else if(options.classorprof === 1 && (tablename === "learned" ||
                     tablename === "lesserNobility" ||
                     tablename === "professional" ||
                     tablename === "workClass" ||
                     tablename === "martial" ||
                     tablename === "underclass" ||
                     tablename === "entertainer")) {
          return t.options[options.occupation2].v;
        }
      }
      return chooseRandomWithWeight(t.options, t.w);
    };
  }}
];
