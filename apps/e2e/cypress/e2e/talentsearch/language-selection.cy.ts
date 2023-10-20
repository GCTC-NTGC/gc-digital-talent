describe("Language selection", () => {
  const visitLang = (lang) => {
    cy.setLocale(lang);
    cy.visit("/search");
  };

  it("has French link", () => {
    visitLang("en");
    cy.get("header").within(() => {
      cy.findByRole("link", { name: /français/i }).should("exist");
    });
  });

  it("should change from French to English", () => {
    visitLang("fr");

    cy.get("html").should("have.attr", "lang", "fr");

    cy.get("header").within(() => {
      cy.findByRole("link", { name: /english/i })
        .should("exist")
        .click();
    });

    cy.get("html").should("have.attr", "lang", "en");
  });

  it("has English link", () => {
    visitLang("fr");
    cy.get("header").within(() => {
      cy.findByRole("link", { name: /english/i }).should("exist");
    });
  });

  it("should change from English to French", () => {
    visitLang("en");

    cy.get("html").should("have.attr", "lang", "en");

    cy.get("header").within(() => {
      cy.findByRole("link", { name: /français/i })
        .should("exist")
        .click();
    });

    cy.get("html").should("have.attr", "lang", "fr");
  });
});
