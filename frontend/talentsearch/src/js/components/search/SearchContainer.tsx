import React from "react";
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
import SearchForm from "./SearchForm";
import { useTalentSearchRoutes } from "../../talentSearchRoutes";
import { DIGITAL_CAREERS_POOL_KEY } from "../../talentSearchConstants";

const candidateFilterToQueryArgs = (
  filter: ApplicantFilterInput | undefined,
  poolId: string | undefined,
): CountApplicantsQueryVariables => {
  /* We must pick only the fields belonging to PoolCandidateFilterInput, because its possible
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
  candidateFilter?: ApplicantFilterInput | undefined;
  onUpdateCandidateFilter: (candidateFilter: ApplicantFilterInput) => void;
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
  candidateFilter,
  onUpdateCandidateFilter,
  onSubmit,
}) => {
  const intl = useIntl();

  const classificationFilterCount =
    candidateFilter?.expectedClassifications?.length ?? 0;
  const operationalRequirementFilterCount =
    candidateFilter?.operationalRequirements?.length ?? 0;

  return (
    <>
      <div
        data-h2-position="b(relative)"
        data-h2-flex-grid="b(top, contained, flush, none)"
        data-h2-container="b(center, l)"
      >
        <div data-h2-flex-item="b(1of1) s(2of3)">
          <div data-h2-padding="b(right, l)">
            <h2
              data-h2-font-color="b(black)"
              data-h2-font-weight="b(300)"
              data-h2-margin="b(all, none)"
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
            onUpdateCandidateFilter={onUpdateCandidateFilter}
          />
        </div>
        <div
          data-h2-flex-item="b(1of1) s(1of3)"
          data-h2-visibility="b(hidden) s(visible)"
          data-h2-position="b(sticky)"
          style={{ top: "3rem", right: "0" }}
        >
          <EstimatedCandidates
            candidateCount={candidateCount}
            updatePending={updatePending}
          />
        </div>
      </div>
      <div data-h2-container="b(center, l)">
        <div>
          <h3
            data-h2-font-size="b(h4)"
            data-h2-font-weight="b(700)"
            data-h2-margin="b(bottom, m)"
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
        <div data-h2-flex-item="b(1of1)" style={{ paddingTop: "0" }}>
          {!updatePending ? (
            <CandidateResults
              candidateCount={candidateCount}
              pool={pool}
              poolOwner={poolOwner}
              handleSubmit={onSubmit}
            />
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    </>
  );
};

const SearchContainerApi: React.FC = () => {
  const [{ data }] = useGetSearchFormDataQuery({
    variables: { poolKey: DIGITAL_CAREERS_POOL_KEY },
  });
  const pool = data?.poolByKey;
  const skills = data?.skills;

  const [candidateFilter, setCandidateFilter] = React.useState<
    ApplicantFilterInput | undefined
  >(undefined);

  const [{ data: countData, fetching: countFetching }] =
    useCountApplicantsQuery({
      variables: candidateFilterToQueryArgs(candidateFilter, pool?.id),
    });

  const candidateCount = countData?.countApplicants ?? 0;

  const paths = useTalentSearchRoutes();
  const onSubmit = async () => {
    // pool ID is not in the form so it must be added manually
    if (candidateFilter && pool) {
      candidateFilter.pools = [{ id: pool.id }];
    }

    return pushToStateThenNavigate(paths.request(), {
      candidateFilter,
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
      candidateFilter={candidateFilter}
      candidateCount={candidateCount}
      updatePending={countFetching}
      onUpdateCandidateFilter={setCandidateFilter}
      onSubmit={onSubmit}
    />
  );
};

export default SearchContainerApi;
