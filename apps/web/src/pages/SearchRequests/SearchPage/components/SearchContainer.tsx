import React, { useEffect, useMemo, useRef } from "react";
import { useIntl } from "react-intl";
import { useLocation, useNavigate } from "react-router-dom";
import pick from "lodash/pick";

import {
  Button,
  Heading,
  Separator,
  Pending,
  useAnnouncer,
} from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/forms";
import { notEmpty } from "@gc-digital-talent/helpers";

import {
  CountApplicantsQueryVariables,
  Maybe,
  ApplicantFilterInput,
  Skill,
  useGetSearchFormDataAcrossAllPoolsQuery,
  CandidateSearchPoolResult,
  useCountApplicantsAndCountPoolCandidatesByPoolQuery,
  ClassificationFilterInput,
} from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";
import { SimpleClassification, SimplePool } from "~/types/pool";
import Spinner from "~/components/Spinner/Spinner";
import nonExecutiveITClassifications from "~/constants/nonExecutiveITClassifications";
import { LocationState } from "~/types/searchRequest";

import EstimatedCandidates from "./EstimatedCandidates";
import SearchFilterAdvice from "./SearchFilterAdvice";
import CandidateResults from "./CandidateResults";
import SearchForm, { SearchFormRef } from "./SearchForm";

const applicantFilterToQueryArgs = (
  filter?: ApplicantFilterInput,
  poolId?: string,
): CountApplicantsQueryVariables => {
  /* We must pick only the fields belonging to ApplicantFilterInput, because its possible
     the data object contains other props at runtime, and this will cause the
     graphql operation to fail.
  */
  // Apply pick to each element of an array.
  function pickMap<T, K extends keyof T>(
    list: Maybe<Maybe<T>[]> | null | undefined,
    keys: K | K[],
  ): Pick<T, K>[] | undefined {
    return unpackMaybes(list).map(
      (item) => pick(item, keys) as Pick<T, K>, // I think this type coercion is safe? But I'm not sure why its not the default...
    );
  }

  if (filter !== null || undefined)
    return {
      where: {
        ...filter,
        equity: { ...filter?.equity },
        expectedClassifications: filter?.expectedClassifications
          ? pickMap(filter.expectedClassifications, ["group", "level"])
          : undefined,
        qualifiedClassifications: filter?.qualifiedClassifications
          ? pickMap(filter.qualifiedClassifications, ["group", "level"])
          : undefined,
        skills: filter?.skills ? pickMap(filter.skills, "id") : undefined,

        // Override the filter's pool if one is provided separately.
        pools: poolId ? [{ id: poolId }] : pickMap(filter?.pools, "id"),
      },
    };
  return {};
};

interface ResultsDisplayProps {
  pending: boolean;
  totalCandidateCount: number;
  selectedClassifications?: ClassificationFilterInput[];
  results?: Array<CandidateSearchPoolResult>;
  handleSubmit: (
    candidateCount: number,
    poolId: string | null,
    selectedClassifications: SimpleClassification[],
  ) => Promise<void>;
}

const ResultsDisplay = ({
  pending,
  results,
  handleSubmit,
  totalCandidateCount,
  selectedClassifications,
}: ResultsDisplayProps) => {
  const intl = useIntl();

  if (pending) {
    return <Spinner />;
  }

  return results && results.length ? (
    <div>
      {results.map(({ pool, candidateCount }) => (
        <CandidateResults
          key={pool.id}
          candidateCount={candidateCount}
          pool={pool}
          handleSubmit={handleSubmit}
        />
      ))}
    </div>
  ) : (
    <div
      data-h2-background="base(foreground)"
      data-h2-shadow="base(medium)"
      data-h2-margin="base(x.5, 0, 0, 0)"
      data-h2-padding="base(x1)"
      data-h2-border-left="base(x.5 solid primary)"
      data-h2-radius="base(0, s, s, 0)"
    >
      <Heading level="h4" size="h6" data-h2-margin="base(0)">
        {intl.formatMessage({
          defaultMessage: "We can still help!",
          id: "5U+V2Y",
          description:
            "Heading for helping user if no candidates matched the filters chosen.",
        })}
      </Heading>
      <p data-h2-margin="base(x.5 0)">
        {intl.formatMessage({
          defaultMessage:
            "We have not found any automatic matching candidates but our team can still help.",
          id: "ak4oel",
          description:
            "Text telling users they can still be helped regardless of search results",
        })}
      </p>
      <p data-h2-margin="base(x.5 0)">
        {intl.formatMessage({
          defaultMessage:
            "The Digital Community Management office is interested in helping you find the right talent.",
          id: "JUejJU",
          description:
            "Text telling users that Digital Community Management can still help them",
        })}
      </p>
      <p data-h2-margin="base(x.5 0)">
        {intl.formatMessage({
          defaultMessage:
            'Submit this request "as-is" and we\'ll get back to you.',
          id: "pvQVVh",
          description:
            "Instructions telling the user to submit a request even though there are no candidates",
        })}
      </p>

      <Separator
        orientation="horizontal"
        data-h2-margin="base(x1 0)"
        data-h2-background="base(black.30)"
      />

      <Button
        color="secondary"
        onClick={() =>
          handleSubmit(
            totalCandidateCount,
            null,
            selectedClassifications as SimpleClassification[],
          )
        }
      >
        {intl.formatMessage({
          defaultMessage: "Request candidates",
          id: "3BfvIy",
          description:
            "Button link message on search page that takes user to the request form.",
        })}
      </Button>
    </div>
  );
};

export interface SearchContainerProps {
  applicantFilter?: ApplicantFilterInput;
  classifications: SimpleClassification[];
  updatePending: boolean;
  pools: SimplePool[];
  poolCandidateResults?: CandidateSearchPoolResult[];
  skills?: Skill[];
  totalCandidateCount: number;
  onUpdateApplicantFilter: (applicantFilter: ApplicantFilterInput) => void;
  onSubmit: (
    candidateCount: number,
    poolId: string | null,
    selectedClassifications: SimpleClassification[],
  ) => Promise<void>;
}

const testId = (chunks: React.ReactNode) => (
  <span data-testid="candidateCount">{chunks}</span>
);

const SearchContainer = ({
  applicantFilter,
  classifications,
  updatePending,
  poolCandidateResults,
  pools,
  skills,
  totalCandidateCount,
  onUpdateApplicantFilter,
  onSubmit,
}: SearchContainerProps) => {
  const intl = useIntl();

  const operationalRequirementFilterCount =
    applicantFilter?.operationalRequirements?.length ?? 0;
  const locationPreferencesCount =
    applicantFilter?.locationPreferences?.length ?? 0;
  const educationSelection = applicantFilter?.hasDiploma;
  const workingLanguage = applicantFilter?.languageAbility;
  const employmentDuration = applicantFilter?.positionDuration;

  const selectedClassifications =
    applicantFilter?.qualifiedClassifications?.filter(notEmpty);
  const qualifiedStreamsCount =
    applicantFilter?.qualifiedStreams?.filter(notEmpty)?.length ?? 0;

  const equityFilters = applicantFilter?.equity;
  const equityFiltersArray = equityFilters
    ? Object.values(equityFilters)
    : null;
  const equityFiltersArrayTrue = equityFiltersArray
    ? equityFiltersArray.filter((equityField) => equityField === true)
    : null;
  const equityFiltersCount = equityFiltersArrayTrue
    ? equityFiltersArrayTrue.length
    : 0;

  const skillCount = applicantFilter?.skills?.length ?? 0;

  const searchRef = useRef<SearchFormRef>(null);

  // This seems to lead to unexpected behavior with submit button re-rendering
  // at the very end, in a way that confuses Cypress. Caution advised before
  // re-producing this pattern elsewhere.
  // See: https://github.com/GCTC-NTGC/gc-digital-talent/pull/4119#issuecomment-1271642887
  const tryHandleSubmit = async (
    candidateCount: number,
    poolId: string | null,
    classificationsToSubmit: SimpleClassification[],
  ) => {
    if (
      selectedClassifications?.length === 0 ||
      qualifiedStreamsCount === 0 ||
      locationPreferencesCount === 0
    ) {
      // Validate all fields, and focus on the first one that is invalid.
      searchRef.current?.triggerValidation(undefined, { shouldFocus: true });
    } else {
      onSubmit(candidateCount, poolId, classificationsToSubmit);
    }
  };

  return (
    <div data-h2-padding="base(0, 0, x3, 0)">
      <div data-h2-container="base(center, large, x1) p-tablet(center, large, x2)">
        <div data-h2-flex-grid="base(stretch, x3)">
          <div data-h2-flex-item="base(1of1) p-tablet(3of5)">
            <div>
              <h2
                data-h2-margin="base(x3, 0, x1, 0)"
                data-h2-color="base(black)"
                data-h2-font-weight="base(300)"
              >
                {intl.formatMessage({
                  defaultMessage: "How to use this tool",
                  id: "HvD7jI",
                  description:
                    "Heading displayed in the How To area of the hero section of the Search page.",
                })}
              </h2>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Use the filters below to specify your hiring needs. At any time you can look at the results located at the bottom of this page to see how many candidates match the requirements you have entered. When you are comfortable with the filters you have selected, click the Request candidates button to add more details and submit a request form.",
                  id: "AaoxNX",
                  description:
                    "Content displayed in the How To area of the hero section of the Search page.",
                })}
              </p>
            </div>
            <SearchForm
              classifications={classifications}
              skills={skills}
              pools={pools}
              onUpdateApplicantFilter={onUpdateApplicantFilter}
              ref={searchRef}
            />
          </div>
          <div
            data-h2-display="base(none) p-tablet(block)"
            data-h2-flex-item="base(1of1) p-tablet(2of5)"
          >
            <EstimatedCandidates
              candidateCount={totalCandidateCount}
              updatePending={updatePending}
            />
          </div>
        </div>
      </div>
      <div
        data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
        id="results"
      >
        <hr
          data-h2-margin="base(x3, 0, 0, 0)"
          data-h2-height="base(1px)"
          data-h2-background-color="base(gray)"
          data-h2-border="base(none)"
        />
        <div>
          <h3
            data-h2-text-align="base(center) p-tablet(left)"
            data-h2-font-size="base(h4, 1)"
            data-h2-font-weight="base(700)"
            data-h2-margin="base(x3, 0, x1, 0)"
          >
            {intl.formatMessage(
              {
                defaultMessage: `{totalCandidateCount, plural,
                  =0 {Results: <testId>{totalCandidateCount}</testId> matching candidates}
                  =1 {Results: <testId>{totalCandidateCount}</testId> matching candidate}
                  other {Results: <testId>{totalCandidateCount}</testId> matching candidates}
                }`,
                id: "eeWkWi",
                description:
                  "Heading for total matching candidates in results section of search page.",
              },
              {
                testId,
                totalCandidateCount,
              },
            )}
          </h3>
          <SearchFilterAdvice
            operationalRequirementFilterCount={
              operationalRequirementFilterCount
            }
            educationSelection={educationSelection}
            workingLanguage={workingLanguage}
            employmentDuration={employmentDuration}
            equityFiltersActive={equityFiltersCount}
            skillCount={skillCount}
          />
        </div>
        <div>
          <ResultsDisplay
            pending={updatePending}
            results={poolCandidateResults}
            handleSubmit={tryHandleSubmit}
            selectedClassifications={selectedClassifications}
            totalCandidateCount={totalCandidateCount}
          />
        </div>
      </div>
    </div>
  );
};

const SearchContainerApi = () => {
  const intl = useIntl();
  const location = useLocation();
  const { announce } = useAnnouncer();
  const state = location.state as LocationState;

  const navigate = useNavigate();
  // Fetches all data for the filters on the search form (eg. classifications, skills, etc.).
  const [
    {
      data: searchFormData,
      fetching: fetchingSearchFormData,
      error: searchFormDataError,
    },
  ] = useGetSearchFormDataAcrossAllPoolsQuery();
  const applicantFilterFromBrowserHistory = state?.applicantFilter;
  const [applicantFilter, setApplicantFilter] = React.useState<
    ApplicantFilterInput | undefined
  >(
    applicantFilterFromBrowserHistory || {
      pools: searchFormData?.publishedPools,
    },
  );

  // When pools first load, they should be added to the ApplicantFilter
  useEffect(() => {
    if (
      searchFormData?.publishedPools &&
      applicantFilterFromBrowserHistory === undefined
    ) {
      setApplicantFilter({
        pools: searchFormData?.publishedPools,
      });
    }
  }, [searchFormData?.publishedPools, applicantFilterFromBrowserHistory]);

  const queryArgs = useMemo(
    () => applicantFilterToQueryArgs(applicantFilter),
    [applicantFilter],
  );

  // The countApplicants query ignores the pool filter if it is an empty array, just like if it were undefined.
  // However, we want to treat an empty pool filter as resulting in zero candidates.
  // Therefore, we can skip the query and override the count results ourselves.
  const filterIncludesPools: boolean =
    notEmpty(applicantFilter) &&
    notEmpty(applicantFilter.pools) &&
    applicantFilter.pools.filter(notEmpty).length > 0;

  // Fetches the number of pool candidates by pool to display on pool cards AND
  // Fetches the total number of candidates, since some pool candidates will correspond to the same user.
  const [{ data: candidatesData, fetching: fetchingCandidates }] =
    useCountApplicantsAndCountPoolCandidatesByPoolQuery({
      variables: queryArgs,
      pause:
        fetchingSearchFormData || // The first submitted query should wait for pools to be loaded.
        !filterIncludesPools, // If filter does not include pools, we wil manually return 0 count.
    });

  const paths = useRoutes();

  const skills = unpackMaybes<Skill>(searchFormData?.skills);
  const pools = unpackMaybes<SimplePool>(searchFormData?.publishedPools);

  const availableClassifications = pools
    ?.flatMap((pool) => pool?.classifications)
    .filter(notEmpty);

  const ITClassifications = nonExecutiveITClassifications();
  const searchableClassifications = ITClassifications.filter(
    (classification) => {
      return availableClassifications?.some(
        (x) =>
          x?.group === classification?.group &&
          x?.level === classification?.level,
      );
    },
  );

  const totalCandidateCount =
    filterIncludesPools && candidatesData?.countApplicants !== undefined
      ? candidatesData.countApplicants
      : 0;
  const poolCandidateResults = filterIncludesPools
    ? candidatesData?.countPoolCandidatesByPool
    : [];

  /**
   * Announce the candidate count to users in a less verbose way
   *
   * Note: `announceCount.current > 3` is a magic number, our current candidate count is causing
   * a lot of re-runs for some reason (specifically 3 on initial loading)
   * and this prevents the announcer  repeating itself excessively
   */
  const announceCount = React.useRef<number>(0);
  React.useEffect(() => {
    if (applicantFilter && announceCount.current > 3 && !fetchingCandidates) {
      announce(
        intl.formatMessage(
          {
            defaultMessage: "{count} candidates meet your criteria.",
            id: "dwe1M+",
            description:
              "Message announced to assistive technology users when the estimated candidate count changes.",
          },
          {
            count: totalCandidateCount,
          },
        ),
      );
    }
    announceCount.current += 1;
  }, [
    totalCandidateCount,
    announce,
    applicantFilter,
    fetchingCandidates,
    intl,
  ]);

  const onSubmit = async (
    candidateCount: number,
    poolId: string | null,
    selectedClassifications: SimpleClassification[],
  ) => {
    const poolIds = poolId ? [{ id: poolId }] : [];
    navigate(paths.request(), {
      state: {
        applicantFilter: {
          ...applicantFilter,
          pools: poolIds,
        },
        candidateCount,
        selectedClassifications,
      },
    });
  };

  return (
    <Pending
      {...{ fetching: fetchingSearchFormData, error: searchFormDataError }}
    >
      <SearchContainer
        applicantFilter={applicantFilter}
        classifications={searchableClassifications}
        updatePending={fetchingCandidates}
        pools={pools}
        poolCandidateResults={poolCandidateResults}
        skills={skills}
        totalCandidateCount={totalCandidateCount}
        onUpdateApplicantFilter={setApplicantFilter}
        onSubmit={onSubmit}
      />
    </Pending>
  );
};

export const SearchContainerComponent = SearchContainer;
export default SearchContainerApi;
