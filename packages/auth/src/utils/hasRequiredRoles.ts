import { Maybe, RoleAssignment } from "@gc-digital-talent/graphql";

import { RoleName } from "../const";

export interface RoleRequirement {
  name: RoleName;
  teamId?: string;
}

interface HasRequiredRolesArgs {
  toCheck: RoleRequirement | RoleRequirement[];
  userRoles: Maybe<(Maybe<RoleAssignment> | undefined)[]> | undefined;
  /** * When true, if a role is team-based, a matching teamId MUST be provided
   * in the requirement or the check fails.
   */
  strict?: boolean;
}

export const hasRequiredRoles = ({
  toCheck,
  userRoles,
  strict = false, // Default to loose for backward compatibility/flexibility
}: HasRequiredRolesArgs): boolean => {
  const assignments = (userRoles ?? []).filter(
    (a): a is RoleAssignment => !!a && !!a.role,
  );

  const requirements = Array.isArray(toCheck) ? toCheck : [toCheck];

  for (const req of requirements) {
    for (const assignment of assignments) {
      // Gate 1: Match role name
      if (assignment.role?.name !== req.name) continue;

      // Gate 2: Strict check for team-based roles
      if (strict && assignment.role?.isTeamBased && !req.teamId) continue;

      // Gate 3: Team ID mismatch
      if (req.teamId && assignment.team?.id !== req.teamId) continue;

      return true;
    }
  }

  // Default to false if no roles found
  return false;
};
