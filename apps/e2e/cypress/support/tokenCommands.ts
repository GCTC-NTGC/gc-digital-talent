// visit the mock auth debugger and get a token set that immediately expire
Cypress.Commands.add(
  "getTokensFromDebugger",
  ({
    issuerId = "oxauth",
    userSubject,
  }: {
    issuerId?: string;
    userSubject: string;
  }) => {
    cy.visit(`http://localhost:8081/${issuerId}/debugger`);
    cy.findByRole("button", { name: "Get a token" }).click();
    cy.get("input[name=username]").type(userSubject);
    cy.findByRole("button", { name: "Sign-in" }).click();

    // I wish there was a nicer way to locate the code text block
    cy.findAllByRole("code").then((codeBlocks) => {
      const tokenResponseBlock = codeBlocks[1];
      const tokenResponse = JSON.parse(tokenResponseBlock.innerText);
      cy.wrap(tokenResponse);
    });
  },
);
