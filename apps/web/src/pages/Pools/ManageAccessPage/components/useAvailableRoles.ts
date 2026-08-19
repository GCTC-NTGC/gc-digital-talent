import { useQuery } from "urql";
import { useMemo } from "react";

import { graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

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

const useAvailableRoles = () => {
  const [{ data, fetching }] = useQuery({
    query: ManageAccessPool_AvailableRolesQuery,
  });

  const poolRolesArray = useMemo(() => {
    const roles = ["process_operator"];
    return roles;
  }, []);

  const roles = useMemo(
    () =>
      unpackMaybes(data?.roles)
        .filter((role) => role.isTeamBased)
        .filter((role) => poolRolesArray.includes(role.name)),
    [data?.roles, poolRolesArray],
  );

  return {
    roles,
    fetching,
  };
};

export default useAvailableRoles;
