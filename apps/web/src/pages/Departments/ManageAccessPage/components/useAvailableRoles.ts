import { useQuery } from "urql";
import { useMemo } from "react";
import { useOutletContext } from "react-router";

import { Role, graphql } from "@gc-digital-talent/graphql";
import { notEmpty, uniqueItems } from "@gc-digital-talent/helpers";
import { ROLE_NAME, RoleName } from "@gc-digital-talent/auth";

import { checkRoleDepartments } from "~/utils/departmentUtils";

import { ContextType } from "./types";

const DepartmentMembers_AvailableRolesQuery = graphql(/* GraphQL */ `
  query AvailableDepartmentRoles {
    roles {
      id
      name
      isTeamBased
      displayName {
        en
        fr
      }
    }
  }
`);

interface useAvailableRolesArgs {
  departmentId: string;
}

interface UseAvailableRolesReturn {
  roles: Role[];
  fetching: boolean;
}

const useAvailableRoles = ({
  departmentId,
}: useAvailableRolesArgs): UseAvailableRolesReturn => {
  const [{ data, fetching }] = useQuery({
    query: DepartmentMembers_AvailableRolesQuery,
  });

  const { roleAssignmentsFiltered } = useOutletContext<ContextType>();

  const departmentRoles: RoleName[] = useMemo(() => {
    const array: RoleName[] = [];
    if (
      checkRoleDepartments([ROLE_NAME.PlatformAdmin], roleAssignmentsFiltered)
    ) {
      array.push(ROLE_NAME.DepartmentAdmin, ROLE_NAME.DepartmentHRAdvisor);
    }
    if (
      checkRoleDepartments(
        [ROLE_NAME.DepartmentAdmin],
        roleAssignmentsFiltered,
        departmentId,
      )
    ) {
      array.push(ROLE_NAME.DepartmentHRAdvisor);
    }
    return uniqueItems(array);
  }, [roleAssignmentsFiltered]);

  const roles: Role[] = useMemo(
    () =>
      data?.roles
        ? data.roles
            .filter(notEmpty)
            .filter((role) => role.isTeamBased)
            .filter((role) => departmentRoles.includes(role.name as RoleName))
        : [],
    [data?.roles, departmentRoles],
  );

  return {
    roles,
    fetching,
  };
};

export default useAvailableRoles;
