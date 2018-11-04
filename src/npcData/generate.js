
import data from "./index";
import schema from "./schema.json";
import {getGroups, chooseRandomWithWeight} from "./utils";

export function generate(options = {}) {
  options.race = options.race !== undefined ? options.race|0 : null;
  options.subrace = options.subrace !== undefined ? options.subrace|0 : null;
  options.classorprof = options.classorprof !== undefined ?
    options.classorprof|0 : null;
  options.occupation1 = options.occupation1 !== undefined ?
    options.occupation1|0 : null;
  options.occupation2 = options.occupation2 !== undefined ?
    options.occupation2|0 : null;
  options.alignment = options.alignment !== undefined ?
    options.alignment|0 : null;
  options.plothook = options.plothook !== undefined ?
    options.plothook|0 : null;
  options.gender = options.gender !== undefined ?
    options.gender|0 : null;

  const context = {vars: {}};
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
        addToResult(instruction);
      }
      else if(typeof instruction === "function") {
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

  return processSchema(schema.output);
}