import {getGroups} from "./utils";
import path from "path";
var tables = {};

function importAll (r) {
  r.keys().forEach(key => {
    const name = path.basename(key, ".json");
    const table = r(key);
    let totalWeight = 0;
    const options = table.map(row => {
      const w = row.w > 0 ? row.w : 0;
      totalWeight += w;
      return {
        ...row,
        w,
        v: getGroups(row.v),
        original: row.v
      }
    });
    var convertedTable = {w: totalWeight, options};
    tables[name] = convertedTable;
  });
}

importAll(require.context('./tables/', false, /\.json$/));

export default {
  tables
};

export function getTableOptions(tablename) {
  return tables[tablename].options;
}