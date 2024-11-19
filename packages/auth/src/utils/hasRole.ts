import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import { Maybe, RoleAssignment } from "@gc-digital-talent/graphql";

import { RoleName } from "../const";

type RoleAssignmentNarrowed = Pick<RoleAssignment, "role">;

const hasRole = (
  checkRole: RoleName | RoleName[],
  userRoles: Maybe<(Maybe<RoleAssignmentNarrowed> | undefined)[]> | undefined,
): boolean => {
  const userRoleNames = unpackMaybes(userRoles)
    .map((roleAssign) => roleAssign.role?.name)
    .filter(notEmpty);

  if (Array.isArray(checkRole)) {
    if (checkRole.length === 0) {
      return true;
    }
    return checkRole.some((roleName) => userRoleNames.includes(roleName));
  } else {
    return userRoleNames.includes(checkRole);
  }
};

export default hasRole;
