import type { AuthRoleAssignment, RoleName } from "@gc-digital-talent/auth";

/**
 * Check to see if user contains one or more roles
 *
 * @param checkRoles              Roles to check for
 * @param userRoleAssignments     Users current role assignments
 * @returns boolean
 */
export const checkRole = (
  checkRoles: RoleName[] | null,
  userRoleAssignments: AuthRoleAssignment[] | null,
): boolean => {
  if (!checkRoles) {
    return true;
  }
  const visible = checkRoles.reduce((prev, curr) => {
    if (userRoleAssignments?.map((a) => a.role?.name)?.includes(curr)) {
      return true;
    }

    return prev;
  }, false);

  return visible;
};
