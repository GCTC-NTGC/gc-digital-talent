import { useQuery } from "urql";

import type {
  AvailablePoolFragment,
  PoolFilterInput,
} from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

const AvailablePool_Fragment = graphql(/* GraphQL */ `
  fragment AvailablePool on Pool {
    id
    name {
      en
      fr
    }
    teamIdForRoleAssignment
  }
`);

const EditUserPage_AvailablePoolsQuery = graphql(/* GraphQL */ `
  query EditUserPage_AvailablePools(
    $includeIds: [UUID!]
    $excludeIds: [UUID!]
    $where: PoolFilterInput
    $orderByPoolBookmarks: PoolBookmarksOrderByInput
    $first: Int!
    $page: Int
    $orderBy: [QueryPoolsPaginatedOrderByRelationOrderByClause!]
  ) {
    poolsPaginated(
      includeIds: $includeIds
      excludeIds: $excludeIds
      where: $where
      orderByPoolBookmarks: $orderByPoolBookmarks
      first: $first
      page: $page
      orderBy: $orderBy
    ) {
      data {
        ...AvailablePool
      }
      paginatorInfo {
        total
      }
    }
  }
`);

interface UseAvailablePoolsReturn {
  pools: AvailablePoolFragment[];
  total: number;
  fetching: boolean;
}

const useAvailablePools = (
  poolIdsToExclude: string[],
  where?: PoolFilterInput,
): UseAvailablePoolsReturn => {
  const [{ data, fetching }] = useQuery({
    query: EditUserPage_AvailablePoolsQuery,
    variables: {
      first: 100,
      excludeIds: poolIdsToExclude,
      where,
    },
  });

  const pools = getFragment(
    AvailablePool_Fragment,
    unpackMaybes(data?.poolsPaginated?.data),
  );
  const total = data?.poolsPaginated.paginatorInfo?.total ?? pools.length;

  return {
    pools,
    total,
    fetching,
  };
};

export default useAvailablePools;
