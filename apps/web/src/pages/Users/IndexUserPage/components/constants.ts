import { ROLE_NAME } from "@gc-digital-talent/auth";

const ROLES_TO_HIDE_USERS_TABLE: string[] = [
  ROLE_NAME.Guest,
  ROLE_NAME.BaseUser,
  ROLE_NAME.Applicant,
];

export default ROLES_TO_HIDE_USERS_TABLE;
