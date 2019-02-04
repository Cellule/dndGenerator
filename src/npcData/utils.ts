import { Group, Operator } from "./index";
import {getTable} from "./tables";
export const debugGen = process.env.NODE_ENV === "development";

export function chooseRandomWithWeight<T>(arr: {
  w: number;
  v: T
}[], totalWeight: number): T {
  let rnum = ((Math.random() * totalWeight) + 1) | 0;
  let i = 0;
  while (rnum > 0) {
    rnum -= arr[i++].w;
  }
  return arr[i - 1].v;
}

function mapGroup(g: string): Group {
  //todo: replace escaped \{ and \}
  if (g[0] === "{") {
    for (const op of operators) {
      const m = g.match(op.regex);
      if (m) {
        return op.makeOperator(m);
      }
    }
    return () => { };
  }
  return g;
}


export function getGroups(val: string): Group[] {
  if (typeof val !== "string" || val.length === 0) {
    throw new Error("Empty value to get group");
  }
  val = val.replace("{\\n}", "\n");
  const r = (val.match(/{((\\{|\\}|[^{}])*)}|((\\{|\\}|[^{}])+)/g) || [])
    .map(g => {
      const r = mapGroup(g);
      if (debugGen && typeof r !== "string") {
        r.original = g;
      }
      return r;
    });
  return r;
}

function isNumber(n: any): n is number {
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
const operators: {
  regex: RegExp,
  makeOperator: (m: RegExpMatchArray) => Operator,
}[] = [
    // {%v1=%v2}
    {
      regex: /^{%(.+)=%(.*)}/, makeOperator(m) {
        const v1 = m[1], v2 = m[2];
        return function operator(context) {
          context.vars[v1] = +context.vars[v2];
        };
      }
    },
    // {%v1=15}
    {
      regex: /^{%(.+)=(.*)}/, makeOperator(m) {
        const v1 = m[1], value = +m[2];
        return function operator(context) {
          context.vars[v1] = value;
        };
      }
    },
    // {%v1+%v2}
    {
      regex: /^{%(.+)\+%(.*)}/, makeOperator(m) {
        const v1 = m[1], v2 = m[2];
        return function operator(context) {
          context.vars[v1] = (+context.vars[v1]) + (+context.vars[v2]);
        };
      }
    },
    // {%v1+15}
    {
      regex: /^{%(.+)\+(.*)}/, makeOperator(m) {
        const v1 = m[1], value = +m[2];
        return function operator(context) {
          context.vars[v1] = (+context.vars[v1]) + value;
        };
      }
    },
    // {%v1-%v2}
    {
      regex: /^{%(.+)-%(.*)}/, makeOperator(m) {
        const v1 = m[1], v2 = m[2];
        return function operator(context) {
          context.vars[v1] = (+context.vars[v1]) - (+context.vars[v2]);
        };
      }
    },
    // {%v1-15}
    {
      regex: /^{%(.+)-(.*)}/, makeOperator(m) {
        const v1 = m[1], value = +m[2];
        return function operator(context) {
          context.vars[v1] = (+context.vars[v1]) - value;
        };
      }
    },
    // {%v1}
    {
      regex: /^{%(.+)}/, makeOperator(m) {
        const v1 = m[1];
        return function operator(context) {
          return (+context.vars[v1]) | 0;
        };
      }
    },
    // {$s1=$s2}
    {
      regex: /^{\$(.+)=\$(.*)}/, makeOperator(m) {
        const s1 = m[1], s2 = m[2];
        return function operator(context) {
          context.vars[s1] = String(context.vars[s2]);
        };
      }
    },
    // {$s1=du text lala.}
    {
      regex: /^{\$(.+)=(.*)}/, makeOperator(m) {
        const s1 = m[1], text = m[2];
        return function operator(context) {
          context.vars[s1] = text;
        };
      }
    },
    // {$s1+$s2}
    {
      regex: /^{\$(.+)\+\$(.*)}/, makeOperator(m) {
        const s1 = m[1], s2 = m[2];
        return function operator(context) {
          context.vars[s1] += String(context.vars[s2]);
        };
      }
    },
    // {$s1+du text lala.}
    {
      regex: /^{\$(.+)\+(.*)}/, makeOperator(m) {
        const s1 = m[1], text = m[2];
        return function operator(context) {
          context.vars[s1] += text;
        };
      }
    },
    // {$s1}
    {
      regex: /^{\$(.+)}/, makeOperator(m) {
        const s1 = m[1];
        return function operator(context) {
          return context.vars[s1];
        };
      }
    },
    {
      regex: /^{\\n}$/, makeOperator() {
        return function operator() {
          return "\n";
        };
      }
    },
    // {table}
    {
      regex: /^{(.*)}/, makeOperator(m) {
        const tablename = m[1];
        const t = getTable(tablename);
        return function operator(context, options) {
          function chooseOption(index: number) {
            if ((index >>> 0) >= t.options.length) {
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

          if (tablename === "race" && isNumber(options.race)) {
            return chooseOption(options.race);
          } else if (tablename === "forcealign" && isNumber(options.alignment)) {
            return chooseOption(options.alignment);
          } else if (tablename === "hooks" && isNumber(options.plothook)) {
            return chooseOption(options.plothook);
          } else if (tablename.match(/gender$/) && isNumber(options.gender)) {
            return chooseOption(options.gender);
          }
          if (isNumber(options.subrace) &&
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

          if (isNumber(options.classorprof)) {
            if (tablename === "occupation") {
              return chooseOption(options.classorprof);
            } else if (
              isNumber(options.occupation1) &&
              options.classorprof === 0 &&
              tablename === "class"
            ) {
              return chooseOption(options.occupation1);
            } else if (
              isNumber(options.occupation1) &&
              options.classorprof === 1 &&
              tablename === "profession"
            ) {
              return chooseOption(options.occupation1);
            } else if (
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
      }
    }
  ];
