import type { AuthRoleAssignment } from "../types";
import { hasRequiredRoles, type RoleRequirement } from "./hasRequiredRoles";

// short-circuit hasRole if no roles were required so an empty array
export const hasRolesHandleNoRolesRequired = (
  checkRole: RoleRequirement | RoleRequirement[],
  userRoles: (AuthRoleAssignment | null | undefined)[] | null | undefined,
): boolean => {
  if (Array.isArray(checkRole) && checkRole.length === 0) {
    return true;
  }
  return hasRequiredRoles({
    toCheck: checkRole,
    userRoles: userRoles,
  });
};
