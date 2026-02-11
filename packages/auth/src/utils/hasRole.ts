import { unpackMaybes } from "@gc-digital-talent/helpers";
import { Maybe, RoleAssignment } from "@gc-digital-talent/graphql";

import { RoleName } from "../const";

/**
 * @deprecated Use `hasRequiredRoles` instead.
 * hasRequiredRoles provides strict validation for team-based roles.
 */
const hasRole = (
  checkRole: RoleName | RoleName[],
  userRoles: Maybe<(Maybe<RoleAssignment> | undefined)[]> | undefined,
  teamIds?: string[],
): boolean => {
  const assignments = unpackMaybes(userRoles);
  const requiredRoles = Array.isArray(checkRole) ? checkRole : [checkRole];

  return assignments.some((assignment) => {
    const roleName = assignment.role?.name as RoleName;
    const isRequired = requiredRoles.includes(roleName);

    if (!isRequired) return false;

    if (!assignment.role?.isTeamBased) return true;

    if (Array.isArray(teamIds) && teamIds.length > 0) {
      return !!assignment.team?.id && teamIds?.includes(assignment.team.id);
    }

    // We have the role but don't care about teams
    if (typeof teamIds === "undefined") {
      return true;
    }

    return false;
  });
};

// eslint-disable-next-line @typescript-eslint/no-deprecated
export default hasRole;
