export const ACCESS_TOKEN = "access_token";
export const REFRESH_TOKEN = "refresh_token";
export const ID_TOKEN = "id_token";

export const POST_LOGOUT_URI_KEY = "post_logout_uri";

// These constants come from api/config/rolepermission.php
export const ROLE_NAME = {
  Guest: "guest",
  BaseUser: "base_user",
  Applicant: "applicant",
  PoolOperator: "pool_operator",
  RequestResponder: "request_responder",
  CommunityManager: "community_manager",
  PlatformAdmin: "platform_admin",
} as const;

type ObjectValues<T> = T[keyof T];
export type RoleName = ObjectValues<typeof ROLE_NAME>;
