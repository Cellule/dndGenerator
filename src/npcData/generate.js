
import data from "./index";
import schema from "./schema.json";
import {getGroups, chooseRandomWithWeight, debugGen} from "./utils";

function numberOrNull(v) {
  return typeof v === "number" ? v|0 : null;
}

export function generate({
  race,
  subrace,
  classorprof,
  occupation1,
  occupation2,
  alignment,
  plothook,
  gender,
} = {}) {
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

  const context = {vars: {}};
  let debugNode = {o: "root", childs: []};
  function processGroups(groups) {
    var result;
    var addToResult = function(value) {
      if(value !== undefined && value !== null) {
        result = value;
        addToResult = function(newValue) {
          result += String(newValue);
        };
      }
    };
    groups.forEach(function(instruction) {
      if(typeof instruction === "string") {
        debugNode.childs.push(instruction);
        addToResult(instruction);
      } else {
        const oldNode = debugNode;
        if (debugGen) {
          const node = {o: instruction.original, childs: []};
          debugNode.childs.push(node);
          debugNode = node;
        }
        if(typeof instruction === "function") {
          var insRes = instruction(data, context, options);
          if(insRes !== undefined) {
            if(Array.isArray(insRes)) {
              addToResult(processGroups(insRes));
            }
            else {
              addToResult(insRes);
            }
          }
        }
        else if(Array.isArray(instruction)) {
          addToResult(processGroups(instruction));
        }
        debugNode = oldNode;
      }
    });
    return result;
  }

  function chooseFromArray(arr) {
    var totalWeight = arr.reduce(function(w, e) {
      return w + (e.w|0);
    }, 0);
    return chooseRandomWithWeight(arr, totalWeight);
  }

  function processSchema(schemaElement) {
    if(typeof schemaElement === "string") {
      return processGroups(getGroups(schemaElement));
    } else if(Array.isArray(schemaElement)) {
      return processSchema(chooseFromArray(schemaElement));
    }
    var result = {};
    for (const name of Object.keys(schemaElement)) {
      const element = schemaElement[name];
      // need to make a choice based on weight
      if(Array.isArray(element)) {
        result[name] = processSchema(chooseFromArray(element));
      } else {
        result[name] = processSchema(element);
      }
    }
    return result;
  }

  // treat options
  if(schema.options) {
    // process inititalisation first, most of the selection is done here
    processGroups(getGroups(schema.options.initialisation));
  }


  const npc = processSchema(schema.output);
  if (debugGen) {
    npc.debug = debugNode;
  }
  return npc;
}

export function printDebugGen(npc) {
  const debugNode = npc.debug;
  if (debugNode) {
    let depth = 0;
    let lines = [];
    const indent = () => " ".repeat(depth);
    const processNode = node => {
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
    }
    processNode(debugNode);
    console.log(lines.join("\n"))
  }
}

//while(true) {
//  const res = generate();
//  if (!res.description.name) {
//    printDebugGen(res);
//    break;
//  }
//}