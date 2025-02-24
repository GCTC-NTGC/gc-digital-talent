import { useCallback, useEffect, useMemo, useRef } from "react";
import { useIntl } from "react-intl";
import { Location, useLocation } from "react-router";
import { useQuery } from "urql";

import { useAnnouncer } from "@gc-digital-talent/ui";
import {
  graphql,
  ApplicantFilterInput,
  CandidateSearchPoolResult,
  SearchResultCard_PoolFragment,
} from "@gc-digital-talent/graphql";

import { FormValues, LocationState } from "~/types/searchRequest";

import { applicantFilterToQueryArgs, dataToFormValues } from "./utils";

interface UseInitialState {
  defaultValues: FormValues;
  initialFilters: ApplicantFilterInput;
}

export const useInitialFilters = (): UseInitialState => {
  const location = useLocation();
  const { state } = location as Location<LocationState>;

  const initialFilters = state?.applicantFilter ?? {};

  const defaultValues = dataToFormValues(
    state?.applicantFilter ?? {},
    state?.selectedClassifications,
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

  // Fetches the number of pool candidates by pool to display on pool cards AND
  // Fetches the total number of candidates, since some pool candidates will correspond to the same user.
  const [{ data, fetching }] = useQuery({
    query: CandidateCount_Query,
    variables: queryArgs,
  });

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const candidateCount = data?.countApplicants ? data.countApplicants : 0;

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
    results: data?.countPoolCandidatesByPool ?? [],
  };
};
