describe("Generate", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("should have exact same npc when bookmarked", () => {
    cy.get("[data-testid=npc-description]").then((description) => {
      const text = description.text();
      cy.get("[data-testid=bookmark-button]").click();
      // should have added query param "d" to location
      cy.location("search").should("contain", "d");
      cy.reload();
      cy.get("[data-testid=npc-description]").should("contain.text", text);
    });
  });
});
