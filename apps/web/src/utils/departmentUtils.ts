import type {
  AuthRole,
  AuthRoleAssignment,
  RoleName,
} from "@gc-digital-talent/auth";
import { notEmpty } from "@gc-digital-talent/helpers";

interface DepartmentMemberProfile {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  workEmail?: string | null;
}

export interface DepartmentMember extends DepartmentMemberProfile {
  roles: AuthRole[];
}

interface DepartmentRoleAssignment {
  role?: AuthRole | null;
  user?: DepartmentMemberProfile | null;
}

export const groupRoleAssignmentsByUserDepartments = (
  assignments: DepartmentRoleAssignment[],
) => {
  let users: DepartmentMember[] = [];
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
 * @param departmentId            Department ID
 * @returns boolean
 */
export const checkRoleDepartments = (
  roles: RoleName[] | null,
  userRoleAssignments: AuthRoleAssignment[] | null,
  departmentId?: string,
): boolean => {
  if (!roles) {
    return true;
  }
  const result = userRoleAssignments?.filter((roleAssignment) => {
    if (!roleAssignment?.role?.name) {
      return false;
    }
    const includes = roles.includes(roleAssignment?.role?.name as RoleName);
    if (departmentId && roleAssignment.role?.isTeamBased) {
      return includes && departmentId === roleAssignment.teamable?.id;
    } else if (!roleAssignment.role?.isTeamBased) {
      return includes;
    }
    return false;
  });
  return !!result?.length;
};
