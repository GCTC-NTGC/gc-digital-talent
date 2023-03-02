export const ACCESS_TOKEN = "access_token";
export const REFRESH_TOKEN = "refresh_token";
export const ID_TOKEN = "id_token";

export const POST_LOGOUT_URI_KEY = "post_logout_uri";

// These come from api/config/rolepermission.php
export enum RoleName {
  Guest = "guest",
  BaseUser = "base_user",
  Applicant = "applicant",
  PoolOperator = "pool_operator",
  RequestResponder = "request_responder",
  PlatformAdmin = "platform_admin",
}
