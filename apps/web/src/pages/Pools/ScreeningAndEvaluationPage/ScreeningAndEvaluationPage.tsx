import { useState, useCallback, useEffect } from "react";
import { useClient, useQuery } from "urql";
import { useIntl } from "react-intl";

import { graphql, FragmentType, Scalars } from "@gc-digital-talent/graphql";
import { Pending, ThrowNotFound } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import useRequiredParams from "~/hooks/useRequiredParams";
import AssessmentStepTracker, {
  AssessmentStepTracker_CandidateFragment,
} from "~/components/AssessmentStepTracker/AssessmentStepTracker";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

type RouteParams = {
  poolId: Scalars["ID"]["input"];
};

const ScreeningAndEvaluation_PoolQuery = graphql(/* GraphQL */ `
  query ScreeningAndEvaluation_Pools(
    $poolId: UUID!
    $pools: [IdInput]
    $first: Int!
  ) {
    pool(id: $poolId) {
      ...AssessmentStepTracker_Pool
    }
    poolCandidatesPaginated(
      where: { applicantFilter: { pools: $pools } }
      first: $first
    ) {
      paginatorInfo {
        lastPage
      }
    }
  }
`);

const ScreeningAndEvaluation_CandidatesQuery = graphql(/* GraphQL */ `
  query ScreeningAndEvaluation_Candidates(
    $pools: [IdInput]
    $first: Int!
    $page: Int
  ) {
    poolCandidatesPaginated(
      where: { applicantFilter: { pools: $pools } }
      first: $first
      page: $page
    ) {
      paginatorInfo {
        hasMorePages
        currentPage
      }
      data {
        poolCandidate {
          id
          ...AssessmentStepTracker_Candidate
        }
      }
    }
  }
`);

const CANDIDATES_BATCH_SIZE = 100;

const ScreeningAndEvaluationPage = () => {
  const { poolId } = useRequiredParams<RouteParams>("poolId");
  const client = useClient();
  const intl = useIntl();
  const [fetchingCandidates, setFetchingCandidates] = useState<boolean>(true);
  const [candidates, setCandidates] = useState<
    FragmentType<typeof AssessmentStepTracker_CandidateFragment>[]
  >([]);
  const [{ data, fetching, error }] = useQuery({
    query: ScreeningAndEvaluation_PoolQuery,
    variables: {
      poolId,
      first: CANDIDATES_BATCH_SIZE,
      pools: [{ id: poolId }],
    },
  });
  const lastPage = data?.poolCandidatesPaginated.paginatorInfo.lastPage ?? 0;

  const batchLoader = useCallback(async () => {
    const batches = [];

    for (let i = 1; i <= lastPage; i += 1) {
      batches.push(
        client
          .query(ScreeningAndEvaluation_CandidatesQuery, {
            pools: [{ id: poolId }],
            first: CANDIDATES_BATCH_SIZE,
            page: i,
          })
          .then((result) => result.data?.poolCandidatesPaginated.data ?? []),
      );
    }

    try {
      const batchedData = await Promise.all(batches);
      return batchedData.flat().map((c) => c.poolCandidate);
    } catch {
      toast.error(
        intl.formatMessage({
          defaultMessage: "Error loading candidates",
          id: "ZVfbLF",
          description: "Error message when pool candidates could not be loaded",
        }),
      );
      return [];
    } finally {
      setFetchingCandidates(false);
    }
  }, [client, intl, lastPage, poolId]);

  useEffect(() => {
    if (lastPage) {
      batchLoader().then((res) => {
        setCandidates(res);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastPage]);

  return (
    <AdminContentWrapper>
      <Pending fetching={fetching} error={error}>
        {data?.pool ? (
          <AssessmentStepTracker
            poolQuery={data?.pool}
            fetching={fetching || fetchingCandidates}
            candidateQuery={candidates}
          />
        ) : (
          <ThrowNotFound />
        )}
      </Pending>
    </AdminContentWrapper>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.PoolOperator, ROLE_NAME.PlatformAdmin]}>
    <ScreeningAndEvaluationPage />
  </RequireAuth>
);

Component.displayName = "AdminScreeningAndEvaluationPage";

export default ScreeningAndEvaluationPage;
