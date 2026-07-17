import { useCallback, useEffect, useMemo, useRef } from "react";
import { useIntl } from "react-intl";
import type { Location } from "react-router";
import { useLocation } from "react-router";
import { useQuery } from "urql";

import { useAnnouncer } from "@gc-digital-talent/ui";
import type {
  ApplicantFilterInput,
  CountTalentRequestMatchesQuery,
  SearchResultCard_PoolFragment,
} from "@gc-digital-talent/graphql";
import { graphql } from "@gc-digital-talent/graphql";
import { useFeatureFlags } from "@gc-digital-talent/env";

import type { FormValues, LocationState } from "~/types/searchRequest";

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

// TODO: Remove this query once talentRequests feature flag is turned on.
const CandidateCount_Query = graphql(/* GraphQL */ `
  query CandidateCount($where: ApplicantFilterInput) {
    countApplicantsForSearch(where: $where)
    countPoolCandidatesByPool(where: $where) {
      pool {
        id
        ...SearchResultCard_Pool
      }
      candidateCount
    }
  }
`);

const CountTalentRequestMatches_Query = graphql(/* GraphQL */ `
  query CountTalentRequestMatches($where: TalentRequestMatchFilterInput) {
    countTalentRequestMatches(where: $where)
    countTalentRequestMatchesByPool(where: $where) {
      pool {
        id
        ...SearchResultCard_Pool
      }
      count
    }
    countTalentRequestMatchesByCommunity(where: $where) {
      community {
        id
        name {
          localized
        }
      }
      qualifiedInPoolCount
      atLevelCount
      count
    }
  }
`);

interface UseCandidateCountReturn {
  fetching: boolean;
  candidateCount: number;
  results?: {
    count: number;
    pool: SearchResultCard_PoolFragment;
  }[];
  communities: CountTalentRequestMatchesQuery["countTalentRequestMatchesByCommunity"];
}

export const useCandidateCount = (
  filters: ApplicantFilterInput,
): UseCandidateCountReturn => {
  const { talentRequests } = useFeatureFlags();
  const intl = useIntl();
  const { announce } = useAnnouncer();

  const queryArgs = useMemo(
    () => applicantFilterToQueryArgs(filters),
    [filters],
  );

  // Fetches the number of pool candidates by pool to display on pool cards AND
  // Fetches the total number of candidates, since some pool candidates will correspond to the same user.
  // TODO: Remove this query once talentRequests feature flag is turned on.
  const [{ data, fetching }] = useQuery({
    query: CandidateCount_Query,
    variables: queryArgs,
  });

  const [{ data: talentRequestData, fetching: talentRequestFetching }] =
    useQuery({
      query: CountTalentRequestMatches_Query,
      variables: { where: { applicantFilter: queryArgs.where } },
    });

  const candidateCount = talentRequests
    ? (talentRequestData?.countTalentRequestMatches ?? 0)
    : (data?.countApplicantsForSearch ?? 0);

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
    fetching: talentRequests ? talentRequestFetching : fetching,
    candidateCount,
    results: talentRequests
      ? (talentRequestData?.countTalentRequestMatchesByPool ?? [])
      : (data?.countPoolCandidatesByPool ?? []).map(
          ({ pool, candidateCount: count }) => ({
            pool,
            count,
          }),
        ),
    communities: talentRequests
      ? (talentRequestData?.countTalentRequestMatchesByCommunity ?? [])
      : [],
  };
};
