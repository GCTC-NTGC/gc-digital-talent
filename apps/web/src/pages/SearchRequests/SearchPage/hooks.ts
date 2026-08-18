import { useCallback, useEffect, useMemo, useRef } from "react";
import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { useAnnouncer } from "@gc-digital-talent/ui";
import type {
  ApplicantFilterInput,
  CountTalentRequestMatchesQuery,
  SearchResultCard_PoolFragment,
} from "@gc-digital-talent/graphql";
import { graphql } from "@gc-digital-talent/graphql";
import { useSessionStorage } from "@gc-digital-talent/storage";

import type {
  FormValues,
  TalentRequestClassification,
} from "~/types/talentRequestForm";

import { applicantFilterToQueryArgs, dataToFormValues } from "./utils";

export const TALENT_REQUEST_STATE_KEY = "talentRequestState";

interface TalentRequestState {
  applicantFilter?: ApplicantFilterInput;
  candidateCount?: number;
}

export const useTalentRequestState = (initialValues?: TalentRequestState) => {
  const requestState = useSessionStorage<TalentRequestState>(
    TALENT_REQUEST_STATE_KEY,
    initialValues ?? {},
  );

  return requestState;
};

interface UseInitialState {
  defaultValues: FormValues;
  initialFilters: ApplicantFilterInput;
}

export const useInitialFilters = (
  classifications: TalentRequestClassification[],
): UseInitialState => {
  const [{ applicantFilter }] = useTalentRequestState();

  const initialFilters = applicantFilter ?? {};

  const defaultValues = dataToFormValues(initialFilters, classifications);

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
