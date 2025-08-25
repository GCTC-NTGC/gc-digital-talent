import { useQuery } from "urql";

import { Pool, PoolFilterInput, graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

const EditUserPage_AvailablePoolsQuery = graphql(/* GraphQL */ `
  query EditUserPage_AvailablePools(
    $includeIds: [UUID!]
    $excludeIds: [UUID!]
    $where: PoolFilterInput
    $orderByPoolBookmarks: PoolBookmarksOrderByInput
    $first: Int
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
        id
        name {
          en
          fr
        }
        teamIdForRoleAssignment
      }
      paginatorInfo {
        total
      }
    }
  }
`);

interface UseAvailablePoolsReturn {
  pools: Pool[];
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

  const pools = unpackMaybes(data?.poolsPaginated?.data);
  const total = data?.poolsPaginated.paginatorInfo?.total ?? pools.length;

  return {
    pools,
    total,
    fetching,
  };
};

export default useAvailablePools;
