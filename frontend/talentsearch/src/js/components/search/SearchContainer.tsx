import React, { useState } from "react";
import { notEmpty } from "@common/helpers/util";
import { useIntl } from "react-intl";
import pick from "lodash/pick";
import { pushToStateThenNavigate } from "@common/helpers/router";
import {
  Classification,
  CmoAsset,
  useGetSearchFormDataQuery,
  useCountPoolCandidatesQuery,
  CountPoolCandidatesQueryVariables,
  PoolCandidateFilterInput,
  Pool,
  UserPublicProfile,
  KeyFilterInput,
  PoolFilterInput,
  ClassificationFilterInput,
  Maybe,
} from "../../api/generated";
import {
  DIGITAL_CAREERS_POOL_KEY,
  TALENTSEARCH_RECRUITMENT_EMAIL,
} from "../../talentSearchConstants";
import EstimatedCandidates from "./EstimatedCandidates";
import { FormValues, SearchForm } from "./SearchForm";
import SearchFilterAdvice from "./SearchFilterAdvice";
import SearchPools from "./SearchPools";
import Spinner from "../Spinner";
import { useTalentSearchRoutes } from "../../talentSearchRoutes";

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

  function span(msg: string) {
    return (
      <span data-h2-color="b(dt-primary)" data-testid="candidateCount">
        {msg}
      </span>
    );
  }

  function a(msg: string) {
    return (
      <a
        href={`mailto:${TALENTSEARCH_RECRUITMENT_EMAIL}`}
        data-h2-font-weight="b(700)"
      >
        {msg}
      </a>
    );
  }

  function candidateResults() {
    return candidateCount > 0 ? (
      <div data-h2-flex-item="b(1of1)">
        <div
          data-h2-shadow="b(l)"
          data-h2-height="b(100%)"
          data-h2-overflow="b(hidden, all)"
          data-h2-radius="b(0, 10px, 10px, 0)"
          data-h2-border="b(left, 1rem, solid, light.dt-secondary)"
        >
          <SearchPools
            candidateCount={candidateCount}
            pool={pool}
            poolOwner={poolOwner}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
    ) : (
      <div data-h2-flex-item="b(1of1)">
        <div
          data-h2-shadow="b(l)"
          data-h2-height="b(100%)"
          data-h2-overflow="b(hidden, all)"
          data-h2-radius="b(0, 10px, 10px, 0)"
          data-h2-border="b(left, 1rem, solid, dark.dt-gray)"
        >
          <div data-h2-padding="b(x1)">
            <p data-h2-font-weight="b(700)">
              {intl.formatMessage({
                defaultMessage: "We can still help!",
                description:
                  "Heading for helping user if no candidates matched the filters chosen.",
              })}
            </p>
            <p data-h2-margin="b(x.5, 0, 0, 0)">
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
        </div>
      </div>
    );
  }

  return (
    <div data-h2-container="b(center, medium, x1) p-tablet(center, medium, x2)">
      <div data-h2-flex-grid="b(flex-start, 0, x1) p-tablet(stretch, 0, x2) l-tablet(stretch, 0, x4) desktop(stretch, 0, x5)">
        <div data-h2-flex-item="b(1of1) p-tablet(3of5)">
          <h2 data-h2-color="b(dt-black)" data-h2-margin="b(x3, 0, x1, 0)">
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
          <SearchForm
            classifications={classifications}
            cmoAssets={cmoAssets}
            updateCandidateFilter={updateCandidateFilter}
            updateInitialValues={updateInitialValues}
          />
        </div>
        <div
          data-h2-display="b(none) p-tablet(block)"
          data-h2-flex-item="b(1of1) p-tablet(2of5)"
        >
          <div
            data-h2-height="b(100%)"
            data-h2-padding="b(x1, 0, 0, 0) p-tablet(x3, 0, 0, 0)"
          >
            <EstimatedCandidates
              candidateCount={candidateCount}
              updatePending={updatePending}
            />
          </div>
        </div>
      </div>
      <div>
        <h3
          data-h2-font-size="b(h4, 1.3)"
          data-h2-font-weight="b(700)"
          data-h2-margin="b(x3, 0, x1, 0)"
        >
          {intl.formatMessage(
            {
              defaultMessage:
                "Results: <span>{candidateCount}</span> matching candidates",
              description:
                "Heading for total matching candidates in results section of search page.",
            },
            {
              span,
              candidateCount,
            },
          )}
        </h3>
        <SearchFilterAdvice
          classificationFilterCount={classificationFilterCount}
          cmoAssetFilterCount={cmoAssetFilterCount}
          operationalRequirementFilterCount={operationalRequirementFilterCount}
        />
      </div>
      <div data-h2-flex-item="b(1of1)">
        <div data-h2-padding="b(0, 0, x3, 0)">
          <div data-h2-flex-grid="b(stretch, 0, x1)">
            {!updatePending ? candidateResults() : <Spinner />}
          </div>
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
  const pickMap = (
    list:
      | Maybe<Maybe<PoolFilterInput>[]>
      | Maybe<Maybe<KeyFilterInput>[]>
      | Maybe<Maybe<ClassificationFilterInput>[]>
      | null
      | undefined,
    keys: string | string[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any[] | undefined => list?.map((item) => pick(item, keys));

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
