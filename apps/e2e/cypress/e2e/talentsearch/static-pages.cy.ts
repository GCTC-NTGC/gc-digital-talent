describe("Static pages", () => {
  context("Privacy Policy page", () => {
    it("should exist", () => {
      cy.visit("/en/privacy-notice");
      cy.findByRole("heading", { name: "Privacy notice", level: 1 }).should(
        "exist",
      );
    });

    it("should have no accessibility errors", () => {
      cy.visit("/en/privacy-notice");
      cy.findByRole("heading", { name: "Privacy notice", level: 1 }).should(
        "exist",
      );
      cy.injectAxe();
      cy.checkA11y();
    });
  });

  context("Terms & Conditions page", () => {
    it("should exist", () => {
      cy.visit("/en/terms-and-conditions");
      cy.findByRole("heading", {
        name: "Terms and conditions",
        level: 1,
      }).should("exist");
    });

    it("should have no accessibility errors", () => {
      cy.visit("/en/terms-and-conditions");
      cy.findByRole("heading", {
        name: "Terms and conditions",
        level: 1,
      }).should("exist");
      cy.injectAxe();
      cy.checkA11y();
    });
  });

  context("Accessibility Statement page", () => {
    it("should exist", () => {
      cy.visit("/en/accessibility-statement");
      cy.findByRole("heading", {
        name: "Accessibility statement",
        level: 1,
      }).should("exist");
    });

    it("should have no accessibility errors", () => {
      cy.visit("/en/accessibility-statement");
      cy.injectAxe();
      cy.findByRole("heading", {
        name: "Accessibility statement",
        level: 1,
      }).should("exist");
      cy.checkA11y();
    });
  });

  context("Directive page", () => {
    it("should exist", () => {
      cy.visit("/en/directive-on-digital-talent");
      cy.findByRole("heading", {
        name: "Directive on Digital Talent",
        level: 1,
      }).should("exist");
    });

    it("should have no accessibility errors", () => {
      cy.visit("/en/directive-on-digital-talent");
      cy.injectAxe();
      cy.findByRole("heading", {
        name: "Directive on Digital Talent",
        level: 1,
      }).should("exist");
      cy.checkA11y();
    });

    it("should download files in english", () => {
      cy.visit("/en/directive-on-digital-talent");

      // Open accordion
      cy.findByRole("button", { name: /enabling conditions/i }).click();

      cy.findByRole("link", { name: /download the guidance/i }).click();
      cy.verifyDownload("Enabling_Conditions_Guidance_EN.docx", {
        contains: true,
      });

      cy.findByRole("link", {
        name: /department-specific recruitment form/i,
      }).click();
      cy.verifyDownload("Digital_Recruitment_Template_EN.docx", {
        contains: true,
      });

      cy.findByRole("link", { name: /forward talent plan form/i }).click();
      cy.verifyDownload("Forward_Talent_Plan_EN.docx", { contains: true });
    });

    it("should download files in french", () => {
      cy.visit("/fr/directive-on-digital-talent");

      // Open accordion
      cy.findByRole("button", { name: /conditions favorables/i }).click();

      cy.findAllByRole("link", {
        name: /\btélécharger le guide\b/i,
      })
        .first()
        .click();
      cy.verifyDownload("Orientation_sur_les_conditions_habilitantes_FR.docx", {
        contains: true,
      });

      cy.findByRole("link", {
        name: /le formulaire recrutement particulier à un ministère/i,
      }).click();
      cy.verifyDownload("Modele_de_recrutement_numerique_FR.docx", {
        contains: true,
      });

      cy.findByRole("link", {
        name: /le formulaire faire suivre le plan de talents/i,
      }).click();
      cy.verifyDownload("Plan_prospectif_sur_les_talents_FR.docx", {
        contains: true,
      });
    });
  });
});
