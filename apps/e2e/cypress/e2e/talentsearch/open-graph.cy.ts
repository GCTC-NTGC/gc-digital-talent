describe("Open Graph", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should specify an image", () => {
    cy.get('head meta[property="og:image"]').then(($ogImage) => {
      cy.wrap($ogImage).should("have.attr", "content");

      cy.request({
        url: $ogImage.attr("content"),
      }).then((res) => expect(res.status).to.eq(200));
    });
  });
});
