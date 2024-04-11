import { Role } from "@gc-digital-talent/graphql";
import { Cookie, Page } from "@playwright/test";
import { graphqlRequest } from "./graphql";

/**
 * Login by sub
 *
 * Logs a user into the application
 * through the UI.
 *
 * @param {Page} page
 * @param {String} sub
 */
export async function loginBySub(page: Page, sub: string) {
  await page.goto("/login-info");
  await page
    .getByRole("link", { name: /continue to gckey and sign in/i })
    .first()
    .click();
  await page.getByPlaceholder("Enter any user/subject").fill(sub);
  await page.getByRole("button", { name: /sign-in/i }).click();
  await page.waitForURL("**/applicant/profile-and-applications");
}

/**
 * Login by gckey sign in using username and password
 *
 * Logs a user into the application
 *
 *  @param {Page} page
 * @param {String} username
 * @param {String} password
 * @param {String} sub  // optional
 *
 */
export async function loginByGCKeySignIn(
  page: Page, // page object
  username: string,
  password: string,
  sub?: string,
) {
  await page.goto("/login-info");
  await page
    .getByRole("link", { name: /continue to gckey and sign in/i })
    .first()
    .click();
  await page.getByPlaceholder("Username").fill(username);
  await page.getByPlaceholder("Password").fill(password);
  await page
    .getByRole("button", { name: /Connect to the GCKey Service/i })
    .click();
  await page.waitForURL("**/applicant/profile-and-applications");
}



/**
 * Attempt to login by sub and fallback to loginByGckeySignIn if it fails
 *
 * @param {Page} page
 * @param {String} sub
 * @param {String} username
 * @param {String} password
 */
export async function login(
  page: Page,
  sub: string,
  username: string,
  password: string,
) {
  // check process.env.baseURL to determine if it is a local or remote environment
  // if it is a local environment, use loginBySub
  // if it is a remote environment, use loginByGckeySignIn
  if (process.env.baseURL === "http://localhost:8000") {
    await loginBySub(page, sub);
  } else {
    await loginByGCKeySignIn(page, username, password, sub);
  }

}

export type AuthCookies = {
  apiSession?: Cookie;
  xsrf?: Cookie;
};

/**
 * Get Auth Cookies
 *
 * Attempt to get the auth cookies
 * from the current page context.
 *
 * @param page
 * @returns {Promise<AuthCookies>}
 */
export async function getAuthCookies(page: Page): Promise<AuthCookies> {
  const cookies = await page.context().cookies();

  const apiSession = cookies.find((cookie) => cookie.name === "api_session");
  const xsrf = cookies.find((cookie) => cookie.name === "XSRF-TOKEN");

  return {
    apiSession,
    xsrf,
  };
}

export type AuthTokens = {
  idToken?: string;
  accessToken?: string;
  refreshToken?: string;
};

/**
 * Get Auth Tokens
 *
 * Attempt to get the auth tokens from the
 * current page context local storage.
 *
 * @param page
 * @returns {Promise<AuthTokens>}
 */
export async function getAuthTokens(page: Page): Promise<AuthTokens> {
  const tokens = await page.evaluate(() => ({
    idToken: localStorage.getItem("id_token"),
    accessToken: localStorage.getItem("access_token"),
    refreshToken: localStorage.getItem("refresh_token"),
  }));

  return tokens;
}

export const Test_RolesQueryDocument = /* GraphQL */ `
  query Test_Roles {
    roles {
      id
      name
    }
  }
`;

/**
 * Get Roles
 *
 * Get all the roles directly from
 * the API.
 */
export async function getRoles(): Promise<Role[]> {
  const res = await graphqlRequest(Test_RolesQueryDocument);

  return res.roles;
}

export const Test_UpdateUserRolesMutationDocument = /* GraphQL */ `
  mutation Test_UpdateUserRoles($updateUserRolesInput: UpdateUserRolesInput!) {
    updateUserRoles(updateUserRolesInput: $updateUserRolesInput) {
      id
      roleAssignments {
        id
        role {
          id
          name
          isTeamBased
          displayName {
            en
            fr
          }
        }
        team {
          id
          name
          displayName {
            en
            fr
          }
        }
      }
    }
  }
`;
