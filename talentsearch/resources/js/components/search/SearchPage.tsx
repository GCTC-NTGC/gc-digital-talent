import { Button } from "@common/components";
import { fakePools } from "@common/fakeData";
import { getLocale } from "@common/helpers/localize";
import { imageUrl } from "@common/helpers/router";
import { notEmpty } from "@common/helpers/util";
import React, { useState } from "react";
import { defineMessages, useIntl } from "react-intl";
import {
  PoolCandidateFilter,
  Classification,
  CmoAsset,
  OperationalRequirement,
  Pool,
  useGetSearchFormDataQuery,
  useCountPoolCandidatesQuery,
  CountPoolCandidatesQueryVariables,
  QueryCountPoolCandidatesWhereWhereConditions,
  QueryCountPoolCandidatesWhereColumn,
  SqlOperator,
  QueryCountPoolCandidatesHasExpectedClassificationsColumn,
  QueryCountPoolCandidatesHasCmoAssetsColumn,
  QueryCountPoolCandidatesHasAcceptedOperationalRequirementsColumn,
} from "../../api/generated";
import { BASE_URL } from "../../talentSearchConstants";
import EstimatedCandidates from "./EstimatedCandidates";
import SearchForm from "./SearchForm";

const messages = defineMessages({
  pageTitle: {
    defaultMessage: "Search the Digital Talent Pool",
    description: "Title displayed in the hero section of the Search page.",
  },
  pageAboutHeading: {
    defaultMessage: "About the CS - Digital Talent Pool",
    description:
      "Heading displayed in the About area of the hero section of the Search page.",
  },
  pageAboutContent: {
    defaultMessage:
      "This pool is open to most departments and agencies. Candidates in the pool vary from just starting their career to seasoned professionals with several years of work experience. This is an ongoing recruitment pool, which means new candidates are being added every week.",
    description:
      "Content displayed in the About area of the hero section of the Search page.",
  },
  pageHowToHeading: {
    defaultMessage: "How to use this tool",
    description:
      "Heading displayed in the How To area of the hero section of the Search page.",
  },
  pageHowToContent: {
    defaultMessage:
      "Use the filters below to specify your hiring needs. At any time you can look at the results located at the bottom of this page to see how many candidates match the requirements you have entered. When you are comfortable with the filters you have selected, click the Request Candidates button to add more details and submit a request form.",
    description:
      "Content displayed in the How To area of the hero section of the Search page.",
  },
});

export const SearchFilterAdvice: React.FC<{
  classificationFilterCount: number;
  cmoAssetFilterCount: number;
  operationalRequirementFilterCount: number;
}> = ({
  classificationFilterCount,
  cmoAssetFilterCount,
  operationalRequirementFilterCount,
}) => {
  const intl = useIntl();
  if (
    classificationFilterCount === 0 &&
    cmoAssetFilterCount === 0 &&
    operationalRequirementFilterCount === 0
  ) {
    return null;
  }

  const reccomendations = [];
  if (classificationFilterCount > 0) {
    reccomendations.push(
      <a
        href="#classificationsFilter"
        data-h2-font-color="b(lightpurple)"
        data-h2-font-weight="b(700)"
      >
        {intl.formatMessage(
          {
            defaultMessage:
              "Classification Filters ({classificationFilterCount}),",
          },
          { classificationFilterCount },
        )}
      </a>,
    );
  }
  if (operationalRequirementFilterCount > 0) {
    reccomendations.push(
      <a
        href="#operationalRequirementFilter"
        data-h2-font-color="b(lightpurple)"
        data-h2-font-weight="b(700)"
      >
        {intl.formatMessage(
          {
            defaultMessage:
              "Conditions of Employment ({operationalRequirementFilterCount}),",
          },
          { operationalRequirementFilterCount },
        )}
      </a>,
    );
  }
  if (cmoAssetFilterCount > 0) {
    reccomendations.push(
      <a
        href="#cmoAssetFilter"
        data-h2-font-color="b(lightpurple)"
        data-h2-font-weight="b(700)"
      >
        {intl.formatMessage(
          {
            defaultMessage: "Skills Filters ({cmoAssetFilterCount})",
          },
          { cmoAssetFilterCount },
        )}
      </a>,
    );
  }

  return (
    <p data-h2-font-size="b(caption)" data-h2-margin="b(bottom, m)">
      {intl.formatMessage({
        defaultMessage:
          "To improve your results, try removing some of these filters:",
        description:
          "Heading for total matching candidates in results section of search page.",
      })}{" "}
      {reccomendations.map((link, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <span key={i}>
          {i > 0 && ", "}
          {link}
        </span>
      ))}
    </p>
  );
};

export const SearchPage: React.FC<{
  classifications: Classification[];
  cmoAssets: CmoAsset[];
  operationalRequirements: OperationalRequirement[];
  pool: Pool;
  candidateCount: number;
  candidateFilter: PoolCandidateFilter | undefined;
  updateCandidateFilter: (candidateFilter: PoolCandidateFilter) => void;
}> = ({
  classifications,
  cmoAssets,
  operationalRequirements,
  pool,
  candidateCount,
  candidateFilter,
  updateCandidateFilter,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  const classificationFilterCount =
    candidateFilter?.classifications?.length ?? 0;
  const cmoAssetFilterCount = candidateFilter?.cmoAssets?.length ?? 0;
  const operationalRequirementFilterCount =
    candidateFilter?.operationalRequirements?.length ?? 0;

  return (
    <>
      <div
        data-h2-position="b(relative)"
        data-h2-padding="b(bottom, l) l(bottom, none)"
        data-h2-margin="b(bottom, l) l(bottom, xxl)"
        className="hero"
        style={{
          background: `linear-gradient(70deg, rgba(103, 76, 144, 0.9), rgba(29, 44, 76, 1)), url(${imageUrl(
            BASE_URL,
            "hero-background-search.png",
          )})`,
          backgroundSize: "cover",
          backgroundBlendMode: "multiply",
        }}
      >
        <h1
          data-h2-margin="b(all, none)"
          data-h2-padding="b(top, l) b(right-left, s)"
          data-h2-text-align="b(center)"
          data-h2-font-color="b(white)"
          data-h2-font-weight="b(800)"
          style={{ letterSpacing: "-2px" }}
        >
          {intl.formatMessage(messages.pageTitle)}
        </h1>
        <div
          data-h2-position="b(relative) s(relative) m(relative) l(absolute)"
          data-h2-bg-color="b(white)"
          data-h2-margin="b(top-bottom, xs) b(right-left, xs) l(right-left, xxl)"
          data-h2-padding="b(top-bottom, m) b(right-left, m) l(top-bottom, l) l(right-left, m)"
          data-h2-radius="b(s)"
          data-h2-shadow="b(s)"
          className="hero-sub"
        >
          <h2
            data-h2-font-color="b(black)"
            data-h2-font-weight="b(300)"
            data-h2-margin="b(all, none)"
          >
            {intl.formatMessage(messages.pageAboutHeading)}
          </h2>
          <p>{intl.formatMessage(messages.pageAboutContent)}</p>
        </div>
      </div>
      <div
        data-h2-flex-grid="b(top, contained, flush, xl)"
        data-h2-container="b(center, l)"
      >
        <div data-h2-flex-item="b(1of1) s(2of3)" style={{ paddingBottom: "0" }}>
          <h2
            data-h2-font-color="b(black)"
            data-h2-font-weight="b(300)"
            data-h2-margin="b(all, none)"
          >
            {intl.formatMessage(messages.pageHowToHeading)}
          </h2>
          <p>{intl.formatMessage(messages.pageHowToContent)}</p>
          <SearchForm
            classifications={classifications}
            cmoAssets={cmoAssets}
            operationalRequirements={operationalRequirements}
            updateCandidateFilter={updateCandidateFilter}
          />
          <div>
            <div>
              <h3
                data-h2-font-size="b(h4)"
                data-h2-font-weight="b(700)"
                data-h2-margin="b(bottom, m)"
              >
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "Results: <span>{totalEstimatedCandidates}</span> matching candidates",
                    description:
                      "Heading for total matching candidates in results section of search page.",
                  },
                  {
                    span: (msg: string): JSX.Element => (
                      <span data-h2-font-color="b(lightpurple)">{msg}</span>
                    ),
                    totalEstimatedCandidates: candidateCount,
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
          </div>
        </div>
        <div
          data-h2-flex-item="b(1of1) s(1of3)"
          data-h2-visibility="b(hidden) s(visible)"
          data-h2-position="b(sticky)"
          style={{ top: "0", right: "0" }}
        >
          <EstimatedCandidates totalEstimatedCandidates={candidateCount} />
        </div>
        <div data-h2-flex-item="b(1of1)" style={{ paddingTop: "0" }}>
          <div
            data-h2-shadow="b(m)"
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
                  a: (msg: string): JSX.Element => (
                    <a href="/search" data-h2-font-weight="b(700)">
                      {msg}
                    </a>
                  ),
                },
              )}
            </p>
          </div>
          <div
            data-h2-shadow="b(m)"
            data-h2-border="b(lightnavy, left, solid, l)"
            data-h2-margin="b(top, s) b(bottom, m)"
            data-h2-flex-grid="b(middle, contained, flush, xl)"
          >
            <div
              data-h2-flex-item="b(1of1) m(1of2)"
              style={{ padding: "0", paddingLeft: "1rem" }}
            >
              <p data-h2-margin="b(bottom, none)" data-h2-font-weight="b(700)">
                {pool?.name?.[locale]}
              </p>
              <p
                data-h2-margin="b(top, xxs) b(bottom, m)"
                data-h2-font-weight="b(100)"
              >
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "There are <span>{totalEstimatedCandidates}</span> matching candidates in this pool",
                    description:
                      "Message for total estimated candidates box next to search form.",
                  },
                  {
                    span: (msg: string): JSX.Element => (
                      <span
                        data-h2-font-weight="b(700)"
                        data-h2-font-color="b(lightpurple)"
                      >
                        {msg}
                      </span>
                    ),
                    totalEstimatedCandidates: candidateCount,
                  },
                )}
              </p>
              <p
                data-h2-margin="b(bottom, none)"
                data-h2-font-size="b(caption)"
              >
                {intl.formatMessage({ defaultMessage: "Pool Owner" })}:{" "}
                {pool?.owner?.firstName} {pool?.owner?.lastName}
              </p>
              <p data-h2-margin="b(bottom, s)" data-h2-font-size="b(caption)">
                {pool.description?.[locale]}
              </p>
            </div>
            <div
              data-h2-flex-item="b(1of1) m(1of2)"
              data-h2-display="b(flex)"
              data-h2-justify-content="b(center) m(flex-end)"
            >
              <Button color="cta" mode="solid">
                {intl.formatMessage({
                  defaultMessage: "Request Candidates",
                  description:
                    "Button link message on search page that takes user to the request form.",
                })}
              </Button>
            </div>
          </div>
          <a
            href="/search"
            data-h2-font-size="b(caption)"
            data-h2-font-weight="b(700)"
          >
            {intl.formatMessage({
              defaultMessage: "Not what you're looking for? Get in touch!",
              description:
                "Message for helping user if no candidates matched the filters chosen.",
            })}
          </a>
        </div>
      </div>
    </>
  );
};

const candidateFilterToQueryArgs = (
  filter: PoolCandidateFilter | undefined,
): CountPoolCandidatesQueryVariables => {
  if (filter === undefined) {
    return {};
  }

  const Column = QueryCountPoolCandidatesWhereColumn;
  // For most boolean fields which are false in filter, we want to exclude that field from the query entirely, NOT set it to false.
  const whereFilters: QueryCountPoolCandidatesWhereWhereConditions[] = [
    filter.hasDiploma ? { column: Column.HasDiploma, value: true } : null,
    filter.hasDisability
      ? {
          column: Column.HasDisability,
          value: true,
        }
      : null,
    filter.isIndigenous ? { column: Column.IsIndigenous, value: true } : null,
    filter.isVisibleMinority
      ? { column: Column.IsVisibleMinority, value: true }
      : null,
    filter.isWoman ? { column: Column.IsWoman, value: true } : null,
    filter.languageAbility
      ? { column: Column.LanguageAbility, value: filter.languageAbility }
      : null,
    filter.workRegions && filter.workRegions.length > 0
      ? {
          // For work regions, we want to match any user willing to accept any of the filtered regions
          OR: filter.workRegions.map((region) => ({
            column: Column.LocationPreferences,
            operator: SqlOperator.Contains,
            value: region,
          })),
        }
      : null,
  ].filter(notEmpty);

  const ClassificationsColumn =
    QueryCountPoolCandidatesHasExpectedClassificationsColumn;
  const classifications = filter.classifications?.filter(notEmpty) ?? [];
  const hasClassifications =
    classifications.length > 0
      ? {
          OR: classifications.map((classification) => ({
            AND: [
              {
                column: ClassificationsColumn.Group,
                value: classification.group,
              },
              {
                column: ClassificationsColumn.Level,
                value: classification.level,
              },
            ],
          })),
        }
      : null;
  const cmoAssets = filter.cmoAssets?.filter(notEmpty) ?? [];
  const hasCmoAssets =
    cmoAssets.length > 0
      ? {
          AND: cmoAssets.map((asset) => ({
            column: QueryCountPoolCandidatesHasCmoAssetsColumn.Key,
            operator: SqlOperator.In,
            value: [asset.key],
          })),
        }
      : null;
  const operationalRequirements =
    filter.operationalRequirements?.filter(notEmpty) ?? [];
  const hasOperationalRequirements =
    operationalRequirements.length > 0
      ? {
          column:
            QueryCountPoolCandidatesHasAcceptedOperationalRequirementsColumn.Key,
          operator: SqlOperator.In,
          value: operationalRequirements.map((requirement) => requirement.key),
        }
      : null;

  const query = {
    where: {
      AND: whereFilters,
    },
    hasExpectedClassifications: hasClassifications,
    hasCmoAssets,
    hasAcceptedOperationalRequirements: hasOperationalRequirements,
  };
  return query;
};

export const SearchPageApi: React.FC = () => {
  const [{ data }] = useGetSearchFormDataQuery();
  const pool = fakePools()[0] as Pool; // TODO: add to SearchFormDataQuery

  const [candidateFilter, setCandidateFilter] = useState<
    PoolCandidateFilter | undefined
  >(undefined);
  const [{ data: countData }] = useCountPoolCandidatesQuery({
    variables: candidateFilterToQueryArgs(candidateFilter),
  });

  const candidateCount = countData?.countPoolCandidates ?? 0;

  return (
    <SearchPage
      classifications={data?.classifications.filter(notEmpty) ?? []}
      cmoAssets={data?.cmoAssets.filter(notEmpty) ?? []}
      operationalRequirements={
        data?.operationalRequirements.filter(notEmpty) ?? []
      }
      pool={pool}
      candidateFilter={candidateFilter}
      candidateCount={candidateCount}
      updateCandidateFilter={setCandidateFilter}
    />
  );
};

export default SearchPage;
