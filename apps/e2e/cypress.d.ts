import {
  Classification,
  CreatePoolCandidateSearchRequestInput,
  CreateTeamInput,
  CreateUserInput,
  Department,
  GenericJobTitle,
  Pool,
  PoolCandidate,
  PoolCandidateSearchRequest,
  Role,
  Skill,
  Team,
  UpdateApplicationInput,
  UpdatePoolCandidateAsAdminInput,
  UpdatePoolCandidateSearchRequestInput,
  UpdatePoolInput,
  UpdateUserAsAdminInput,
  UpdateUserRolesInput,
  User,
} from "@gc-digital-talent/web/src/api/generated";

export {};

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * ======================================
       * Utility Commands
       * ======================================
       */

      /**
       * Custom command to run a specific eloquent factory
       * @param {string} modelName - Name of the model for the factory
       * @param {string} state - Any state to be applied to the factory
       * @param {string} attributes - Specific attributes to be overridden (JSON)
       * @example cy.callEloquentFactory('Pool', 'published', '{"name": { "en": "Test (EN)", "fr": "Test (FR)" }}')
       */
      callEloquentFactory(
        modelName: string,
        state: string,
        attributes: string,
      ): Promise<any>;
      /**
       * Custom command to set the current locale.
       * @param {string} locale - The new locale to set
       * @example cy.setLocale('fr')
       */
      setLocale(locale: string): void;
      /**
       * Custom command to make a graphql request directly.
       * @param {Object} body - Body of the GraphQL request
       * @example cy.logout()
       */
      graphqlRequest<T extends Object>(body: Object): Promise<T>;
      /**
       * Override specific feature flags.
       * Note: Should be used in `before*`
       * @param {Object} flags - Feature flags you want to override.
       * @example cy.overrideFeatureFlags({FEATURE_FLAG: false})
       */
      overrideFeatureFlags(flags: Object): void;

      /**
       * ======================================
       * Pool Commands
       * ======================================
       */

      /**
       * Custom command to create an pool.
       * @param {string} userId - ID of the user owning the application
       * @param {string} teamId - ID of the team to assign to the pool
       * @param {array<string>} classificationIds - Array of the classification Ids to assign to the pool
       * @example cy.createPool('userUUID', 'teamUUID', ['classificationId])
       */
      createPool(
        userId: string,
        teamId: string,
        classificationIds: string[],
      ): Chainable<Pool>;
      /**
       * Custom command to update an existing pool.
       * @param {string} id - ID of the pool to be updated
       * @param {Pool} pool - Object representation of the new pool data
       * @example cy.updatePool('poolUUID', {})
       */
      updatePool(id: string, pool: UpdatePoolInput): Chainable<Pool>;
      /**
       * Custom command to publish an existing pool.
       * @param {string} id - ID of the pool to be published
       * @example cy.publishPool('poolUUID')
       */
      publishPool(id: string): Chainable<Pool>;

      /**
       * ======================================
       * Pool Candidate Commands
       * ======================================
       */

      /**
       * Custom command to create an application.
       * @param {string} userId - ID of the user owning the application
       * @param {string} poolId - ID of the pool the user is applying to
       * @example cy.createApplication('userUUID', 'poolUUID')
       */
      createApplication(
        userId: string,
        poolId: string,
      ): Chainable<PoolCandidate>;
      /**
       * Custom command to submit an existing application.
       * @param {string} applicationId - ID of the application being submitted
       * @param {UpdatePoolCandidateAsAdminInput} application - New application data
       * @example cy.updateApplication('applicationUUID', {...})
       */
      updateApplication(
        applicationId: string,
        application: UpdateApplicationInput,
      ): Chainable<PoolCandidate>;
      /**
       * Custom command to update an existing application.
       * @param {string} applicationId - ID of the application being submitted
       * @param {string} signature - Signature of the user submitting
       * @example cy.submitApplication('applicationUUID', 'John Doe')
       */
      submitApplication(
        applicationId: string,
        signature: string,
      ): Chainable<PoolCandidate>;
      /**
       * Custom command to update an existing application as a user with the admin role.
       * @param {string} applicationId - ID of the application being submitted
       * @param {UpdatePoolCandidateAsAdminInput} input - Input for the graphql request
       * @example cy.updatePoolCandidateAsAdmin('applicationUUID', 'John Doe')
       */
      updatePoolCandidateAsAdmin(
        applicationId: string,
        input: UpdatePoolCandidateAsAdminInput,
      ): Chainable<PoolCandidate>;

      /**
       * ======================================
       * Search Request Commands
       * ======================================
       */

      /**
       * Custom command to create a search request.
       * @param {CreatePoolCandidateSearchRequestInput} input - Search request object
       * @example cy.createPoolCandidateSearchRequest({})
       */
      createPoolCandidateSearchRequest(
        input: CreatePoolCandidateSearchRequestInput,
      ): Chainable<PoolCandidateSearchRequest>;
      /**
       * Custom command to update an search request.
       * @param {string} id - ID of the search request to be updated
       * @param {UpdatePoolCandidateSearchRequestInput} input - Search request object
       * @example cy.updatePoolCandidateSearchRequest('searchRequestID', {})
       */
      updatePoolCandidateSearchRequest(
        id: string,
        input: UpdatePoolCandidateSearchRequestInput,
      ): Chainable<PoolCandidateSearchRequest>;

      /**
       * ======================================
       * Auth Commands
       * ======================================
       */

      /**
       * Custom command to log the current user out.
       * @example cy.logout()
       */
      logout(): Promise<void>;
      /**
       * Custom command to log a user in using a specific role.
       * @param {string} role - The role to login with
       * @example cy.loginByRole('admin')
       */
      loginByRole(role: string): Promise<void>;
      /**
       * Custom command to log a user in using a specific sub.
       * @param {string} sub - The sub to login with
       * @example cy.loginBySubject('sub')
       */
      loginBySubject(sub: string): Promise<void>;

      /**
       * ======================================
       * User Commands
       * ======================================
       */

      /**
       * Custom command to create a user on the server.
       * @param {CreateUserInput} user - Object representation of the user to be created
       * @example cy.createUser({ firstName: 'John', lastName: 'Doe', ... })
       */
      createUser(user: Partial<CreateUserInput>): Chainable<User>;
      /**
       * Custom command to update a specific user.
       * @param {string} id - ID for the user you are updating
       * @param {UpdateUserAsAdminInput} user - Object representation of the user to be created
       * @example cy.createUser('UUID', { firstName: 'John', lastName: 'Doe', ... })
       */
      updateUser(id: string, user: UpdateUserAsAdminInput): Chainable<User>;
      /**
       * Update a specific user's roles.
       * @param {UpdateUserRolesInput} updateUserRolesInput - Object containing role assignments and userId
       * @example cy.updateUserRoles({ userId, roleAssignmentsInput })
       */
      updateUserRoles(
        updateUserRolesInput: UpdateUserRolesInput,
      ): Chainable<User>;
      /**
       * Custom command to get the current user.
       * @example cy.getMe().then(user => {})
       */
      getMe(): Chainable<User>;
      /**
       * Custom command to get all roles.
       * @example cy.getRoles().then(roles => {})
       */
      getRoles(): Chainable<Role[]>;

      /**
       * ======================================
       * Team Commands
       * ======================================
       */
      /**
       * Custom command to get the DCM team.
       * @example cy.getDCM().then(team => {})
       */
      getDCM(): Chainable<string>;
      /**
       * Custom command to get all teams.
       * @example cy.getTeams().then(teams => {})
       */
      getTeams(): Chainable<Team[]>;
      /**
       * Custom command to create a new team.
       * @example cy.createTeam({}).then(team => {})
       */
      createTeam(team: CreateTeamInput): Chainable<Team>;

      /**
       * ======================================
       * Token Commands
       * ======================================
       */
      /**
       * Custom command to get a token set from the auth debugger
       * @example  cy.getTokensFromDebugger({issuerId: "oxauth", userSubject: testUserSubject}).as("tokenSet");
       */
      getTokensFromDebugger(opts: {
        issuerId?: string;
        userSubject: string;
      }): Chainable<Record<string, string>;

      /**
       * ======================================
       * Generic Getter Commands
       * ======================================
       */

      /**
       * Custom command to get all classifications.
       * @example cy.getClassifications().then(classifications => {})
       */
      getClassifications(): Chainable<Classification[]>;
      /**
       * Custom command to get all departments.
       * @example cy.getDepartments().then(departments => {})
       */
      getDepartments(): Chainable<Department[]>;
      /**
       * Custom command to get all generic job titles.
       * @example cy.getGenericJobTitles().then(genericJobTitles => {})
       */
      getGenericJobTitles(): Chainable<GenericJobTitle[]>;
      /**
       * Custom command to get all generic job titles.
       * @example cy.getSkills().then(skills => {})
       */
      getSkills(): Chainable<Skill[]>;

      /**
       * ======================================
       * Assertion Commands
       * ======================================
       */
      /**
       * Custom command to assert that a toast appears in the DOM.
       * @param {RegExp} text - The text to look for in the toast
       * @example cy.expectToast(/toast test/i)
       */
      expectToast(text: RegExp): void;
    }
  }
}
