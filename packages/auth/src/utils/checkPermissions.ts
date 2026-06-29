import type { Permission, RoleAssignment } from "@gc-digital-talent/graphql";

export interface PermissionRequirement {
  permission: Permission;
  teamId?: string | null | undefined;
}

/**
 * Returns true if the user's role assignments satisfy at least one of the given requirements.
 *
 * For each requirement we check whether the user holds any role that carries the permission,
 * respecting team scope when a teamId is provided.
 */
const checkPermissions = (
  requirements: PermissionRequirement | PermissionRequirement[],
  roleAssignments: (RoleAssignment | null | undefined)[] | null | undefined,
): boolean => {
  const assignments = (roleAssignments ?? []).filter(
    (a): a is RoleAssignment => !!a && !!a.role,
  );

  const reqs = Array.isArray(requirements) ? requirements : [requirements];

  for (const req of reqs) {
    for (const assignment of assignments) {
      const permissions = assignment.role?.permissions ?? [];
      const isTeamBased = !!assignment.role?.isTeamBased;
      const hasPermission = permissions.includes(req.permission);

      if (isTeamBased) {
        const teamScopeMatches =
          !req.teamId || assignment.team?.id === req.teamId;
        if (hasPermission && teamScopeMatches) return true;
      }

      // non-team check
      if (!isTeamBased && hasPermission) return true;
    }
  }

  return false;
};

export default checkPermissions;
