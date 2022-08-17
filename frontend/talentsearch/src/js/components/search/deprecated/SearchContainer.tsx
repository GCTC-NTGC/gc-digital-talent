import React, { useRef, useState } from "react";
import { notEmpty } from "@common/helpers/util";
import { useIntl } from "react-intl";
import pick from "lodash/pick";
import { pushToStateThenNavigate } from "@common/helpers/router";
import { unpackMaybes } from "@common/helpers/formUtils";
import {
  Classification,
  CmoAsset,
  useGetSearchFormDataQuery,
  useCountPoolCandidatesQuery,
  CountPoolCandidatesQueryVariables,
  PoolCandidateFilterInput,
  Pool,
  UserPublicProfile,
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
import { useTalentSearchRoutes } from "../../../talentSearchRoutes";

const testId = (text: React.ReactNode) => (
  <span data-testid="candidateCount">{text}</span>
);

export interface SearchContainerProps {
  classifications: Classification[];
  cmoAssets: CmoAsset[];
  pool?: Pick<Pool, "name" | "description">;
  poolOwner?: Pick<UserPublicProfile, "firstName" | "lastName" | "email">;
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
  poolOwner,
  candidateCount,
  updatePending,
  candidateFilter,
  updateCandidateFilter,
  updateInitialValues,
  handleSubmit,
}) => {
  const intl = useIntl();

  const classificationFilterCount =
    candidateFilter?.classifications?.length ?? 0;
  const cmoAssetFilterCount = candidateFilter?.cmoAssets?.length ?? 0;
  const operationalRequirementFilterCount =
    candidateFilter?.operationalRequirements?.length ?? 0;

  function a(msg: string) {
    return (
      <a
        href={`mailto:${TALENTSEARCH_RECRUITMENT_EMAIL}`}
        data-h2-font-weight="base(700)"
      >
        {msg}
      </a>
    );
  }

  const searchRef = useRef<SearchFormRef>(null);

  const tryHandleSubmit = async () => {
    if (classificationFilterCount === 0) {
      // Validate all fields, and focus on the first one that is invalid.
      searchRef.current?.triggerValidation(undefined, { shouldFocus: true });
    } else {
      handleSubmit();
    }
  };

  function candidateResults() {
    return candidateCount > 0 ? (
      <div
        data-h2-shadow="base(m)"
        data-h2-border="base(left, x1, solid, dt-secondary.light)"
        data-h2-margin="base(x.5, 0, x1, 0)"
        data-h2-flex-grid="base(center, 0, x3)"
      >
        <SearchPools
          candidateCount={candidateCount}
          pool={pool}
          poolOwner={poolOwner}
          handleSubmit={tryHandleSubmit}
        />
      </div>
    ) : (
      <div
        data-h2-shadow="base(m)"
        data-h2-margin="base(x.5, 0, x1, 0)"
        data-h2-padding="base(x.25, 0, x.25, x.5)"
        data-h2-border="base(left, x1, solid, dt-gray.dark)"
      >
        <p>
          {intl.formatMessage({
            defaultMessage: "We can still help!",
            description:
              "Heading for helping user if no candidates matched the filters chosen.",
          })}
        </p>
        <p
          data-h2-margin="base(x.125, 0, 0, 0)"
          data-h2-font-size="base(caption)"
        >
          {intl.formatMessage(
            {
              defaultMessage:
                "If there are no matching candidates <a>Get in touch!</a>",
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
    <div data-h2-container="base(center, large, x1) p-tablet(center, large, x2)">
      <div
        data-h2-position="base(relative)"
        data-h2-flex-grid="base(flex-start, 0, 0)"
      >
        <div data-h2-flex-item="base(1of1) p-tablet(2of3)">
          <div>
            <h2 data-h2-color="base(dt-black)" data-h2-font-weight="base(300)">
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
            cmoAssets={cmoAssets}
            updateCandidateFilter={updateCandidateFilter}
            updateInitialValues={updateInitialValues}
            ref={searchRef}
          />
        </div>
        <div
          data-h2-flex-item="base(1of1) p-tablet(1of3)"
          data-h2-visibility="base(hidden) p-tablet(visible)"
          data-h2-position="base(sticky)"
          style={{ top: "3rem", right: "0" }}
        >
          <EstimatedCandidates
            candidateCount={candidateCount}
            updatePending={updatePending}
          />
        </div>
      </div>
      <div data-h2-container="base(center, large, 0)">
        <div>
          <h3
            data-h2-font-size="base(h4)"
            data-h2-font-weight="base(700)"
            data-h2-margin="base(0, 0, x1, 0)"
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
            cmoAssetFilterCount={cmoAssetFilterCount}
            operationalRequirementFilterCount={
              operationalRequirementFilterCount
            }
          />
        </div>
        <div data-h2-flex-item="base(1of1)" style={{ paddingTop: "0" }}>
          {!updatePending ? candidateResults() : <Spinner />}
        </div>
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
        classifications: filter?.classifications
          ? pickMap(filter.classifications, ["group", "level"])
          : [],
        cmoAssets: filter?.cmoAssets ? pickMap(filter.cmoAssets, "key") : [],
        pools: poolId ? [{ id: poolId }] : pickMap(filter?.pools, "id"),
      },
    };
  return {};
};

export const SearchContainerApi: React.FC = () => {
  const [initialValues, setInitialValues] = useState<FormValues | null>(null);
  const [{ data }] = useGetSearchFormDataQuery({
    variables: { poolKey: DIGITAL_CAREERS_POOL_KEY },
  });
  const pool = data?.poolByKey;

  const [candidateFilter, setCandidateFilter] = useState<
    PoolCandidateFilterInput | undefined
  >(undefined);

  const [{ data: countData, fetching: countFetching }] =
    useCountPoolCandidatesQuery({
      variables: candidateFilterToQueryArgs(candidateFilter, pool?.id),
    });

  const candidateCount = countData?.countPoolCandidates ?? 0;

  const paths = useTalentSearchRoutes();
  const onSubmit = async () => {
    // pool ID is not in the form so it must be added manually
    if (candidateFilter && pool) candidateFilter.pools = [{ id: pool.id }];

    return pushToStateThenNavigate(paths.request(), {
      candidateFilter,
      candidateCount,
      initialValues,
    });
  };

  return (
    <SearchContainer
      classifications={pool?.classifications?.filter(notEmpty) ?? []}
      cmoAssets={pool?.assetCriteria?.filter(notEmpty) ?? []}
      pool={pool ?? undefined}
      poolOwner={pool?.owner ?? undefined}
      candidateFilter={candidateFilter}
      candidateCount={candidateCount}
      updatePending={countFetching}
      updateCandidateFilter={setCandidateFilter}
      updateInitialValues={setInitialValues}
      handleSubmit={onSubmit}
    />
  );
};
