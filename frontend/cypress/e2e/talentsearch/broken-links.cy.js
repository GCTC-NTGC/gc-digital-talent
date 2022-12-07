describe("Broken links", () => {

  /**
   * Make a request to a url and
   * check that the status code is 200
   *
   * @param {string} url
   */
  const checkLink = (url) => {
    cy.request({
      url,
      failOnStatusCode: false
    })
      .its('status', { timeout: 0 })
      .should('eq', 200)
  }

  beforeEach(() => {
    cy.loginByRole('applicant').then(() => {
      cy.getMe().its("id").then(userId => {
        cy.wrap(userId).as("userId");
      });
    })
  })

  it("has no broken links", () => {
    // Hold visited URLS in an array to prevent double checks
    let visited = [];

    cy.fixture("urls/public.json").then(urls => {
      urls.forEach(originalUrl => {
        cy.get("@userId").then(userId => {
          // Add current user ID to paths
          let url = originalUrl.replace("{userId}", userId);

          if (!visited.includes(url)) {
            checkLink(url);

            cy.visit(url).then(() => {
              visited.push(url);
              // Wait for all requests to be idle for 3s
              cy.waitForNetworkIdle('*', '*', 3000)

              cy.get("a:not([href*='mailto:]']").each(link => {
                const href = link.prop('href');
                const isValid = href.startsWith("http") && !href.includes("#");
                if (isValid && !visited.includes(href)) {
                  checkLink(href);
                  visited.push(href);
                }
              })
            })
          }
        });
      });
    });
  });
});
