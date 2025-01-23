import {
  AuthorizationQueryQuery as AuthorizationQueryType,
  AuthorizationTeamableQueryQuery as AuthorizationTeamableQueryType,
} from "@gc-digital-talent/graphql";

import { RoleName } from "../const";

type AuthorizationRoleAssignment = NonNullable<
  NonNullable<
    NonNullable<AuthorizationQueryType["myAuth"]>["roleAssignments"]
  >[number]
>;
type AuthorizationRoleAssignmentWithTeamable = NonNullable<
  NonNullable<
    NonNullable<AuthorizationTeamableQueryType["myAuth"]>["roleAssignments"]
  >[number]
>;

const isAuthorizationRoleAssignmentWithTeamable = (
  roleAssignment:
    | AuthorizationRoleAssignment
    | AuthorizationRoleAssignmentWithTeamable,
): roleAssignment is AuthorizationRoleAssignmentWithTeamable =>
  !!(roleAssignment as AuthorizationRoleAssignmentWithTeamable).teamable;

/**
 * Check to see if user contains one or more roles, can account for team and individual role types
 *
 * @param roles                   Roles to check for
 * @param userRoleAssignments     Users current role assignments
 * @param teamableId             Teamable ID
 * @returns boolean
 */
const hasRole = (
  roles: RoleName[] | null,
  userRoleAssignments: (
    | AuthorizationRoleAssignment
    | AuthorizationRoleAssignmentWithTeamable
  )[],
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
    if (
      teamableId &&
      roleAssignment.role?.isTeamBased &&
      isAuthorizationRoleAssignmentWithTeamable(roleAssignment)
    ) {
      return includes && teamableId === roleAssignment.teamable?.id;
    } else if (
      roleAssignment.role?.isTeamBased !== null &&
      roleAssignment.role?.isTeamBased !== undefined
    ) {
      return includes;
    }
    return false;
  });
  return !!result?.length;
};

export default hasRole;
