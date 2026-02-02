import { useQuery } from "urql";
import { useParams } from "react-router";

import { graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

const PoolActivityCandidates_Query = graphql(/** GraphQL */ `
  query PoolActivityCandidates($id: UUID!, $searchTerm: String) {
    pool(id: $id) {
      poolCandidates(generalSearch: $searchTerm) {
        id
        user {
          firstName
          lastName
          email
        }
      }
    }
  }
`);

const useAvailableCandidates = (searchTerm?: string) => {
  const { poolId } = useParams();
  const [{ data, fetching }] = useQuery({
    query: PoolActivityCandidates_Query,
    variables: {
      id: poolId ?? "",
      searchTerm,
    },
  });

  const candidates = unpackMaybes(data?.pool?.poolCandidates);
  const total = candidates.length;

  return {
    candidates,
    total,
    fetching,
  };
};

export default useAvailableCandidates;
