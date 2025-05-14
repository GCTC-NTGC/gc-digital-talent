import { useQuery } from "urql";
import { useMemo } from "react";

import { Role, graphql } from "@gc-digital-talent/graphql";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import { ROLE_NAME, useAuthorization } from "@gc-digital-talent/auth";

import { checkRole } from "~/utils/communityUtils";

const CommunityMembers_AvailableRolesQuery = graphql(/* GraphQL */ `
  query AvailableCommunityRoles {
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

interface UseAvailableRolesReturn {
  roles: Role[];
  fetching: boolean;
}

const useAvailableRoles = (): UseAvailableRolesReturn => {
  const [{ data, fetching }] = useQuery({
    query: CommunityMembers_AvailableRolesQuery,
  });

  const { userAuthInfo } = useAuthorization();
  const roleAssignments = unpackMaybes(userAuthInfo?.roleAssignments);
  const communityRoles = useMemo(() => {
    const array = ["community_recruiter", "community_talent_coordinator"];
    if (checkRole([ROLE_NAME.PlatformAdmin], roleAssignments)) {
      array.push("community_admin");
    }
    return array;
  }, [roleAssignments]);

  const roles: Role[] = useMemo(
    () =>
      data?.roles
        ? data.roles
            .filter(notEmpty)
            .filter((role) => role.isTeamBased)
            .filter((role) => communityRoles.includes(role.name))
        : [],
    [data?.roles, communityRoles],
  );

  return {
    roles,
    fetching,
  };
};

export default useAvailableRoles;
