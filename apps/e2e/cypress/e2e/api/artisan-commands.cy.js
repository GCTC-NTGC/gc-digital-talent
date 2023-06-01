describe("Artisan command tests", () => {
  it("Can create a new custom pool using an Artisan command", () => {
    const uniqueTestId = (
      Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) + 1
    ).toString();

    cy.callEloquentFactory(
      "Pool",
      "published",
      `{"name": {"en": "${uniqueTestId} EN", "fr": "${uniqueTestId} FR"}}`,
    ).then((jsonObject) => {
      // fields in JSON object from Eloquent model are snake case, not pascal case
      cy.wrap(jsonObject.id).as("poolId");
      cy.wrap(jsonObject.name.en).as("poolName");
      cy.wrap(jsonObject.key_tasks.en).as("poolKeyTasks");
    });

    cy.get("@poolId").then((poolId) => {
      cy.visit(`/en/browse/pools/${poolId}`);
    });

    cy.get("@poolName").then((poolName) => {
      cy.findByRole("heading", {
        name: new RegExp(`^${poolName}`),
        level: 1,
      }).should("exist");
    });

    cy.get("@poolKeyTasks").then((poolKeyTasks) => {
      cy.findByText(poolKeyTasks);
    });
  });
});
