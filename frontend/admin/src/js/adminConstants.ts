export const ADMIN_APP_DIR = process.env.ADMIN_APP_DIR ?? "/admin";

// eslint-disable-next-line no-underscore-dangle
const serverConfig = (window as any).__SERVER_CONFIG__;
export const LOGOUT_URI = serverConfig?.OAUTH_LOGOUT_URI ?? "/logout";
export const POST_LOGOUT_REDIRECT =
  serverConfig?.OAUTH_POST_LOGOUT_REDIRECT ?? "/admin";
