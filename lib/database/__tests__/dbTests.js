describe("Database", function() {
  it("should set and get value correctly", function() {
    var DB = require("../DB");
    var testDb = new DB();
    var id = 123456;
    testDb.set(id, "mock data");

    expect(testDb.get(id)).toBe("mock data");
  });
});
