import type {
  AuthRole,
  AuthRoleAssignment,
  RoleName,
} from "@gc-digital-talent/auth";
import { notEmpty } from "@gc-digital-talent/helpers";

interface CommunityMemberProfile {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  workEmail?: string | null;
}

export interface CommunityMember extends CommunityMemberProfile {
  roles: AuthRole[];
}

interface CommunityRoleAssignment {
  role?: AuthRole | null;
  user?: CommunityMemberProfile | null;
}

export const groupRoleAssignmentsByUser = (
  assignments: CommunityRoleAssignment[],
) => {
  let users: CommunityMember[] = [];
  const filteredAssignments = assignments.filter((assignment) => {
    return (
      notEmpty(assignment.user) &&
      notEmpty(assignment.role) &&
      assignment.role.isTeamBased
    );
  });

  filteredAssignments.forEach((assignment) => {
    const userIndex = users.findIndex(
      (user) => user.id === assignment.user?.id,
    );
    if (userIndex >= 0 && assignment.role) {
      users[userIndex].roles = [...users[userIndex].roles, assignment.role];
    } else if (assignment.user && assignment.role) {
      users = [
        ...users,
        {
          ...assignment.user,
          roles: [assignment.role],
        },
      ];
    }
  });

  return users;
};

/**
 * Check to see if user contains one or more roles
 *
 * @param roles                   Roles to check for
 * @param userRoleAssignments     Users current role assignments
 * @param communityId             Community ID
 * @returns boolean
 */
export const checkRole = (
  roles: RoleName[] | null,
  userRoleAssignments: AuthRoleAssignment[] | null,
  communityId?: string,
): boolean => {
  if (!roles) {
    return true;
  }
  const result = userRoleAssignments?.filter((roleAssignment) => {
    if (!roleAssignment?.role?.name) {
      return false;
    }
    const includes = roles.includes(roleAssignment?.role?.name as RoleName);
    if (communityId && roleAssignment.role?.isTeamBased) {
      return includes && communityId === roleAssignment.teamable?.id;
    } else if (!roleAssignment.role?.isTeamBased) {
      return includes;
    }
    return false;
  });
  return !!result?.length;
};
