import { GetPoolDocument, GetPoolQuery } from "@gc-digital-talent/graphql";

import { getGqlString } from "../../support/graphql-test-utils";

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

    cy.get<string>("@poolId").then((poolId) => {
      cy.graphqlRequest<GetPoolQuery>({
        query: getGqlString(GetPoolDocument),
        variables: {
          id: poolId,
        },
      }).then((actual) => {
        cy.get<string>("@poolName").then((expectedName) => {
          expect(actual.pool.name.en).to.equal(expectedName);
        });

        cy.get<string>("@poolKeyTasks").then((expectedKeyTasks) => {
          expect(actual.pool.keyTasks.en).to.equal(expectedKeyTasks);
        });
      });
    });
  });
});
