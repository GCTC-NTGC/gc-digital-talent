import { notEmpty } from "@gc-digital-talent/helpers";
import {
  Role,
  RoleAssignment,
  UserPublicProfile,
} from "@gc-digital-talent/graphql";

export type CommunityMember = {
  roles: Role[];
} & UserPublicProfile;

// eslint-disable-next-line import/prefer-default-export
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
