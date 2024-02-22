describe("Footer", () => {
  const testPage = "/";

  context("English page", () => {
    beforeEach(() => {
      cy.setLocale("en");
      cy.visit(testPage);
    });

    it("links to Privacy Policy", () => {
      // This is the aria role for "footer".
      cy.findByRole("navigation", { name: /policy and feedback/i }).within(
        () => {
          cy.findByRole("link", { name: /privacy Policy/i }).should(
            "have.attr",
            "href",
            "/en/privacy-policy",
          );
        },
      );
    });

    it("links to Terms & Conditions", () => {
      cy.findByRole("navigation", { name: /policy and feedback/i }).within(
        () => {
          cy.findByRole("link", { name: /terms & conditions/i }).should(
            "have.attr",
            "href",
            "/en/terms-and-conditions",
          );
        },
      );
    });

    it("links to Canada.ca", () => {
      cy.findByRole("navigation", { name: /policy and feedback/i }).within(
        () => {
          cy.findAllByRole("link", { name: /canada.ca/i }).each((item) => {
            cy.wrap(item).should(
              "have.attr",
              "href",
              "https://www.canada.ca/en.html",
            );
          });
        },
      );
    });
  });

  context("French page", () => {
    beforeEach(() => {
      cy.setLocale("fr");
      cy.visit(testPage);
    });

    it("links to Privacy Policy (french)", () => {
      cy.findByRole("navigation", { name: /Politique et rétroaction/i }).within(
        () => {
          cy.findByRole("link", { name: /avis/i }).should(
            "have.attr",
            "href",
            "/fr/terms-and-conditions",
          );
        },
      );
    });

    it("links to Terms & Conditions (french)", () => {
      cy.findByRole("navigation", { name: /politique et rétroaction/i }).within(
        () => {
          cy.findByRole("link", { name: /Énoncé de confidentialité/i }).should(
            "have.attr",
            "href",
            "/fr/privacy-policy",
          );
        },
      );
    });

    it("links to Canada.ca (french)", () => {
      cy.findByRole("contentinfo").within(() => {
        cy.findAllByRole("link", { name: /canada.ca/i })
          .eq(0)
          .should("have.attr", "href", "https://www.canada.ca/fr.html");
      });
    });
  });
});
