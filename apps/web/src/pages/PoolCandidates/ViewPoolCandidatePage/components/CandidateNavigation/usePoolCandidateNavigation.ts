import { useMemo } from "react";
import { useQuery } from "urql";

import {
  graphql,
  PoolCandidatesBaseSort,
  QueryPoolCandidatesCursorOrderByRelationOrderByClause,
} from "@gc-digital-talent/graphql";

import { CandidateQueryVariables } from "~/components/PoolCandidatesTable/helpers";

// Must match what exists in PoolCandidatesTable
const CandidateNavigation_Query = graphql(/** GraphQL */ `
  query CandidateNavigation(
    $where: PoolCandidateSearchInput
    $orderByBaseInput: PoolCandidatesBaseSort!
    $poolNameSortingInput: PoolCandidatePoolNameOrderByInput
    $sortingInput: [QueryPoolCandidatesCursorOrderByRelationOrderByClause!]
    $orderByClaimVerification: ClaimVerificationSort
    $orderByEmployeeDepartment: SortOrder
    $orderByScreeningStage: SortOrder
    $after: String
    $before: String
    $first: Int
    $last: Int
  ) {
    next: poolCandidatesCursor(
      where: $where
      orderByBase: $orderByBaseInput
      orderByPoolName: $poolNameSortingInput
      orderBy: $sortingInput
      orderByClaimVerification: $orderByClaimVerification
      orderByEmployeeDepartment: $orderByEmployeeDepartment
      orderByScreeningStage: $orderByScreeningStage
      after: $after
      first: $first
    ) {
      edges {
        node {
          id
        }
      }
      pageInfo {
        endCursor
      }
    }
    prev: poolCandidatesCursor(
      where: $where
      orderByBase: $orderByBaseInput
      orderByPoolName: $poolNameSortingInput
      orderBy: $sortingInput
      orderByClaimVerification: $orderByClaimVerification
      orderByEmployeeDepartment: $orderByEmployeeDepartment
      orderByScreeningStage: $orderByScreeningStage
      before: $before
      last: $last
    ) {
      edges {
        node {
          id
        }
      }
      pageInfo {
        startCursor
      }
    }
  }
`);

export interface NavigationState {
  queryVariables: CandidateQueryVariables;
  currentCursor?: string;
}

const usePoolCandidateNavigation = (state?: NavigationState) => {
  // If we have no cursor in state, we are on the first candidate
  const isInitial = !state?.currentCursor;

  const [{ data, fetching, error }] = useQuery({
    query: CandidateNavigation_Query,
    variables: {
      ...state?.queryVariables,
      sortingInput: state?.queryVariables
        .sortingInput as QueryPoolCandidatesCursorOrderByRelationOrderByClause[],
      orderByBaseInput:
        state?.queryVariables?.orderByBaseInput ??
        ({
          column: "submitted_at",
          order: "DESC",
        } as PoolCandidatesBaseSort),
      after: state?.currentCursor ?? null,
      before: state?.currentCursor ?? null,
      first: isInitial ? 2 : 1,
      last: 1,
    },
    pause: !state?.queryVariables,
  });

  return useMemo(() => {
    if (fetching || error || !data) {
      return { fetching, next: null, prev: null };
    }

    const nextEdges = data.next?.edges ?? [];
    const prevEdges = data.prev?.edges ?? [];

    // NEXT: If initial, target is index 1. If we have a cursor, target is index 0.
    const nextNode = isInitial ? nextEdges[1] : nextEdges[0];

    // PREV: Only exists if we aren't at the very start.
    // NOTE: Not working, first click seems to go to next
    const prevNode = isInitial ? null : prevEdges[0];

    return {
      fetching: false,
      next: nextNode
        ? {
            id: nextNode.node.id,
            cursor: data.next?.pageInfo?.endCursor,
          }
        : null,
      prev: prevNode
        ? {
            id: prevNode.node.id,
            cursor: data.prev?.pageInfo?.startCursor,
          }
        : null,
    };
  }, [data, fetching, error, isInitial]);
};

export default usePoolCandidateNavigation;
