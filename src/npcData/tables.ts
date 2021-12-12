import path from "path";
import { Option, WeightedValue } from "./index";
import { getGroups } from "./utils";

interface TableEntry {
  w: number;
  options: Option[];
}

interface Tables {
  [name: string]: TableEntry;
}
const tables = {} as Tables;
let isInitialized = false;

function initAvailableTables(files: string[]) {
  for (const file of files) {
    const name = path.basename(file, ".json");
    tables[name] = { w: 0, options: [] };
  }
  isInitialized = true;
}

function importTable(tableName: string, r: (id: string) => any) {
  const name = path.basename(tableName, ".json");
  const table: WeightedValue[] = r(tableName);
  let totalWeight = 0;
  const options = table.map((row) => {
    const w = row.w > 0 ? row.w : 0;
    totalWeight += w;
    return {
      ...row,
      w,
      v: getGroups(row.v) || [],
      original: row.v,
    };
  });
  tables[name].options = options;
  tables[name].w = totalWeight;
}

function ensureTablesAreInitialized() {
  if (!isInitialized) {
    if (process.env.NODE_ENV === "test") {
      const fs = require("fs");
      const dir = path.join(__dirname, "./tables");
      const dirContent: string[] = fs.readdirSync(dir).filter((f: string) => f.endsWith(".json"));
      initAvailableTables(dirContent);
      for (const table of dirContent) {
        // eslint-disable-next-line
        importTable(table, (t) => require(path.join(dir, t)));
      }
    } else {
      const r = require.context("./tables/", false, /\.json$/);
      initAvailableTables(r.keys());
      r.keys().forEach((key: string) => {
        importTable(key, r);
      });
    }
  }
}

export function getTableNames() {
  ensureTablesAreInitialized();
  return Object.keys(tables);
}

export function getTable(tableName: string) {
  ensureTablesAreInitialized();
  if (!(tableName in tables)) {
    throw new Error(`Unable to find table [${tableName}]`);
  }
  return tables[tableName];
}

export interface NamedOption extends Option {
  name?: string;
}
export interface TableReferenceOption extends NamedOption {
  table: string;
}

export function getNamedTableOptions(tableName: string): NamedOption[] {
  const options = getTable(tableName).options;
  return options as NamedOption[];
}

export function getTableReferenceOptions(tableName: string): TableReferenceOption[] {
  const options = getTable(tableName).options as any;
  for (const opt of options) {
    if (!("table" in opt)) {
      throw new Error(`Missing "table" property in table ${tableName} option ${opt.original}`);
    }
  }
  return options as TableReferenceOption[];
}

export function getTableWeight(tableName: string) {
  return getTable(tableName).w;
}

export function getTableOptions(tableName: string) {
  return getTable(tableName).options;
}
