import { AuthorizationQueryQuery as AuthorizationQueryType } from "@gc-digital-talent/graphql";

import { RoleName } from "../const";

type AuthorizationQueryRoleAssignments = NonNullable<
  AuthorizationQueryType["myAuth"]
>["roleAssignments"];

/**
 * Check to see if user contains one or more roles, can account for team and individual role types
 *
 * @param roles                   Roles to check for
 * @param userRoleAssignments     Users current role assignments
 * @param teamableId             Teamable ID
 * @returns boolean
 */
export const hasRole = (
  roles: RoleName[] | null,
  userRoleAssignments: AuthorizationQueryRoleAssignments,
  teamableId?: string,
): boolean => {
  if (!roles || roles.length === 0) {
    return true;
  }
  const result = userRoleAssignments?.filter((roleAssignment) => {
    if (!roleAssignment?.role?.name) {
      return false;
    }
    const includes = roles.includes(roleAssignment?.role?.name as RoleName);
    if (teamableId && roleAssignment.role?.isTeamBased) {
      return includes && teamableId === roleAssignment.teamable?.id;
    } else if (roleAssignment.role?.isTeamBased === false) {
      return includes;
    }
    return false;
  });
  return !!result?.length;
};

export default hasRole;
