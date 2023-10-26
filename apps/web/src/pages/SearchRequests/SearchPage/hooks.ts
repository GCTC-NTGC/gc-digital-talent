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

import { FormValues, LocationState } from "~/types/searchRequest";

import {
  applicantFilterIncludesPools,
  applicantFilterToQueryArgs,
  dataToFormValues,
} from "./utils";

// eslint-disable-next-line import/prefer-default-export
export const useAnnounceCandidateAccount = (
  candidateCount: number,
  filters: ApplicantFilterInput,
  fetching?: boolean,
) => {
  const intl = useIntl();
  const { announce } = useAnnouncer();
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
};

type UseInitialFiltersReturn = {
  formValues: FormValues;
  filters: ApplicantFilterInput;
};

export const useInitialFilters = (pools: Pool[]): UseInitialFiltersReturn => {
  const location = useLocation();
  const { state }: { state: LocationState } = location;

  const initialFilters = useMemo(() => {
    return (
      state?.applicantFilter ?? {
        pools,
      }
    );
  }, [pools, state?.applicantFilter]);

  return {
    formValues: dataToFormValues(
      initialFilters,
      state?.selectedClassifications,
      pools,
    ),
    filters: initialFilters,
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
  const queryArgs = useMemo(
    () => applicantFilterToQueryArgs(filters),
    [filters],
  );

  // The countApplicants query ignores the pool filter if it is an empty array, just like if it were undefined.
  // However, we want to treat an empty pool filter as resulting in zero candidates.
  // Therefore, we can skip the query and override the count results ourselves.
  const hasPools = applicantFilterIncludesPools(filters);

  // Fetches the number of pool candidates by pool to display on pool cards AND
  // Fetches the total number of candidates, since some pool candidates will correspond to the same user.
  const [{ data, fetching }] =
    useCountApplicantsAndCountPoolCandidatesByPoolQuery({
      variables: queryArgs,
      pause: !hasPools, // If filter does not include pools, we wil manually return 0 count.
    });

  return {
    fetching,
    candidateCount:
      hasPools && data?.countApplicants !== undefined
        ? data.countApplicants
        : 0,
    results: hasPools ? data?.countPoolCandidatesByPool : [],
  };
};
