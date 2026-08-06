import { useLocation } from "react-router";
import { useQuery } from "urql";

import { graphql } from "@gc-digital-talent/graphql";
import type {
  AdvancedOrderByInput,
  PoolCandidateSearchInput,
} from "@gc-digital-talent/graphql";

// The filter/sort params shared between the table query and navigation queries
export interface CandidateNavigationQueryParams {
  where: PoolCandidateSearchInput | null | undefined;
  orderBy: AdvancedOrderByInput[];
}

export interface CandidateNavigationState extends CandidateNavigationQueryParams {
  currentPage: number; // 1-indexed absolute position in the full filtered/sorted result set
  totalCount: number;
}

// Single query using GraphQL aliases to fetch both prev and next in one HTTP request
const CandidateNavigation_Query = graphql(/* GraphQL */ `
  query CandidateNavigation_Query(
    $where: PoolCandidateSearchInput
    $prevPage: Int!
    $nextPage: Int!
    $orderBy: [AdvancedOrderByInput!]
  ) {
    prevCandidate: poolCandidatesPaginated(
      where: $where
      first: 1
      page: $prevPage
      orderBy: $orderBy
    ) {
      data {
        poolCandidate {
          id
        }
      }
    }
    nextCandidate: poolCandidatesPaginated(
      where: $where
      first: 1
      page: $nextPage
      orderBy: $orderBy
    ) {
      data {
        poolCandidate {
          id
        }
      }
    }
  }
`);

interface CandidateLocation {
  state?: {
    navigationState?: CandidateNavigationState;
    stepName?: string | null;
  };
}

type UsePoolCandidateNavigationReturn = {
  navigationState: CandidateNavigationState;
  stepName?: string | null;
  hasPrevious: boolean;
  hasNext: boolean;
  previousCandidate?: string;
  nextCandidate?: string;
  fetching: boolean;
} | null;

const usePoolCandidateNavigation = (
  _candidateId: string,
): UsePoolCandidateNavigationReturn => {
  const { state } = useLocation() as CandidateLocation;
  const navigationState = state?.navigationState;

  const hasPrevious = (navigationState?.currentPage ?? 1) > 1;
  const hasNext =
    (navigationState?.currentPage ?? 0) < (navigationState?.totalCount ?? 0);

  const [{ data, fetching }] = useQuery({
    query: CandidateNavigation_Query,
    variables: {
      where: navigationState?.where,
      prevPage: Math.max(1, (navigationState?.currentPage ?? 2) - 1),
      nextPage: (navigationState?.currentPage ?? 0) + 1,
      orderBy: navigationState?.orderBy,
    },
    pause: !navigationState || (!hasPrevious && !hasNext),
  });

  if (!navigationState) return null;
  if (!hasPrevious && !hasNext) return null;

  const previousCandidate = hasPrevious
    ? data?.prevCandidate?.data?.[0]?.poolCandidate?.id
    : undefined;

  const nextCandidate = hasNext
    ? data?.nextCandidate?.data?.[0]?.poolCandidate?.id
    : undefined;

  return {
    navigationState,
    stepName: state?.stepName,
    hasPrevious,
    hasNext,
    previousCandidate,
    nextCandidate,
    fetching,
  };
};

export default usePoolCandidateNavigation;
