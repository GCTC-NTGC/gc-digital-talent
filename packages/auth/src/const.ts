export const ACCESS_TOKEN = "access_token";
export const REFRESH_TOKEN = "refresh_token";
export const ID_TOKEN = "id_token";

export const POST_LOGOUT_OVERRIDE_PATH_KEY = "post_logout_override_path";
export const LOGOUT_REASON_KEY = "logout_reason";
export type LogoutReason = "user-deleted" | "session-expired";

// These constants come from api/config/rolepermission.php
export const ROLE_NAME = {
  Guest: "guest",
  BaseUser: "base_user",
  Applicant: "applicant",
  ProcessOperator: "process_operator",
  CommunityRecruiter: "community_recruiter",
  CommunityAdmin: "community_admin",
  PlatformAdmin: "platform_admin",
  CommunityTalentCoordinator: "community_talent_coordinator",
} as const;

type ObjectValues<T> = T[keyof T];
export type RoleName = ObjectValues<typeof ROLE_NAME>;

export const NAV_ROLE_KEY = "nav_role";
