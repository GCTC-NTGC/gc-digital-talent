import { RoleName } from "@gc-digital-talent/auth";
import { notEmpty } from "@gc-digital-talent/helpers";
import {
  Maybe,
  Role,
  RoleAssignment,
  UserPublicProfile,
} from "@gc-digital-talent/graphql";

export type CommunityMember = {
  roles: Role[];
} & UserPublicProfile;

export const groupRoleAssignmentsByUser = (assignments: RoleAssignment[]) => {
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
  userRoleAssignments: Maybe<RoleAssignment[]>,
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
