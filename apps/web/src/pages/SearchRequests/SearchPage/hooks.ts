import { useCallback, useEffect, useMemo, useRef } from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";
import { useQuery } from "urql";

import { useAnnouncer } from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";
import {
  graphql,
  ApplicantFilterInput,
  CandidateSearchPoolResult,
  Pool,
  SearchResultCard_PoolFragment,
} from "@gc-digital-talent/graphql";

import { FormValues, LocationState } from "~/types/searchRequest";

import { applicantFilterToQueryArgs, dataToFormValues } from "./utils";

interface UseInitialState {
  defaultValues: FormValues;
  initialFilters: ApplicantFilterInput;
}

export const useInitialFilters = (pools: Pool[]): UseInitialState => {
  const location = useLocation();
  const { state }: { state: LocationState } = location;

  const initialFilters = state?.applicantFilter ?? {
    pools,
  };

  const defaultValues = dataToFormValues(
    state?.applicantFilter ?? {},
    state?.selectedClassifications,
    pools,
  );

  return {
    defaultValues,
    initialFilters,
  };
};

const CandidateCount_Query = graphql(/* GraphQL */ `
  query CandidateCount($where: ApplicantFilterInput) {
    countApplicants(where: $where)
    countPoolCandidatesByPool(where: $where) {
      pool {
        id
        ...SearchResultCard_Pool
      }
      candidateCount
    }
  }
`);

interface UseCandidateCountReturn {
  fetching: boolean;
  candidateCount: number;
  results?: (Pick<CandidateSearchPoolResult, "candidateCount"> & {
    pool: SearchResultCard_PoolFragment;
  })[];
}

export const useCandidateCount = (
  filters: ApplicantFilterInput,
): UseCandidateCountReturn => {
  const intl = useIntl();
  const { announce } = useAnnouncer();

  const queryArgs = useMemo(
    () => applicantFilterToQueryArgs(filters),
    [filters],
  );

  // The countApplicants query ignores the pool filter if it is an empty array, just like if it were undefined.
  // However, we want to treat an empty pool filter as resulting in zero candidates.
  // Therefore, we can skip the query and override the count results ourselves.
  const hasPools =
    notEmpty(filters.pools) && filters.pools.filter(notEmpty).length > 0;

  // Fetches the number of pool candidates by pool to display on pool cards AND
  // Fetches the total number of candidates, since some pool candidates will correspond to the same user.
  const [{ data, fetching }] = useQuery({
    query: CandidateCount_Query,
    variables: queryArgs,
    pause: !hasPools, // If filter does not include pools, we wil manually return 0 count.
  });

  const candidateCount =
    hasPools && data?.countApplicants ? data.countApplicants : 0;

  /**
   * Announce the candidate count to users in a less verbose way
   *
   * Note: `announceCount.current > 1` is there to prevent
   * announcing on the first load.
   */
  const announceCount = useRef<number>(0);
  const announceCandidateCount = useCallback(
    (count: number) => {
      if (announceCount.current > 1 && !fetching) {
        announce(
          intl.formatMessage(
            {
              defaultMessage: "{count} candidates meet your criteria.",
              id: "dwe1M+",
              description:
                "Message announced to assistive technology users when the estimated candidate count changes.",
            },
            {
              count,
            },
          ),
        );
      }
      announceCount.current += 1;
    },
    [announce, fetching, intl],
  );

  useEffect(() => {
    announceCandidateCount(candidateCount);
  }, [announceCandidateCount, candidateCount]);

  return {
    fetching,
    candidateCount,
    results: hasPools ? data?.countPoolCandidatesByPool : [],
  };
};
