var npcGenerator = require("./../npcGenerator");
var utils = require("./../utils");
var _ = require("lodash");

describe("Npc Generator", function() {
  it("should read table files", function(done) {
    npcGenerator.readTables(utils.tablesPath, (err, data) => {
      expect(err).toBeFalsy();
      expect(data).toBeDefined();
      expect(data.tables).toBeDefined();
      expect(_.keys(data.tables).length).toBeGreaterThan(0);
      done();
    });
  });

  it("should manipulate variables accordingly", function() {
    var npc = npcGenerator.generate({
      options: {
        initialisation: "{%v1=5}{$s1=Lorem}{t1}{t2}"
      },
      output: {
        f1: "{%v1}",
        f2: "{$s1}",
        f3: "{%v1}{%v1}"
      }
    }, {
      tables: {
        t1: {
          w: 1,
          options: [
            {w: 1, v: utils.getGroups("{%v1+1}")}
          ]
        },
        t2: {
          w: 1,
          options: [
            {w: 1, v: utils.getGroups("{$s1+ Ipsum}")}
          ]
        }
      }
    });
    expect(npc.f1).toBe(6);
    expect(npc.f2).toBe("Lorem Ipsum");
    expect(npc.f3).toBe("66");
  });
});
