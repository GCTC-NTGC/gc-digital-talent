import React, { useRef } from "react";
import { useIntl } from "react-intl";

import { pushToStateThenNavigate } from "@common/helpers/router";
import pick from "lodash/pick";
import { unpackMaybes } from "@common/helpers/formUtils";
import Pending from "@common/components/Pending";
import NonExecutiveITClassifications from "@common/constants/NonExecutiveITClassifications";
import {
  Classification,
  CountApplicantsQueryVariables,
  Maybe,
  Pool,
  ApplicantFilterInput,
  Skill,
  useGetSearchFormDataAcrossAllPoolsQuery,
  useCountPoolCandidatesByPoolQuery,
  CandidateSearchPoolResult,
} from "../../api/generated";
import EstimatedCandidates from "./EstimatedCandidates";
import SearchFilterAdvice from "./SearchFilterAdvice";
import Spinner from "../Spinner";
import CandidateResults from "./CandidateResults";
import SearchForm, { SearchFormRef } from "./SearchForm";
import { useTalentSearchRoutes } from "../../talentSearchRoutes";

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
        // TODO: does recreating the equity object serve any purpose?
        equity: {
          hasDisability: filter?.equity?.hasDisability,
          isIndigenous: filter?.equity?.isIndigenous,
          isVisibleMinority: filter?.equity?.isVisibleMinority,
          isWoman: filter?.equity?.isWoman,
        },
        expectedClassifications: filter?.expectedClassifications
          ? pickMap(filter.expectedClassifications, ["group", "level"])
          : [],
        // TODO: pickMap the skills array as well?

        // Override the filter's pool if one is provided separately.
        pools: poolId ? [{ id: poolId }] : pickMap(filter?.pools, "id"),
      },
    };
  return {};
};

export interface SearchContainerProps {
  classifications: Pick<Classification, "group" | "level">[];
  poolCandidateResults?: CandidateSearchPoolResult[];
  skills?: Skill[];
  fetchingCandidateCount?: boolean;
  applicantFilter?: ApplicantFilterInput;
  onUpdateApplicantFilter: (applicantFilter: ApplicantFilterInput) => void;
  onSubmit: (candidateCount: number) => Promise<void>;
}

const testId = (chunks: React.ReactNode): React.ReactNode => (
  <span data-testid="candidateCount">{chunks}</span>
);

export const SearchContainer: React.FC<SearchContainerProps> = ({
  classifications,
  poolCandidateResults,
  skills,
  fetchingCandidateCount,
  applicantFilter,
  onUpdateApplicantFilter,
  onSubmit,
}) => {
  const intl = useIntl();

  const classificationFilterCount =
    applicantFilter?.expectedClassifications?.length ?? 0;
  const operationalRequirementFilterCount =
    applicantFilter?.operationalRequirements?.length ?? 0;
  const locationPreferencesCount =
    applicantFilter?.locationPreferences?.length ?? 0;

  const searchRef = useRef<SearchFormRef>(null);

  // This seems to lead to unexpected behavior with submit button re-rendering
  // at the very end, in a way that confuses Cypress. Caution advised before
  // re-producing this pattern elsewhere.
  // See: https://github.com/GCTC-NTGC/gc-digital-talent/pull/4119#issuecomment-1271642887
  const tryHandleSubmit = async (candidateCount: number) => {
    if (classificationFilterCount === 0 || locationPreferencesCount === 0) {
      // Validate all fields, and focus on the first one that is invalid.
      searchRef.current?.triggerValidation(undefined, { shouldFocus: true });
    } else {
      onSubmit(candidateCount);
    }
  };

  const totalCandidateCount =
    poolCandidateResults?.reduce(
      (previousValue, currentValue) =>
        previousValue + currentValue.candidateCount,
      0,
    ) || 0;

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
              updatePending={fetchingCandidateCount}
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
            classificationFilterCount={classificationFilterCount}
            operationalRequirementFilterCount={
              operationalRequirementFilterCount
            }
          />
        </div>
        <div>
          {!fetchingCandidateCount ? (
            <div>
              {poolCandidateResults?.map(({ pool, candidateCount }) => (
                <CandidateResults
                  key={pool.id}
                  candidateCount={candidateCount}
                  pool={pool}
                  handleSubmit={tryHandleSubmit}
                />
              ))}
            </div>
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    </div>
  );
};

const SearchContainerApi: React.FC = () => {
  const [
    {
      data: searchFormData,
      fetching: fetchingSearchFormData,
      error: searchFormDataError,
    },
  ] = useGetSearchFormDataAcrossAllPoolsQuery();
  const skills = searchFormData?.skills as Skill[];
  const pools = searchFormData?.pools as Pool[];

  const [applicantFilter, setApplicantFilter] = React.useState<
    ApplicantFilterInput | undefined
  >({ pools });
  const [{ data: candidateCountData, fetching: fetchingCandidateCount }] =
    useCountPoolCandidatesByPoolQuery({
      variables: applicantFilterToQueryArgs(applicantFilter),
    });

  const paths = useTalentSearchRoutes();
  const onSubmit = async (candidateCount: number) => {
    return pushToStateThenNavigate<{
      applicantFilter?: ApplicantFilterInput;
      candidateCount: number;
      initialValues?: ApplicantFilterInput;
    }>(paths.request(), {
      applicantFilter,
      candidateCount,
      initialValues: {},
    });
  };

  return (
    <Pending
      {...{ fetching: fetchingSearchFormData, error: searchFormDataError }}
    >
      <SearchContainer
        classifications={NonExecutiveITClassifications()}
        skills={skills}
        applicantFilter={applicantFilter}
        poolCandidateResults={candidateCountData?.countPoolCandidatesByPool}
        fetchingCandidateCount={fetchingCandidateCount}
        onUpdateApplicantFilter={setApplicantFilter}
        onSubmit={onSubmit}
      />
    </Pending>
  );
};

export default SearchContainerApi;
