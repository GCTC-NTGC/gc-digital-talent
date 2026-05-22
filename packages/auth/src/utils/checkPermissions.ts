import type { Maybe, Permission, RoleAssignment } from "@gc-digital-talent/graphql";

export interface PermissionRequirement {
  permission: Permission;
  teamId?: Maybe<string>;
}

/**
 * Returns true if the user's role assignments satisfy at least one of the given requirements.
 *
 * For each requirement we check whether the user holds any role that carries the permission,
 * respecting team scope when a teamId is provided.
 */
const checkPermissions = (
  requirements: PermissionRequirement | PermissionRequirement[],
  roleAssignments: Maybe<(Maybe<RoleAssignment> | undefined)[]> | undefined,
): boolean => {
  const assignments = (roleAssignments ?? []).filter(
    (a): a is RoleAssignment => !!a && !!a.role,
  );

  const reqs = Array.isArray(requirements) ? requirements : [requirements];

  for (const req of reqs) {
    for (const assignment of assignments) {
      const permissions = assignment.role?.permissions ?? [];
      if (!permissions.includes(req.permission)) continue;

      const isTeamBased = !!assignment.role?.isTeamBased;

      if (!isTeamBased) return true;
      if (req.teamId && assignment.team?.id === req.teamId) return true;
      if (!req.teamId) return true;
    }
  }

  return false;
};

export default checkPermissions;
