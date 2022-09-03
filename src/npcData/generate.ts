import { DebugNode, Group, Npc, NpcGenerateOptions, Operator, SchemaDescriptor, SchemaElement, SchemaResult, WeightedValue } from "./index.js";
import schema from "./schema.json";
import { chooseRandomWithWeight, debugGen, getGroups } from "./utils";

function numberOrNull(v: any) {
  return typeof v === "number" ? v | 0 : null;
}

export function generate({ race, subrace, classorprof, occupation1, occupation2, alignment, plothook, gender }: NpcGenerateOptions = {}) {
  const options = {
    race: numberOrNull(race),
    subrace: numberOrNull(subrace),
    classorprof: numberOrNull(classorprof),
    occupation1: numberOrNull(occupation1),
    occupation2: numberOrNull(occupation2),
    alignment: numberOrNull(alignment),
    plothook: numberOrNull(plothook),
    gender: numberOrNull(gender),
  };

  const context = { vars: {} };
  let debugNode: DebugNode = { o: "root", childs: [] };
  function processGroups(groups: Group[]) {
    let result = "";
    for (const instruction of groups) {
      if (typeof instruction === "string") {
        debugNode.childs.push(instruction);
        result += String(instruction);
      } else {
        const oldNode = debugNode;
        if (debugGen) {
          const node = { o: instruction.original, childs: [] };
          debugNode.childs.push(node);
          debugNode = node;
        }
        if (typeof instruction === "function") {
          const insRes = (instruction as Operator)(context, options);
          if (insRes !== undefined) {
            if (Array.isArray(insRes)) {
              result += String(processGroups(insRes));
            } else {
              result += String(insRes);
            }
          }
        } else if (Array.isArray(instruction)) {
          result += String(processGroups(instruction));
        }
        debugNode = oldNode;
      }
    }
    return result;
  }

  function chooseFromArray(arr: WeightedValue[]): string {
    const totalWeight = arr.reduce(function (w, e) {
      return w + (e.w | 0);
    }, 0);
    return chooseRandomWithWeight(arr, totalWeight);
  }

  function processSchema(schemaElement: SchemaDescriptor): SchemaResult;
  function processSchema(schemaElement: any): string;
  function processSchema(schemaElement: SchemaElement | SchemaDescriptor): SchemaResult | string {
    if (typeof schemaElement === "string") {
      return processGroups(getGroups(schemaElement));
    } else if (Array.isArray(schemaElement)) {
      return processSchema(chooseFromArray(schemaElement));
    }
    const result: SchemaResult = {};
    for (const name of Object.keys(schemaElement)) {
      const element = schemaElement[name];
      // need to make a choice based on weight
      result[name] = processSchema(element);
    }
    return result;
  }

  // process inititalisation first, most of the selection is done here
  processGroups(getGroups(schema.options.initialisation));

  // Force to Npc type because we know schema.output matches the Npc type
  const npc: Npc = processSchema(schema.output) as any;
  return { npc, debugNode };
}

export function printDebugGen(debugNode: DebugNode) {
  if (debugNode) {
    let depth = 0;
    const lines: string[] = [];
    const indent = () => " ".repeat(depth);
    const processNode = (node: DebugNode | string) => {
      if (typeof node === "string") {
        lines.push(indent() + `-> ${node}`);
      } else {
        lines.push(indent() + `-> ${node.o}`);
        depth++;
        for (const child of node.childs) {
          processNode(child);
        }
        depth--;
      }
    };
    processNode(debugNode);
    console.log(lines.join("\n"));
  }
}
