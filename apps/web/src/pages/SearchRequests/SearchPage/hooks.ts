import { useEffect, useMemo, useRef } from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";

import { useAnnouncer } from "@gc-digital-talent/ui";
import {
  ApplicantFilterInput,
  CandidateSearchPoolResult,
  Pool,
  useCountApplicantsAndCountPoolCandidatesByPoolQuery,
} from "@gc-digital-talent/graphql";
import { notEmpty } from "@gc-digital-talent/helpers";

import { FormValues, LocationState } from "~/types/searchRequest";

import { applicantFilterToQueryArgs, dataToFormValues } from "./utils";

type UseInitialState = {
  defaultValues: FormValues;
  initialFilters: ApplicantFilterInput;
};

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

type UseCandidateCountReturn = {
  fetching: boolean;
  candidateCount: number;
  results?: CandidateSearchPoolResult[];
};

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
    notEmpty(filters) &&
    notEmpty(filters.pools) &&
    filters.pools.filter(notEmpty).length > 0;

  // Fetches the number of pool candidates by pool to display on pool cards AND
  // Fetches the total number of candidates, since some pool candidates will correspond to the same user.
  const [{ data, fetching }] =
    useCountApplicantsAndCountPoolCandidatesByPoolQuery({
      variables: queryArgs,
      pause: !hasPools, // If filter does not include pools, we wil manually return 0 count.
    });

  const candidateCount =
    hasPools && data?.countApplicants ? data.countApplicants : 0;

  /**
   * Announce the candidate count to users in a less verbose way
   *
   * Note: `announceCount.current > 3` is a magic number, our current candidate count is causing
   * a lot of re-runs for some reason (specifically 3 on initial loading)
   * and this prevents the announcer  repeating itself excessively
   */
  const announceCount = useRef<number>(0);
  useEffect(() => {
    if (filters && announceCount.current > 3 && !fetching) {
      announce(
        intl.formatMessage(
          {
            defaultMessage: "{count} candidates meet your criteria.",
            id: "dwe1M+",
            description:
              "Message announced to assistive technology users when the estimated candidate count changes.",
          },
          {
            count: candidateCount,
          },
        ),
      );
    }
    announceCount.current += 1;
  }, [candidateCount, announce, filters, fetching, intl]);

  return {
    fetching,
    candidateCount,
    results: hasPools ? data?.countPoolCandidatesByPool : [],
  };
};
