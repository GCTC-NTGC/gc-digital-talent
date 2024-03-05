import { notEmpty } from "@gc-digital-talent/helpers";
import { Maybe, RoleAssignment } from "@gc-digital-talent/graphql";

import { RoleName } from "../const";

const hasRole = (
  checkRole: RoleName,
  userRoles: Maybe<Array<Maybe<RoleAssignment> | undefined>> | undefined,
): boolean => {
  return !!userRoles
    ?.filter(notEmpty)
    .some((roleAssignment) => roleAssignment.role?.name === checkRole);
};

export default hasRole;
