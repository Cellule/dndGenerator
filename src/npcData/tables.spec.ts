import {expect} from 'chai';
import 'mocha';
import tables from "./tables";

it("parses tables", () => {
  for (const tableName in tables) {
    const {w: totalWeight, options} = tables[tableName];
    let recalculatedTotalWeight = 0;
    for (const option of options) {
      const {w, v, original} = option;
      // todo: find how to check if grouping was done correctly
      recalculatedTotalWeight += w;
    }
    expect(recalculatedTotalWeight).to.equal(totalWeight);
  }
});