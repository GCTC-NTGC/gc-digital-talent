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
  const intl = useIntl();
  const { announce } = useAnnouncer();

  const queryArgs = useMemo(
    () => applicantFilterToQueryArgs(filters),
    [filters],
  );

  const [{ data: talentRequestData, fetching }] = useQuery({
    query: CountTalentRequestMatches_Query,
    variables: { where: { applicantFilter: queryArgs.where } },
  });

  const candidateCount = talentRequestData?.countTalentRequestMatches ?? 0;

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
    results: talentRequestData?.countTalentRequestMatchesByPool ?? [],
    communities: talentRequestData?.countTalentRequestMatchesByCommunity ?? [],
  };
};
