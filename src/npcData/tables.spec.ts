import {expect} from 'chai';
import 'mocha';
import {getTableNames, getTable} from "./tables";

it("parses tables", () => {
  for (const tableName of getTableNames()) {
    const {w: totalWeight, options} = getTable(tableName);
    let recalculatedTotalWeight = 0;
    for (const option of options) {
      const {w, v, original} = option;
      // todo: find how to check if grouping was done correctly
      recalculatedTotalWeight += w;
    }
    expect(recalculatedTotalWeight).to.equal(totalWeight);
  }
});