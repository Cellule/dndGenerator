import { Option, WeightedValue } from "./index";
import { getGroups } from "./utils";
import path from "path";

interface TableEntry {
  w: number,
  options: Option[]
}

interface Tables {
  [name: string]: TableEntry
}
const tables = {} as Tables;

function importAll(r: any) {
  r.keys().forEach((key: string) => {
    const name = path.basename(key, ".json");
    const table: WeightedValue[] = r(key);
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
  });
}

importAll((require as any).context('./tables/', false, /\.json$/));

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