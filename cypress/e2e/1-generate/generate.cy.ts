describe("Generate", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("should show a randomly generated npc on page load", () => {
    cy.get("[data-testid=npc-description]").contains(/\d+ year old/);
  });

  it("should show a randomly generated npc when the generate button is clicked", () => {
    cy.get("[data-testid=npc-description]").then((description) => {
      const text = description.text();
      cy.get("[data-testid=generate-button]").click();
      cy.get("[data-testid=npc-description]").should("not.contain.text", text);
    });
  });

  context("User Input", () => {
    // TODO: Add tests for user input (race, sex, alignment, plot hook, occupation)
  });
});
