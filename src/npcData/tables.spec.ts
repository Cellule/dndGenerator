import { expect } from "chai";
import "mocha";
import schema from "./schema.json";
import { AnalysisNode, Definition, StaticAnalysis, Use } from "./staticAnalysis";
import { getTable, getTableNames } from "./tables";
import { operators, reGroup } from "./utils";

it("parses tables", () => {
  for (const tableName of getTableNames()) {
    const { w: totalWeight, options } = getTable(tableName);
    let recalculatedTotalWeight = 0;
    for (const option of options) {
      const { w, v, original } = option;
      // todo: find how to check if grouping was done correctly
      recalculatedTotalWeight += w;
    }
    expect(recalculatedTotalWeight).to.equal(totalWeight);
  }
});

function mapGroup(g: string): StaticAnalysis {
  //todo: replace escaped \{ and \}
  if (g[0] === "{") {
    for (const op of operators) {
      const m = g.match(op.regex);
      if (m) {
        return op.analysis(m);
      }
    }
  }
  return {};
}
function getGroups(val: string) {
  if (typeof val !== "string" || val.length === 0) {
    throw new Error("Empty value to get group");
  }
  val = val.replace("{\\n}", "\n");
  const groups = (val.match(reGroup) || []).map(mapGroup);
  return {
    groups,
    original: val,
  };
}

type UsesMap = { [name: string]: Use };
type DefsMap = { [name: string]: Definition };
type Row = {
  isLeaf: boolean;
  defs: Definition[];
  uses: Use[];
  hasRecursion?: boolean;
};

it("has valid table schema", () => {
  type TableAnalysis = {
    groups: StaticAnalysis[];
    original: string;
  }[];
  const tablesAnalysis: { [name: string]: { analysis: TableAnalysis } & Row } = {};

  for (const tableName of getTableNames()) {
    const { options } = getTable(tableName);
    const rows = options.map(({ original }) => getGroups(original));
    tablesAnalysis[tableName] = {
      analysis: rows,
      defs: [],
      isLeaf: false,
      uses: [],
    };
  }
  const analysis = getGroups(schema.options.initialisation);
  const result = processGroups(analysis.groups, ["schema"]);
  processSchema(
    schema.output,
    ["output"],
    result.defs.reduce((a, d) => {
      a[d.name] = d;
      return a;
    }, {} as DefsMap),
  );

  function processSchema(schemaElement: any, paths: string[], defs: DefsMap) {
    if (typeof schemaElement === "string") {
      processGroups(getGroups(schemaElement).groups, paths, defs);
    } else if (Array.isArray(schemaElement)) {
      let i = 0;
      for (const element of schemaElement) {
        processSchema(element.v, [...paths, String(i)], defs);
        ++i;
      }
    } else {
      expect(schemaElement).to.be.an("object");
      for (const name of Object.keys(schemaElement)) {
        const element = schemaElement[name];
        // need to make a choice based on weight
        processSchema(element, [...paths, name], defs);
      }
    }
  }

  function processGroups(
    groupsAnalysis: StaticAnalysis[],
    tablePaths: string[],
    prevDef: DefsMap = {},
  ): Row {
    // shallow clone
    const groupsDefinitions = { ...prevDef };
    const newDefs: DefsMap = {};
    const newUses: UsesMap = {};

    function checkIsDefined(node: AnalysisNode) {
      if (!groupsDefinitions[node.name]) {
        console.log(
          tablePaths.join(" => ") +
            `: is using "${node.name}", but it hasn't been defined on the path`,
        );
      } else if (groupsDefinitions[node.name].type !== node.type) {
        console.log(
          tablePaths.join(" => ") +
            `: is using "${node.name}" with type ${node.type}, but it has type ${
              groupsDefinitions[node.name].type
            } on the path`,
        );
      }
      expect(groupsDefinitions).to.haveOwnProperty(node.name);
      expect(groupsDefinitions[node.name].type).to.equal(node.type);
    }

    function processUse(use: Use) {
      checkIsDefined(use);
      newUses[use.name] = use;
    }

    function processDefinition(def: Definition) {
      if (groupsDefinitions[def.name]) {
        // It is already defined, check again to ensure the type is the same
        checkIsDefined(def);
      }
      newDefs[def.name] = def;
      groupsDefinitions[def.name] = def;
    }

    function processTable(tableName: string, tableAnalysis: TableAnalysis) {
      const nextTablePaths = tablePaths.concat([tableName]);
      // Process all rows of that table
      const rows: Row[] = tableAnalysis.map((row) =>
        processGroups(row.groups, nextTablePaths, groupsDefinitions),
      );

      const defs = rows.reduce(
        (p, row, iRow) =>
          row.defs.reduce((a, def) => {
            const key = def.name;
            if (!a[key]) {
              // First definition
              a[key] = { count: 1, def, rows: { [iRow]: true } };
            } else if (a[key].def.type === def.type) {
              // Already defined by another row
              a[key].count++;
              a[key].rows[iRow] = true;
            } else {
              // Defined with a different type
              console.log(
                tablePaths.join(" => ") +
                  `:
  ${tableAnalysis[iRow].original}
  is defining "${def.name}" with type "${def.type}", but it has type "${a[key].def.type}" in other rows`,
              );
              expect(def.type).to.equal(a[key].def.type);
            }
            return a;
          }, p),
        {} as {
          [name: string]: { count: number; def: Definition; rows: { [index: number]: boolean } };
        },
      );

      // Ignore blocks with recursion for expected definitions since we can't easily find out
      const expectedDefs = rows.length - rows.filter((block) => block.hasRecursion).length;
      const commonDefs: Definition[] = [];
      for (const value of Object.values(defs)) {
        if (value.count < expectedDefs) {
          if (!groupsDefinitions[value.def.name]) {
            // Uncomment these lines when trying to figure out where a variable should be defined
            // Right now this is too noisy and only relevant to debug
            //console.log(`Table ${tableName}: ${expectedDefs - value.count} missing definitions of ${value.def.name}:`);
            //for (let i = 0; i < tableAnalysis.length; ++i) {
            //  if (!value.rows[i]) {
            //    console.log(`  ${tableAnalysis[i].original}`);
            //  }
            //}
          }
        } else {
          commonDefs.push(value.def);
        }
      }

      // Only process definitions common to all rows
      commonDefs.forEach(processDefinition);

      const isTableLeaf = rows.reduce((isLeaf, block) => isLeaf && block.isLeaf, true);
      if (isTableLeaf) {
        // save this so we don't have to do it again
        tablesAnalysis[tableName].isLeaf = true;
        tablesAnalysis[tableName].defs = commonDefs;
        const useMap = rows.reduce((uses, block) => {
          return block.uses.reduce((prev, use) => {
            prev[use.name] = use;
            return prev;
          }, uses);
        }, {} as UsesMap);
        tablesAnalysis[tableName].uses = Object.values(useMap);
      }
    }

    let isLeaf = true;
    let hasRecursion = false;
    for (const item of groupsAnalysis) {
      if (item.use) {
        item.use.forEach(processUse);
      }
      if (item.def) {
        item.def.forEach(processDefinition);
      }
      if (item.table) {
        isLeaf = false;
        const tableAnalysis = tablesAnalysis[item.table];
        const isRecursive = tablePaths.includes(item.table);
        if (isRecursive) {
          // if there is recursion, make sure there is more than one choice so the random selection can break out
          // todo:: make sure the weight also garanties to break out
          expect(tableAnalysis.analysis.length).to.be.greaterThan(1);
          hasRecursion = true;
        } else if (tableAnalysis.isLeaf) {
          // Leaf tables are static and already processed, just use the info we got
          tableAnalysis.uses.forEach(processUse);
          tableAnalysis.defs.forEach(processDefinition);
        } else {
          processTable(item.table, tableAnalysis.analysis);
        }
      }
    }
    return {
      defs: Object.values(newDefs),
      uses: Object.values(newUses),
      isLeaf,
      hasRecursion,
    };
  }
});
