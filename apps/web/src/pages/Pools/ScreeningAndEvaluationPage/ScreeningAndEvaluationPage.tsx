import { useState, useCallback, useEffect } from "react";
import { useClient, useQuery } from "urql";
import { useIntl } from "react-intl";
import { SubmitHandler } from "react-hook-form";

import {
  graphql,
  FragmentType,
  Scalars,
  PoolCandidateSearchInput,
  CandidateSuspendedFilter,
  CandidateExpiryFilter,
} from "@gc-digital-talent/graphql";
import { Pending, ThrowNotFound } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { useLogger } from "@gc-digital-talent/logger";

import useRequiredParams from "~/hooks/useRequiredParams";
import AssessmentStepTracker, {
  AssessmentStepTracker_CandidateFragment,
} from "~/components/AssessmentStepTracker/AssessmentStepTracker";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import { transformFormValuesToFilterState } from "~/components/AssessmentStepTracker/utils";
import { FormValues } from "~/components/AssessmentStepTracker/types";

interface RouteParams extends Record<string, string> {
  poolId: Scalars["ID"]["input"];
}

const ScreeningAndEvaluation_PoolQuery = graphql(/* GraphQL */ `
  query ScreeningAndEvaluation_Pools(
    $poolId: UUID!
    $first: Int!
    $where: PoolCandidateSearchInput
  ) {
    pool(id: $poolId) {
      ...AssessmentStepTracker_Pool
    }
    poolCandidatesPaginated(
      first: $first
      where: $where
      orderByClaimVerification: { order: DESC }
    ) {
      paginatorInfo {
        lastPage
      }
    }
  }
`);

const ScreeningAndEvaluation_CandidatesQuery = graphql(/* GraphQL */ `
  query ScreeningAndEvaluation_Candidates(
    $where: PoolCandidateSearchInput
    $first: Int!
    $page: Int
  ) {
    poolCandidatesPaginated(where: $where, first: $first, page: $page) {
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
  const logger = useLogger();
  const [fetchingCandidates, setFetchingCandidates] = useState<boolean>(true);
  const [candidates, setCandidates] = useState<
    FragmentType<typeof AssessmentStepTracker_CandidateFragment>[]
  >([]);

  const [{ data, fetching, error }] = useQuery({
    query: ScreeningAndEvaluation_PoolQuery,
    variables: {
      poolId,
      first: CANDIDATES_BATCH_SIZE,
      where: {
        applicantFilter: { pools: [{ id: poolId }] },
        suspendedStatus: CandidateSuspendedFilter.Active,
        expiryStatus: CandidateExpiryFilter.Active,
      },
    },
  });
  const lastPage = data?.poolCandidatesPaginated.paginatorInfo.lastPage ?? 0;

  const batchLoader = useCallback(
    async (where?: PoolCandidateSearchInput) => {
      const batches = [];

      for (let i = 1; i <= lastPage; i += 1) {
        batches.push(
          client
            .query(ScreeningAndEvaluation_CandidatesQuery, {
              where,
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
            description:
              "Error message when pool candidates could not be loaded",
          }),
        );
        return [];
      } finally {
        setFetchingCandidates(false);
      }
    },
    [client, intl, lastPage],
  );

  const handleFilterSubmit: SubmitHandler<FormValues> = async (formData) => {
    const transformedData: PoolCandidateSearchInput =
      transformFormValuesToFilterState(formData, poolId);

    await batchLoader(transformedData).then((res) => {
      setCandidates(res);
    });
  };

  useEffect(() => {
    if (lastPage) {
      batchLoader({
        applicantFilter: { pools: [{ id: poolId }] },
        suspendedStatus: CandidateSuspendedFilter.Active,
        expiryStatus: CandidateExpiryFilter.Active,
      })
        .then((res) => {
          setCandidates(res);
        })
        .catch((err: unknown) => {
          logger.error(String(err));
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastPage]);

  return (
    <AdminContentWrapper table data-h2-margin-top="base(-x3)">
      <Pending fetching={fetching} error={error}>
        {data?.pool ? (
          <AssessmentStepTracker
            poolQuery={data?.pool}
            fetching={fetching || fetchingCandidates}
            candidateQuery={candidates}
            onSubmitDialog={handleFilterSubmit}
          />
        ) : (
          <ThrowNotFound />
        )}
      </Pending>
    </AdminContentWrapper>
  );
};

export const Component = () => (
  <RequireAuth
    roles={[
      ROLE_NAME.PoolOperator,
      ROLE_NAME.PlatformAdmin,
      ROLE_NAME.CommunityAdmin,
      ROLE_NAME.CommunityRecruiter,
      ROLE_NAME.ProcessOperator,
    ]}
  >
    <ScreeningAndEvaluationPage />
  </RequireAuth>
);

Component.displayName = "AdminScreeningAndEvaluationPage";

export default ScreeningAndEvaluationPage;
