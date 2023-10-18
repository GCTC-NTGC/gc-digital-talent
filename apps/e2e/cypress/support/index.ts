export {};

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to log a user in using a specific role.
       * @param {string} role - The role to login with
       * @example cy.loginByRole('admin')
       */
      loginByRole(role: string): void;
      /**
       * Custom command to assert that a toast appears in the DOM.
       * @param {string} text - The text to look for in the toast
       * @example cy.loginByRole('admin')
       */
      expectToast(text: RegExp): void;
    }
  }
}
