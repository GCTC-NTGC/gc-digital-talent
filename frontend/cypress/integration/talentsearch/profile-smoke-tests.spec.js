import { aliasMutation, aliasQuery, setUpCommonGraphqlIntercepts } from '../../support/graphql-test-utils'
import { getInputByLabel } from '../../support/helpers';

describe("User Profile Smoke Tests", () => {

  const loginViaUI = (role) => {
    cy.fixture('users.json').then(users => {
      const user = users[role]
      cy.get('input[name=username]').type(user.email)
    })
    cy.findByText('Sign-in').click()
  }

  beforeEach(() => {
    // common requests
    setUpCommonGraphqlIntercepts()
    // page specific requests
    cy.intercept('POST', '/graphql', (req) => {
        aliasMutation(req, 'UpdateUserAsUser');
        aliasMutation(req, 'createWorkLocationPreference');
    })

    cy.visit("/en/talent/profile")
  });

  it("Reviews a user profile and makes some edits", () => {

    // hit the home page, login, hit the dashboard
    loginViaUI("applicant");
    cy.wait("@gqlgetMeQuery");
    cy.contains("span", "My Status");
    cy.url().should('contain', '/profile');

    // about me
    cy.contains("a", "Edit About Me").click();
    getInputByLabel('Current city').clear().type('Test City');
    cy.contains('Save and go back').click();
    cy.wait('@gqlUpdateUserAsUserMutation');
    cy.contains("User updated successfully");
    cy.url().should('contain', '/profile');

    // work location
    cy.contains("a", "Edit Work Location").click();
    getInputByLabel('Location exemptions').clear().type('Test Locations');
    cy.contains('Save and go back').click();
    cy.wait('@gqlcreateWorkLocationPreferenceMutation');
    cy.contains("User updated successfully");
    cy.url().should('contain', '/profile');

    // // find the applicant user to play with


    //
    // cy.contains("a", "applicant@test.com").click();

    // // exercise profile page
    // cy.contains("h1", "Candidate Details");
    // cy.contains("button", "Print Profile");
    // cy.contains('General Information').click();
    // cy.contains("span", "About");
    // cy.contains('Candidate Profile').click();
    // cy.contains("span", "About");

    // // find the applicant user to play with
    // cy.contains("a", "Users").click();
    // //cy.wait("@gqlAllUsersQuery");  // will be cached and not fired a second time
    // getInputByLabel('Search').clear().type('Applicant');
    // cy.contains('td', 'applicant@test.com')
    //   .siblings()
    //   .contains('a', 'Edit')
    //   .click();
    // cy.wait("@gqlUserQuery");

    // // edit the user in a small way
    // getInputByLabel('Telephone').clear().type('+10123456789');
    // cy.contains("button", "Submit").click();
    // cy.wait("@gqlUpdateUserAsAdminMutation");
    // cy.contains("User updated successfully");
  });
});
