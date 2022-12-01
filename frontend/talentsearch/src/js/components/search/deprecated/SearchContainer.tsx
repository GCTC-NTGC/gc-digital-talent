import React, { useRef, useState } from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import pick from "lodash/pick";

import { notEmpty } from "@common/helpers/util";
import { unpackMaybes } from "@common/helpers/formUtils";
import Pending from "@common/components/Pending";

import {
  Classification,
  CmoAsset,
  useGetSearchFormDataQuery,
  useCountPoolCandidatesQuery,
  CountPoolCandidatesQueryVariables,
  PoolCandidateFilterInput,
  Pool,
  Maybe,
} from "../../../api/generated";
import {
  DIGITAL_CAREERS_POOL_KEY,
  TALENTSEARCH_RECRUITMENT_EMAIL,
} from "../../../talentSearchConstants";
import EstimatedCandidates from "../EstimatedCandidates";
import { FormValues, SearchForm, SearchFormRef } from "./SearchForm";
import SearchFilterAdvice from "./SearchFilterAdvice";
import SearchPools from "../SearchPools";
import Spinner from "../../Spinner";
import useRoutes from "../../../hooks/useRoutes";

const testId = (chunks: React.ReactNode): React.ReactNode => (
  <span data-testid="candidateCount">{chunks}</span>
);

export interface SearchContainerProps {
  classifications: Classification[];
  cmoAssets: CmoAsset[];
  pool: Pick<Pool, "id" | "owner" | "name" | "description">;
  candidateCount: number;
  updatePending?: boolean;
  candidateFilter?: PoolCandidateFilterInput | undefined;
  updateCandidateFilter: (candidateFilter: PoolCandidateFilterInput) => void;
  updateInitialValues: (initialValues: FormValues) => void;
  handleSubmit: () => Promise<void>;
}

export const SearchContainer: React.FC<SearchContainerProps> = ({
  classifications,
  cmoAssets,
  pool,
  candidateCount,
  updatePending,
  candidateFilter,
  updateCandidateFilter,
  updateInitialValues,
  handleSubmit,
}) => {
  const intl = useIntl();

  const classificationFilterCount =
    candidateFilter?.expectedClassifications?.length ?? 0;
  const cmoAssetFilterCount = candidateFilter?.cmoAssets?.length ?? 0;
  const operationalRequirementFilterCount =
    candidateFilter?.operationalRequirements?.length ?? 0;
  const workRegionFilterCount =
    candidateFilter?.locationPreferences?.length ?? 0;
  const educationFilter = candidateFilter?.hasDiploma;
  const workingLanguage = candidateFilter?.languageAbility;

  const equityFilters = candidateFilter?.equity;
  const equityFiltersArray = equityFilters
    ? Object.values(equityFilters)
    : null;
  const equityFiltersArrayTrue = equityFiltersArray
    ? equityFiltersArray.filter((equityField) => equityField === true)
    : null;
  const equityFiltersCount = equityFiltersArrayTrue
    ? equityFiltersArrayTrue.length
    : 0;

  function a(chunks: React.ReactNode): React.ReactNode {
    return (
      <a
        href={`mailto:${TALENTSEARCH_RECRUITMENT_EMAIL}`}
        data-h2-font-weight="base(700)"
      >
        {chunks}
      </a>
    );
  }

  const searchRef = useRef<SearchFormRef>(null);

  const tryHandleSubmit = async () => {
    if (classificationFilterCount === 0 || workRegionFilterCount === 0) {
      // Validate all fields, and focus on the first one that is invalid.
      searchRef.current?.triggerValidation(undefined, { shouldFocus: true });
    } else {
      handleSubmit();
    }
  };

  function candidateResults() {
    return candidateCount > 0 ? (
      <div
        data-h2-background-color="base(dt-white)"
        data-h2-shadow="base(m)"
        data-h2-border="base(left, x1, solid, dt-secondary.light)"
        data-h2-margin="base(x.5, 0, 0, 0)"
        data-h2-radius="base(0, s, s, 0)"
      >
        <SearchPools
          candidateCount={candidateCount}
          pool={pool}
          handleSubmit={tryHandleSubmit}
        />
      </div>
    ) : (
      <div
        data-h2-shadow="base(m)"
        data-h2-margin="base(x.5, 0, 0, 0)"
        data-h2-padding="base(x1)"
        data-h2-border="base(left, x1, solid, dt-gray.dark)"
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
  }

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
              cmoAssets={cmoAssets}
              updateCandidateFilter={updateCandidateFilter}
              updateInitialValues={updateInitialValues}
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
                totalCandidateCount: candidateCount,
              },
            )}
          </h3>
          <SearchFilterAdvice
            cmoAssetFilterCount={cmoAssetFilterCount}
            operationalRequirementFilterCount={
              operationalRequirementFilterCount
            }
            workingLanguage={workingLanguage}
            educationFilter={educationFilter}
            equityFiltersActive={equityFiltersCount}
          />
        </div>
        <div>{!updatePending ? candidateResults() : <Spinner />}</div>
      </div>
    </div>
  );
};

const candidateFilterToQueryArgs = (
  filter: PoolCandidateFilterInput | undefined,
  poolId: string | undefined,
): CountPoolCandidatesQueryVariables => {
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
        equity: {
          hasDisability: filter?.equity?.hasDisability,
          isIndigenous: filter?.equity?.isIndigenous,
          isVisibleMinority: filter?.equity?.isVisibleMinority,
          isWoman: filter?.equity?.isWoman,
        },
        expectedClassifications: filter?.expectedClassifications
          ? pickMap(filter.expectedClassifications, ["group", "level"])
          : [],
        cmoAssets: filter?.cmoAssets ? pickMap(filter.cmoAssets, "key") : [],
        pools: poolId ? [{ id: poolId }] : pickMap(filter?.pools, "id"),
      },
    };
  return {};
};

export const SearchContainerApi: React.FC = () => {
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<FormValues | null>(null);
  const [{ data, fetching, error }] = useGetSearchFormDataQuery({
    variables: { poolKey: DIGITAL_CAREERS_POOL_KEY },
  });
  const pool = data?.poolByKey as Pool;

  const [candidateFilter, setCandidateFilter] = useState<
    PoolCandidateFilterInput | undefined
  >(undefined);

  const [{ data: countData, fetching: countFetching }] =
    useCountPoolCandidatesQuery({
      variables: candidateFilterToQueryArgs(candidateFilter, pool?.id),
    });

  const candidateCount = countData?.countPoolCandidates ?? 0;

  const paths = useRoutes();
  const onSubmit = async () => {
    // pool ID is not in the form so it must be added manually
    if (candidateFilter && pool) candidateFilter.pools = [{ id: pool.id }];

    return navigate(paths.request(), {
      state: {
        candidateFilter,
        candidateCount,
        initialValues,
      },
    });
  };

  return (
    <Pending {...{ fetching, error }}>
      <SearchContainer
        classifications={pool?.classifications?.filter(notEmpty) ?? []}
        cmoAssets={pool?.assetCriteria?.filter(notEmpty) ?? []}
        pool={pool}
        candidateFilter={candidateFilter}
        candidateCount={candidateCount}
        updatePending={countFetching}
        updateCandidateFilter={setCandidateFilter}
        updateInitialValues={setInitialValues}
        handleSubmit={onSubmit}
      />
    </Pending>
  );
};
