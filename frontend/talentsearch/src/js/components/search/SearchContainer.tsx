import React, { useEffect, useMemo, useRef } from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import pick from "lodash/pick";

import { unpackMaybes } from "@common/helpers/formUtils";
import Pending from "@common/components/Pending";
import NonExecutiveITClassifications from "@common/constants/NonExecutiveITClassifications";
import { notEmpty } from "@common/helpers/util";
import {
  CountApplicantsQueryVariables,
  Maybe,
  ApplicantFilterInput,
  Skill,
  useGetSearchFormDataAcrossAllPoolsQuery,
  CandidateSearchPoolResult,
  useCountApplicantsAndCountPoolCandidatesByPoolQuery,
} from "../../api/generated";
import EstimatedCandidates from "./EstimatedCandidates";
import SearchFilterAdvice from "./SearchFilterAdvice";
import Spinner from "../Spinner";
import CandidateResults from "./CandidateResults";
import SearchForm, { FormValues, SearchFormRef } from "./SearchForm";
import useRoutes from "../../hooks/useRoutes";
import { SimpleClassification, SimplePool } from "../../types/poolUtils";
import { TALENTSEARCH_RECRUITMENT_EMAIL } from "../../talentSearchConstants";

export type BrowserHistoryState = {
  applicantFilter?: ApplicantFilterInput;
  candidateCount: number;
  initialValues?: FormValues;
  selectedClassifications?: SimpleClassification[];
};

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
          : [],
        // TODO: pickMap the skills array as well?
        // For now, while most candidates in production do not have skills populated, we want to ignore skill filters when showing a count to managers.
        // TODO: Add skills back in when most candidates in production have populated skills.
        skills: undefined,

        // Override the filter's pool if one is provided separately.
        pools: poolId ? [{ id: poolId }] : pickMap(filter?.pools, "id"),
      },
    };
  return {};
};

function a(chunks: React.ReactNode) {
  return (
    <a
      href={`mailto:${TALENTSEARCH_RECRUITMENT_EMAIL}`}
      data-h2-font-weight="base(700)"
    >
      {chunks}
    </a>
  );
}

interface ResultsDisplayProps {
  pending: boolean;
  results?: Array<CandidateSearchPoolResult>;
  handleSubmit: (
    candidateCount: number,
    poolId: string,
    selectedClassifications: SimpleClassification[],
  ) => Promise<void>;
}

const ResultsDisplay = ({
  pending,
  results,
  handleSubmit,
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
      data-h2-shadow="base(m)"
      data-h2-margin="base(x.5, 0, 0, 0)"
      data-h2-padding="base(x1)"
      data-h2-border-left="base(x1 solid dt-gray.dark)"
    >
      <p>
        {intl.formatMessage({
          defaultMessage: "We can still help!",
          id: "5U+V2Y",
          description:
            "Heading for helping user if no candidates matched the filters chosen.",
        })}
      </p>
      <p data-h2-margin="base(x.5, 0, 0, 0)">
        {intl.formatMessage(
          {
            defaultMessage:
              "If there are no matching candidates <a>Get in touch!</a>",
            id: "+ZXZj+",
            description:
              "Message for helping user if no candidates matched the filters chosen.",
          },
          {
            a,
          },
        )}
      </p>
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
    poolId: string,
    selectedClassifications: SimpleClassification[],
  ) => Promise<void>;
}

const testId = (chunks: React.ReactNode) => (
  <span data-testid="candidateCount">{chunks}</span>
);

export const SearchContainer: React.FC<SearchContainerProps> = ({
  applicantFilter,
  classifications,
  updatePending,
  poolCandidateResults,
  pools,
  skills,
  totalCandidateCount,
  onUpdateApplicantFilter,
  onSubmit,
}) => {
  const intl = useIntl();

  const poolClassificationFilterCount = applicantFilter?.pools?.length ?? 0;
  const operationalRequirementFilterCount =
    applicantFilter?.operationalRequirements?.length ?? 0;
  const locationPreferencesCount =
    applicantFilter?.locationPreferences?.length ?? 0;
  const educationSelection = applicantFilter?.hasDiploma;
  const workingLanguage = applicantFilter?.languageAbility;
  const employmentDuration = applicantFilter?.positionDuration;

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
    poolId: string,
    selectedClassifications: SimpleClassification[],
  ) => {
    if (poolClassificationFilterCount === 0 || locationPreferencesCount === 0) {
      // Validate all fields, and focus on the first one that is invalid.
      searchRef.current?.triggerValidation(undefined, { shouldFocus: true });
    } else {
      onSubmit(candidateCount, poolId, selectedClassifications);
    }
  };

  return (
    <div data-h2-padding="base(0, 0, x3, 0)">
      <div data-h2-container="base(center, medium, x1) p-tablet(center, medium, x2)">
        <div data-h2-flex-grid="base(stretch, x3)">
          <div data-h2-flex-item="base(1of1) p-tablet(3of5)">
            <div>
              <h2
                data-h2-margin="base(x3, 0, x1, 0)"
                data-h2-color="base(dt-black)"
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
                    "Use the filters below to specify your hiring needs. At any time you can look at the results located at the bottom of this page to see how many candidates match the requirements you have entered. When you are comfortable with the filters you have selected, click the Request Candidates button to add more details and submit a request form.",
                  id: "Tg8a57",
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
      <div data-h2-container="base(center, medium, x1) p-tablet(center, medium, x2)">
        <hr
          data-h2-margin="base(x3, 0, 0, 0)"
          data-h2-height="base(1px)"
          data-h2-background-color="base(dt-gray)"
          data-h2-border="base(none)"
        />
        <div>
          <h3
            data-h2-text-align="base(center) p-tablet(left)"
            data-h2-font-size="base(h4, 1)"
            id="results"
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
          />
        </div>
      </div>
    </div>
  );
};

const SearchContainerApi = () => {
  const navigate = useNavigate();
  // Fetches all data for the filters on the search form (eg. classifications, skills, etc.).
  const [
    {
      data: searchFormData,
      fetching: fetchingSearchFormData,
      error: searchFormDataError,
    },
  ] = useGetSearchFormDataAcrossAllPoolsQuery();

  const [applicantFilter, setApplicantFilter] = React.useState<
    ApplicantFilterInput | undefined
  >();

  // When pools first load, they should be added to the ApplicantFilter
  useEffect(() => {
    if (searchFormData?.publishedPoolAdvertisements) {
      setApplicantFilter({
        pools: searchFormData?.publishedPoolAdvertisements,
      });
    }
  }, [searchFormData?.publishedPoolAdvertisements]);

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
  const onSubmit = async (
    candidateCount: number,
    poolId: string,
    selectedClassifications: SimpleClassification[],
  ) => {
    navigate(paths.request(), {
      state: {
        applicantFilter: {
          ...applicantFilter,
          pools: [{ id: poolId }],
        },
        candidateCount,
        selectedClassifications,
      },
    });
  };

  const skills = unpackMaybes<Skill>(searchFormData?.skills);
  const pools = unpackMaybes<SimplePool>(
    searchFormData?.publishedPoolAdvertisements,
  );

  const availableClassifications = pools
    ?.flatMap((pool) => pool?.classifications)
    .filter(notEmpty);

  const ITClassifications = NonExecutiveITClassifications();
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

export default SearchContainerApi;
