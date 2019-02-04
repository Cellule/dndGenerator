import { Option, WeightedValue } from "./index";
import { getGroups } from "./utils";
import path from "path";
import fs from "fs";

interface TableEntry {
  w: number,
  options: Option[]
}

interface Tables {
  [name: string]: TableEntry
}
const tables = {} as Tables;

function importTable(tableName: string, r: (id: string) => any) {
  const name = path.basename(tableName, ".json");
  const table: WeightedValue[] = r(tableName);
  let totalWeight = 0;
  const options = table.map(row => {
    const w = row.w > 0 ? row.w : 0;
    totalWeight += w;
    return {
      ...row,
      w,
      v: getGroups(row.v) || [],
      original: row.v
    }
  });
  var convertedTable = { w: totalWeight, options };
  tables[name] = convertedTable;
}

if (process && process.env && process.env.MOCHA) {
  const dir = path.join(__dirname, "./tables");
  const dirContent = fs.readdirSync(dir);
  for (const table of dirContent) {
    // eslint-disable-next-line
    importTable(table, t => require(path.join(dir, t)));
  }
} else {
  const r = require.context('./tables/', false, /\.json$/);
  r.keys().forEach((key: string) => {
    importTable(key, r);
  });
}

export default tables;

export interface NamedOption extends Option {
  name?: string;
}
export interface TableReferenceOption extends NamedOption {
  table: string;
}

export function getNamedTableOptions(tablename: string): NamedOption[] {
  const options = tables[tablename].options;
  return options as NamedOption[];
}

export function getTableReferenceOptions(tablename: keyof Tables): TableReferenceOption[] {
  const options = tables[tablename].options as any;
  for (const opt of options) {
    if (!("table" in opt)) {
      throw new Error(`Missing "table" property in table ${tablename} option ${opt.original}`);
    }
  }
  return options as TableReferenceOption[];
}

export function getTableOptions(tablename: string) {
  return tables[tablename].options;
}