import { RoleName } from "@gc-digital-talent/auth";
import { notEmpty } from "@gc-digital-talent/helpers";
import {
  Maybe,
  Role,
  RoleAssignment,
  UserPublicProfile,
} from "@gc-digital-talent/graphql";

type TeamMember = {
  roles: Role[];
} & UserPublicProfile;

// eslint-disable-next-line import/prefer-default-export
export const groupRoleAssignmentsByUser = (assignments: RoleAssignment[]) => {
  let users: TeamMember[] = [];
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
 * @param checkRoles              Roles to check for
 * @param userRoleAssignments     Users current role assignments
 * @returns boolean
 */
export const checkRole = (
  checkRoles: RoleName[] | null,
  userRoleAssignments: Maybe<RoleAssignment[]>,
): boolean => {
  if (!checkRoles) {
    return true;
  }
  const visible = checkRoles.reduce((prev, curr) => {
    if (userRoleAssignments?.map((a) => a.role?.name)?.includes(curr)) {
      return true;
    }

    return prev;
  }, false);

  return visible;
};
