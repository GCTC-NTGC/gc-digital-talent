import { notEmpty } from "@gc-digital-talent/helpers";
import { Maybe, RoleAssignment } from "@gc-digital-talent/graphql";

import { RoleName } from "../const";

const hasRole = (
  checkRole: RoleName | RoleName[],
  userRoles: Maybe<Array<Maybe<RoleAssignment> | undefined>> | undefined,
): boolean => {
  if (Array.isArray(checkRole)) {
    const userRolesName = userRoles
      ?.filter(notEmpty)
      .map((roleAssign) => roleAssign.role?.name);

    if (userRolesName) {
      return !!userRolesName
        .filter(notEmpty)
        .some((roleName) => checkRole.includes(roleName as RoleName));
    }
    return false;
  }

  return !!userRoles
    ?.filter(notEmpty)
    .some((roleAssignment) => roleAssignment.role?.name === checkRole);
};

export default hasRole;
