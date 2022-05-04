import getRuntimeVariable from "@common/helpers/runtimeVariable";

export const ADMIN_APP_DIR = process.env.ADMIN_APP_DIR ?? "/admin";

export const LOGOUT_URI = getRuntimeVariable("OAUTH_LOGOUT_URI");

export const POST_LOGOUT_REDIRECT =
  getRuntimeVariable("OAUTH_POST_LOGOUT_REDIRECT") ?? "/admin";
