import type { Maybe, Permission, RoleAssignment, RolePermission } from "@gc-digital-talent/graphql";

import { RoleName } from "@gc-digital-talent/graphql";

export interface PermissionRequirement {
  permission: Permission;
  teamId?: Maybe<string>;
}

/**
 * Returns true if the user's role assignments satisfy at least one of the given requirements.
 *
 * For each requirement we find all roles that carry the permission, then check whether
 * the user holds any of those roles — respecting team scope when a teamId is provided.
 */
const checkPermissions = (
  requirements: PermissionRequirement | PermissionRequirement[],
  roleAssignments: Maybe<(Maybe<RoleAssignment> | undefined)[]> | undefined,
  rolePermissionMap: RolePermission[],
): boolean => {
  const assignments = (roleAssignments ?? []).filter(
    (a): a is RoleAssignment => !!a && !!a.role,
  );

  const reqs = Array.isArray(requirements) ? requirements : [requirements];

  for (const req of reqs) {
    const rolesWithPermission = rolePermissionMap
      .filter((rp) => rp.permissions.includes(req.permission))
      .map((rp) => rp.role);

    for (const assignment of assignments) {
      const roleEnum = snakeToPascalRoleName(assignment.role?.name);
      if (!roleEnum || !rolesWithPermission.includes(roleEnum)) continue;

      const isTeamBased = !!assignment.role?.isTeamBased;

      if (!isTeamBased) return true;
      if (req.teamId && assignment.team?.id === req.teamId) return true;
      if (!req.teamId) return true;
    }
  }

  return false;
};

function snakeToPascalRoleName(
  snakeCase: string | null | undefined,
): RoleName | undefined {
  if (!snakeCase) return undefined;
  const pascal = snakeCase
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
  return Object.values(RoleName).find((v) => v === pascal);
}

export default checkPermissions;
