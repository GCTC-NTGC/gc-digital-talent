import { PoolTestQuery } from "@gc-digital-talent/graphql";

const poolQueryDoc = /* GraphQL */ `
  query PoolTest($id: UUID!) {
    me {
      id
      poolCandidates {
        id
        pool {
          id
        }
        submittedAt
      }
    }
    pool(id: $id) {
      id
      name {
        en
        fr
      }
      stream
      closingDate
      status
      language
      securityClearance
      classification {
        id
        group
        level
        name {
          en
          fr
        }
        minSalary
        maxSalary
        genericJobTitles {
          id
          key
          name {
            en
            fr
          }
        }
      }
      yourImpact {
        en
        fr
      }
      keyTasks {
        en
        fr
      }
      whatToExpect {
        en
        fr
      }
      specialNote {
        en
        fr
      }
      essentialSkills {
        id
        key
        name {
          en
          fr
        }
        description {
          en
          fr
        }
        category
        families {
          id
          key
          description {
            en
            fr
          }
          name {
            en
            fr
          }
        }
      }
      nonessentialSkills {
        id
        key
        name {
          en
          fr
        }
        description {
          en
          fr
        }
        category
        families {
          id
          key
          description {
            en
            fr
          }
          name {
            en
            fr
          }
        }
      }
      isRemote
      location {
        en
        fr
      }
      stream
      processNumber
      publishingGroup
      generalQuestions {
        id
        question {
          en
          fr
        }
      }
      team {
        id
        name
        contactEmail
        displayName {
          en
          fr
        }
      }
    }
  }
`;

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
      cy.graphqlRequest<PoolTestQuery>({
        query: poolQueryDoc,
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
