import React, { useRef } from "react";
import { useIntl } from "react-intl";

import { pushToStateThenNavigate } from "@common/helpers/router";
import { notEmpty } from "@common/helpers/util";
import pick from "lodash/pick";
import { unpackMaybes } from "@common/helpers/formUtils";
import {
  Classification,
  CountApplicantsQueryVariables,
  Maybe,
  Pool,
  ApplicantFilterInput,
  Skill,
  useCountApplicantsQuery,
  useGetSearchFormDataQuery,
  UserPublicProfile,
} from "../../api/generated";
import EstimatedCandidates from "./EstimatedCandidates";
import SearchFilterAdvice from "./SearchFilterAdvice";
import Spinner from "../Spinner";
import CandidateResults from "./CandidateResults";
import SearchForm, { SearchFormRef } from "./SearchForm";
import { useTalentSearchRoutes } from "../../talentSearchRoutes";
import { DIGITAL_CAREERS_POOL_KEY } from "../../talentSearchConstants";

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
  classifications: Classification[];
  pool?: Pick<Pool, "name" | "description">;
  poolOwner?: Pick<UserPublicProfile, "firstName" | "lastName" | "email">;
  skills?: Skill[];
  candidateCount: number;
  updatePending?: boolean;
  applicantFilter?: ApplicantFilterInput;
  onUpdateApplicantFilter: (applicantFilter: ApplicantFilterInput) => void;
  onSubmit: () => Promise<void>;
}

const testId = (msg: string) => <span data-testid="candidateCount">{msg}</span>;

export const SearchContainer: React.FC<SearchContainerProps> = ({
  classifications,
  pool,
  poolOwner,
  skills,
  candidateCount,
  updatePending,
  applicantFilter,
  onUpdateApplicantFilter,
  onSubmit,
}) => {
  const intl = useIntl();

  const classificationFilterCount =
    applicantFilter?.expectedClassifications?.length ?? 0;
  const operationalRequirementFilterCount =
    applicantFilter?.operationalRequirements?.length ?? 0;

  const searchRef = useRef<SearchFormRef>(null);

  const tryHandleSubmit = async () => {
    if (classificationFilterCount === 0) {
      // Validate all fields, and focus on the first one that is invalid.
      searchRef.current?.triggerValidation(undefined, { shouldFocus: true });
    } else {
      onSubmit();
    }
  };

  return (
    <div
      data-h2-background-color="base(dt-gray.15)"
      data-h2-padding="base(0, 0, x3, 0)"
    >
      <div data-h2-container="base(center, medium, x1) p-tablet(center, medium, x2)">
        <div data-h2-flex-grid="base(stretch, 0, x3)">
          <div data-h2-flex-item="base(1of1) p-tablet(3of5)">
            <div>
              <h2
                data-h2-margin="base(x3, 0, x1, 0)"
                data-h2-color="base(dt-black)"
                data-h2-font-weight="base(300)"
              >
                {intl.formatMessage({
                defaultMessage: "How to use this tool",
                description:
                  "Heading displayed in the How To area of the hero section of the Search page.",
              })}
              </h2>
              <p>
              {intl.formatMessage({
                defaultMessage:
                  "Use the filters below to specify your hiring needs. At any time you can look at the results located at the bottom of this page to see how many candidates match the requirements you have entered. When you are comfortable with the filters you have selected, click the Request Candidates button to add more details and submit a request form.",
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
              candidateCount={candidateCount}
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
                defaultMessage:
                  "Results: <primary><testId>{candidateCount}</testId></primary> matching candidates",
                description:
                  "Heading for total matching candidates in results section of search page.",
              },
              {
                testId,
                candidateCount,
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
          {!updatePending ? (
            <CandidateResults
              candidateCount={candidateCount}
              pool={pool}
              poolOwner={poolOwner}
              handleSubmit={tryHandleSubmit}
            />
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    </div>
  );
};

const SearchContainerApi: React.FC = () => {
  const [{ data }] = useGetSearchFormDataQuery({
    variables: { poolKey: DIGITAL_CAREERS_POOL_KEY },
  });
  const pool = data?.poolByKey;
  const skills = data?.skills;

  const [applicantFilter, setApplicantFilter] = React.useState<
    ApplicantFilterInput | undefined
  >(undefined);

  const [{ data: countData, fetching: countFetching }] =
    useCountApplicantsQuery({
      variables: applicantFilterToQueryArgs(applicantFilter, pool?.id),
    });

  const candidateCount = countData?.countApplicants ?? 0;

  const paths = useTalentSearchRoutes();
  const onSubmit = async () => {
    // pool ID is not in the form so it must be added manually
    if (applicantFilter && pool) {
      applicantFilter.pools = [{ id: pool.id }];
    }

    return pushToStateThenNavigate(paths.request(), {
      applicantFilter,
      candidateCount,
      initialValues: null,
    });
  };

  return (
    <SearchContainer
      classifications={pool?.classifications?.filter(notEmpty) ?? []}
      pool={pool ?? undefined}
      skills={skills as Skill[]}
      poolOwner={pool?.owner ?? undefined}
      applicantFilter={applicantFilter}
      candidateCount={candidateCount}
      updatePending={countFetching}
      onUpdateApplicantFilter={setApplicantFilter}
      onSubmit={onSubmit}
    />
  );
};

export default SearchContainerApi;
