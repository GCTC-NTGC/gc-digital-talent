import { Maybe, RoleAssignment } from "@gc-digital-talent/graphql";

import { RoleName } from "../const";

export interface RoleRequirement {
  name: RoleName;
  teamId?: Maybe<string>;
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
      const isNameMatch = assignment.role?.name === req.name;
      const isTeamBased = !!assignment.role?.isTeamBased;

      // Global role match (Role matches and it's not team-based)
      if (isNameMatch && !isTeamBased) {
        return true;
      }

      // Explicit team match (Role matches, is team-based, and ID matches)
      if (
        isNameMatch &&
        isTeamBased &&
        req.teamId &&
        assignment.team?.id === req.teamId
      ) {
        return true;
      }

      // Loose team match (Role matches, is team-based, not strict, and no specific team requested)
      if (isNameMatch && isTeamBased && !strict && !req.teamId) {
        return true;
      }
    }
  }

  // Default to false if no roles found
  return false;
};
