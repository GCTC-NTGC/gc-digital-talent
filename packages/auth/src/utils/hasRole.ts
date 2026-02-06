import { unpackMaybes } from "@gc-digital-talent/helpers";
import { Maybe, RoleAssignment } from "@gc-digital-talent/graphql";

import { RoleName } from "../const";

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

    if (teamIds && teamIds?.length > 0) {
      return !!assignment.team?.id && teamIds?.includes(assignment.team.id);
    }

    return false;
  });
};

export default hasRole;
