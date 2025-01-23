import { AuthorizationQueryQuery as AuthorizationQueryType } from "@gc-digital-talent/graphql";

import { RoleName } from "../const";

type AuthorizationRoleAssignment = NonNullable<
  NonNullable<
    NonNullable<AuthorizationQueryType["myAuth"]>["roleAssignments"]
  >[number]
>;

/**
 * Check to see if user contains one or more roles, can account for team and individual role types
 *
 * @param roles                   Roles to check for
 * @param userRoleAssignments     Users current role assignments
 * @param teamIdForRoleAssignment             Team ID
 * @returns boolean
 */
const hasRole = (
  roles: RoleName[] | null,
  userRoleAssignments: AuthorizationRoleAssignment[],
  teamIdForRoleAssignment?: string,
): boolean => {
  if (!roles || roles.length === 0) {
    return true;
  }
  const result = userRoleAssignments?.filter((roleAssignment) => {
    if (!roleAssignment?.role?.name) {
      return false;
    }
    const includes = roles.includes(roleAssignment?.role?.name as RoleName);
    if (teamIdForRoleAssignment && roleAssignment.role?.isTeamBased) {
      return (
        includes &&
        teamIdForRoleAssignment === roleAssignment.team?.teamIdForRoleAssignment
      );
    } else if (
      roleAssignment.role?.isTeamBased === false ||
      !teamIdForRoleAssignment
    ) {
      return includes;
    }
    return false;
  });
  return !!result?.length;
};

export default hasRole;
