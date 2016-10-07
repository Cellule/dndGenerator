var fs = require("fs");
var _ = require("lodash");
var async = require("async");
var path = require("path");
var utils = require("./utils");
var chooseRandomWithWeight = utils.chooseRandomWithWeight;
var getGroups = utils.getGroups;

var exports = module.exports = {};

exports.readTables = function(folder, cb) {
  // todo :: check if waterfall is really needed
  async.waterfall([
    // read all files from folder
    function(next) { fs.readdir(folder, next); },
    function(files, next) {
      var allTables = {};
      // process each files
      async.each(files, function(file, cb) {
        var table;
        try {
          // try to require it, possibly junk in the folder
          table = require(path.resolve(folder, file));
        } catch (e) {
          if(global.__DEV__) {
            console.warn(
              "Unable to load table %s",
              path.basename(file, ".json5")
            );
          }
          // simply ignore this file
          return cb();
        }
        var convertedTable = {w: 0, options: []};

        // convert all the elements in the table from string to groups
        async.map(table, function(row, next) {
          var weight = row.w > 0 ? row.w : 0;
          // accumulate weight
          // todo:: possible race condition, try to use reduce or synced
          convertedTable.w += weight;
          next(null, {w: weight, v: getGroups(row.v), original: row.v} );
        }, function(err, options) {
          if(err) { return cb(err); }

          convertedTable.options = options;
          var tablename = path.basename(file, path.extname(file));
          // todo :: maybe use reduce instead
          allTables[tablename] = convertedTable;
          cb(null);
        });
      }, function(err) {
        // last waterfall element
        next(err, allTables);
      });
    }
  ], function(err, allTables) {
    cb(err, {tables: allTables});
  });
};

exports.generate = function(schema, data, options) {
  options = options || {};
  options.race = options.race !== undefined ? options.race|0 : null;
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

  var context = {vars: {}};
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
      if(_.isString(instruction)) {
        addToResult(instruction);
      }
      else if(_.isFunction(instruction)) {
        var insRes = instruction(data, context, options);
        if(insRes !== undefined) {
          if(_.isArray(insRes)) {
            addToResult(processGroups(insRes));
          }
          else {
            addToResult(insRes);
          }
        }
      }
      else if(_.isArray(instruction)) {
        addToResult(processGroups(instruction));
      }
    });
    return result;
  }

  function chooseFromArray(arr) {
    var totalWeight = _.reduce(arr, function(w, e) {
      return w + (e.w|0);
    }, 0);
    return chooseRandomWithWeight(arr, totalWeight);
  }

  function processSchema(schemaElement) {
    if(_.isString(schemaElement)) {
      return processGroups(getGroups(schemaElement));
    } else if(_.isArray(schemaElement)) {
      return processSchema(chooseFromArray(schemaElement));
    }
    var result = {};
    _.each(schemaElement, function(element, name) {
      // need to make a choice based on weight
      if(_.isArray(element)) {
        result[name] = processSchema(chooseFromArray(element));
      } else {
        result[name] = processSchema(element);
      }
    });
    return result;
  }

  // treat options
  if(schema.options) {
    // process inititalisation first, most of the selection is done here
    processGroups(getGroups(schema.options.initialisation));
  }

  return processSchema(schema.output);
};
