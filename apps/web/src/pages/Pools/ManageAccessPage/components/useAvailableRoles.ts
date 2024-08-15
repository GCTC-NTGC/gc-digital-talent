import { useQuery } from "urql";
import { useMemo } from "react";

import { Role, graphql } from "@gc-digital-talent/graphql";
import { notEmpty } from "@gc-digital-talent/helpers";

const ManageAccessPool_AvailableRolesQuery = graphql(/* GraphQL */ `
  query ManageAccessPoolAvailableRolesQuery {
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

type UseAvailableRolesReturn = {
  roles: Role[];
  fetching: boolean;
};

const useAvailableRoles = (): UseAvailableRolesReturn => {
  const [{ data, fetching }] = useQuery({
    query: ManageAccessPool_AvailableRolesQuery,
  });

  const poolRolesArray = useMemo(() => {
    const roles = ["process_operator"];
    return roles;
  }, []);

  const roles: Role[] = useMemo(
    () =>
      data?.roles
        ? data.roles
            .filter(notEmpty)
            .filter((role) => role.isTeamBased)
            .filter((role) => poolRolesArray.includes(role.name))
        : [],
    [data?.roles, poolRolesArray],
  );

  return {
    roles,
    fetching,
  };
};

export default useAvailableRoles;
