import { useQuery } from "urql";
import { useMemo } from "react";

import { Role, graphql } from "@gc-digital-talent/graphql";
import {
  notEmpty,
  uniqueItems,
  unpackMaybes,
} from "@gc-digital-talent/helpers";
import { ROLE_NAME, useAuthorization, RoleName } from "@gc-digital-talent/auth";

import { checkRoleDepartments } from "~/utils/departmentUtils";

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

  const { userAuthInfo } = useAuthorization();
  const roleAssignments = unpackMaybes(userAuthInfo?.roleAssignments);
  const departmentRoles: RoleName[] = useMemo(() => {
    const array: RoleName[] = [];
    if (checkRoleDepartments([ROLE_NAME.PlatformAdmin], roleAssignments)) {
      array.push(ROLE_NAME.DepartmentAdmin, ROLE_NAME.DepartmentHRAdvisor);
    }
    if (
      checkRoleDepartments(
        [ROLE_NAME.DepartmentAdmin],
        roleAssignments,
        departmentId,
      )
    ) {
      array.push(ROLE_NAME.DepartmentHRAdvisor);
    }
    return uniqueItems(array);
  }, [roleAssignments]);

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
