export const ACCESS_TOKEN = "access_token";
export const REFRESH_TOKEN = "refresh_token";
export const ID_TOKEN = "id_token";

export const POST_LOGOUT_URI_KEY = "post_logout_uri";

// These come from api/config/rolepermission.php
export type RoleName =
  | "guest"
  | "base_user"
  | "applicant"
  | "pool_operator"
  | "request_responder"
  | "platform_admin";
