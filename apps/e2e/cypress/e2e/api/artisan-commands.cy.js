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
      cy.graphqlRequest({
        query: `
          query myPool($poolId:UUID!) {
            pool(id: $poolId) {
              name {
                en
              }
              keyTasks {
                en
              }
            }
          }
        `,
        variables: {
          poolId,
        },
      }).then((actual) => {
        cy.get("@poolName").then((expectedName) => {
          expect(actual.pool.name.en).to.equal(expectedName);
        });

        cy.get("@poolKeyTasks").then((expectedKeyTasks) => {
          expect(actual.pool.keyTasks.en).to.equal(expectedKeyTasks);
        });
      });
    });
  });
  it("Can create a new user using an Artisan command", () => {
    const uniqueTestId = (
      Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) + 1
    ).toString();

    cy.callEloquentFactory("User", null, `{"sub": "${uniqueTestId}"}`).then(
      (jsonObject) => {
        // fields in JSON object from Eloquent model are snake case, not pascal case
        cy.wrap(jsonObject.id).as("userId");
        cy.wrap(jsonObject.sub).as("userSub");
      },
    );

    cy.get("@userSub").then((sub) => {
      cy.loginBySubject(sub).then(() => {
        cy.graphqlRequest({
          query: `
          query myUser {
            me {
              id
              sub
            }
          }
        `,
        }).then((data) => {
          cy.get("@userId").then((expectedId) => {
            expect(data.me.id).to.equal(expectedId);
          });
          cy.get("@userSub").then((expectedSub) => {
            expect(data.me.sub).to.equal(expectedSub);
          });
        });
      });
    });
  });
});
