import { useQuery } from "urql";

import { graphql } from "@gc-digital-talent/graphql";
import { ROLE_NAME, RoleName } from "@gc-digital-talent/auth";
import { unpackMaybes } from "@gc-digital-talent/helpers";

const ASSESSMENT_MEMBER_ROLES: RoleName[] = [
  ROLE_NAME.PlatformAdmin,
  ROLE_NAME.CommunityRecruiter,
  ROLE_NAME.CommunityTalentCoordinator,
  ROLE_NAME.ProcessOperator,
];

const AssessmentMemberRoles_Query = graphql(/** GraphQL */ `
  query AssessmentMemberRoles {
    roles {
      id
      name
    }
  }
`);

const PoolActivityAssessmentMembers_Query = graphql(/** GraphQL */ `
  query PoolActivityAssessmentMembers($where: UserFilterInput) {
    usersPaginated(where: $where, first: 100) {
      data {
        id
        firstName
        lastName
        email
      }

      paginatorInfo {
        total
      }
    }
  }
`);

const useAvailableAssessmentMembers = (searchTerm?: string) => {
  const [{ data: rolesData, fetching: fetchingRoles }] = useQuery({
    query: AssessmentMemberRoles_Query,
  });

  const roles = unpackMaybes(rolesData?.roles)
    .filter((role) => ASSESSMENT_MEMBER_ROLES.includes(role?.name as RoleName))
    .flatMap((role) => role.id);

  const [{ data, fetching }] = useQuery({
    query: PoolActivityAssessmentMembers_Query,
    pause: !rolesData,
    variables: {
      where: {
        roles,
        generalSearch: searchTerm,
      },
    },
  });

  const assessmentMembers = unpackMaybes(data?.usersPaginated.data);
  const total =
    data?.usersPaginated.paginatorInfo?.total ?? assessmentMembers.length;

  return {
    assessmentMembers,
    total,
    fetching: fetchingRoles || fetching,
  };
};

export default useAvailableAssessmentMembers;
