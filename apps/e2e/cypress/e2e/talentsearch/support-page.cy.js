describe("Support page", () => {
  const name = "Test Person";
  const email = "test@test.tld";
  const details = "Test comments to send.";
  const subject = "question";

  context("Support page", () => {
    it("should exist", () => {
      cy.visit("/en/support");
      cy.findByRole("heading", {
        name: "Contact and support",
        level: 1,
      }).should("exist");
    });
  });

  context("Support form", () => {
    it("should send POST request to existing api endpoint", () => {
      cy.request({
        method: "POST",
        url: "/api/support/tickets",
        failOnStatusCode: false,
        body: {
          name,
          email,
          details,
          subject,
        },
      }).then((response) => {
        // Note: normal to get a 500 status if the service (freshdesk) is not locally configured.
        if (response.status === 404)
          // verify if route exists.
          throw new Error("404: Not Found");
      });
    });
  });
});
