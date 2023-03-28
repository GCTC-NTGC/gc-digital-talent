import { RoleAssignment } from "@gc-digital-talent/graphql";
import { RoleName } from "../const";

const hasRole = (
  checkRole: RoleName,
  userRoles: Array<RoleAssignment>,
): boolean => {
  return !!userRoles.some(
    (roleAssignment) => roleAssignment.role?.name === checkRole,
  );
};

export default hasRole;
