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
import { DIGITAL_CAREERS_POOL_KEY } from "../../talentSearchConstants";
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
      <span data-h2-font-color="b(lightpurple)" data-testid="candidateCount">
        {msg}
      </span>
    );
  }

  function a(msg: string) {
    return (
      <a href={`mailto:${poolOwner?.email}`} data-h2-font-weight="b(700)">
        {msg}
      </a>
    );
  }

  function candidateResults() {
    return candidateCount > 0 ? (
      <div
        data-h2-shadow="b(m)"
        data-h2-border="b(lightnavy, left, solid, l)"
        data-h2-margin="b(top, s) b(bottom, m)"
        data-h2-flex-grid="b(middle, contained, flush, xl)"
      >
        <SearchPools
          candidateCount={candidateCount}
          pool={pool}
          poolOwner={poolOwner}
          handleSubmit={handleSubmit}
        />
      </div>
    ) : (
      <div
        data-h2-shadow="b(m)"
        data-h2-margin="b(top, s) b(bottom, m)"
        data-h2-padding="b(top-bottom, xs) b(left, s)"
        data-h2-border="b(darkgray, left, solid, l)"
      >
        <p data-h2-margin="b(bottom, none)">
          {intl.formatMessage({
            defaultMessage: "We can still help!",
            description:
              "Heading for helping user if no candidates matched the filters chosen.",
          })}
        </p>
        <p data-h2-margin="b(top, xxs)" data-h2-font-size="b(caption)">
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
    <div>
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
            cmoAssets={cmoAssets}
            updateCandidateFilter={updateCandidateFilter}
            updateInitialValues={updateInitialValues}
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
            operationalRequirementFilterCount={
              operationalRequirementFilterCount
            }
          />
        </div>
        <div data-h2-flex-item="b(1of1)" style={{ paddingTop: "0" }}>
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
  if (filter === undefined) {
    return {};
  }
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

  return {
    where: {
      ...filter,
      classifications: pickMap(filter.classifications, ["group", "level"]),
      cmoAssets: pickMap(filter.cmoAssets, "key"),
      pools: poolId ? [{ id: poolId }] : pickMap(filter.pools, "id"),
    },
  };
};

export const SearchContainerApi: React.FC = () => {
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

  const [initialValues, setInitialValues] = useState<FormValues | null>(null);

  const paths = useTalentSearchRoutes();
  const onSubmit = async () => {
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
