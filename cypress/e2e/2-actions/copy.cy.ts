describe("Actions - Copy", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  // Seems to have a permission problem with the clipboard in Cypress
  // Workaround/fix is not trivial, so skipping for now
  it.skip("copy npc to clipboard", () => {
    cy.get("[data-testid=npc-description]").then((description) => {
      const text = description.text();
      cy.get("[data-testid=copy-button]").click();
      cy.window().then((win) => {
        win.navigator.clipboard.readText().then((copiedText) => {
          expect(copiedText).to.eq(text);
        });
      });
    });
  });
});
