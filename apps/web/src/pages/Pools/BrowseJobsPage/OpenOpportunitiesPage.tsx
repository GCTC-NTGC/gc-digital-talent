import RocketLaunchIcon from "@heroicons/react/24/outline/RocketLaunchIcon";
import { useIntl } from "react-intl";
import ArrowPathIcon from "@heroicons/react/16/solid/ArrowPathIcon";
import { useClient, useQuery } from "urql";
import { useState } from "react";

import { Button, Heading, Notice, Pending, Ul } from "@gc-digital-talent/ui";
import {
  graphql,
  LanguageAbility,
  PoolAreaOfSelection,
  PoolPublishedRange,
  PoolStatus,
  SalaryRange,
  PublishedPoolsSearchOrderByColumn,
  SortOrder,
  type OpenOpportunitiesMoreResultsQuery,
  type PublishedPoolsSearchInput,
  type QueryPublishedPoolsSearchOrderByOrderByClause,
} from "@gc-digital-talent/graphql";
import { isEnumValue, isUUID, unpackMaybes } from "@gc-digital-talent/helpers";
import { commonMessages, errorMessages } from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";

import JobCard from "~/components/JobCard/JobCard";

import browseJobsMessages from "./browseJobsMessages";
import ResultsBar from "./components/ResultsBar/ResultsBar";
import FilterBar from "./components/FilterBar/FilterBar";
import useBrowseJobsSearchParams from "./useBrowseJobsSearchParams";

// features in progress
const featureManageAlertButtons = true;

const PAGE_SIZE = 20;

const OpenOpportunitiesPage_Query = graphql(/* GraphQL */ `
  query OpenOpportunitiesPage(
    $where: PublishedPoolsSearchInput
    $first: Int!
    $orderBy: [QueryPublishedPoolsSearchOrderByOrderByClause!]
  ) {
    publishedPoolsSearch(where: $where, first: $first, orderBy: $orderBy) {
      edges {
        node {
          id
          ...JobCard
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }

    ...BrowseJobsFilterBarOptions
  }
`);

const OpenOpportunitiesMoreResults_Query = graphql(/* GraphQL */ `
  query OpenOpportunitiesMoreResults(
    $where: PublishedPoolsSearchInput
    $first: Int!
    $orderBy: [QueryPublishedPoolsSearchOrderByOrderByClause!]
    $after: String
  ) {
    publishedPoolsSearch(
      where: $where
      first: $first
      orderBy: $orderBy
      after: $after
    ) {
      edges {
        node {
          id
          ...JobCard
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`);

type ResultsPage = OpenOpportunitiesMoreResultsQuery["publishedPoolsSearch"];

// focuses the element when it's added to the page
// it lives outside the component so React doesn't call it again on every render
const focusOnMount = (element: HTMLElement | null) => element?.focus();

interface OpportunityResultsProps {
  firstPage: ResultsPage;
  where: PublishedPoolsSearchInput;
  orderBy: QueryPublishedPoolsSearchOrderByOrderByClause[];
}

const OpportunityResults = ({
  firstPage,
  where,
  orderBy,
}: OpportunityResultsProps) => {
  const intl = useIntl();
  const client = useClient();
  const [morePages, setMorePages] = useState<ResultsPage[]>([]);
  const [fetchingMore, setFetchingMore] = useState(false);

  const lastPage = morePages.at(-1) ?? firstPage;
  const pools = [firstPage, ...morePages].flatMap((page) =>
    unpackMaybes(page.edges).map((edge) => edge.node),
  );
  // the first card of the page just loaded, so keyboard and screen reader users carry on from there
  // or the last card, if that page came back empty and the button is gone
  const focusIndex = morePages.length
    ? Math.min(
        pools.length - unpackMaybes(lastPage.edges).length,
        pools.length - 1,
      )
    : null;

  const handleLoadMore = async () => {
    if (fetchingMore) return;
    setFetchingMore(true);
    const { data, error } = await client
      .query(OpenOpportunitiesMoreResults_Query, {
        where,
        orderBy,
        first: PAGE_SIZE,
        after: lastPage.pageInfo.endCursor,
      })
      .toPromise();
    setFetchingMore(false);

    if (data) {
      setMorePages((pages) => [...pages, data.publishedPoolsSearch]);
    } else if (error?.networkError) {
      // the client already toasts GraphQL errors, but not network ones
      toast.error(
        intl.formatMessage(errorMessages.unknownErrorRequestErrorBody),
      );
    }
  };

  return (
    <>
      <Ul unStyled className="flex flex-col gap-1.5">
        {pools.map((pool, index) => (
          <li
            key={pool.id}
            {...(index === focusIndex && {
              ref: focusOnMount,
              tabIndex: -1,
            })}
          >
            <JobCard poolQuery={pool} />
          </li>
        ))}
      </Ul>

      {lastPage.pageInfo.hasNextPage ? (
        <div className="mt-6 self-center">
          <Button
            color="secondary"
            icon={ArrowPathIcon}
            onClick={handleLoadMore}
          >
            {intl.formatMessage({
              defaultMessage: "Load more results",
              id: "HuA8aL",
              description: "Button text to load the next set of results",
            })}
          </Button>
        </div>
      ) : null}
    </>
  );
};

export const OpenOpportunitiesPage = () => {
  const intl = useIntl();

  const { sortBy, resetAllFilters, getFilterValue, getFilterValues } =
    useBrowseJobsSearchParams();

  const whereVariable: PublishedPoolsSearchInput = {
    keywordSearch: getFilterValues("keywords"),
    eligibility: getFilterValues("applicationEligibilities").filter(
      isEnumValue(PoolAreaOfSelection),
    ),
    departments: getFilterValues("organizations").filter(isUUID),
    classifications: getFilterValues("classifications").filter(isUUID),
    publishedAtRange: getFilterValues("advertisementTimings").filter(
      isEnumValue(PoolPublishedRange),
    ),
    languages: getFilterValues("languageRequirements").filter(
      isEnumValue(LanguageAbility),
    ),
    salaryRange: getFilterValues("minimumSalary").find(
      isEnumValue(SalaryRange),
    ),
    processNumber: getFilterValue("processNumber"),
    poolStatuses: [PoolStatus.Published], // this page doesn't show closed pools
  };

  const orderByVariable: Record<
    typeof sortBy,
    QueryPublishedPoolsSearchOrderByOrderByClause
  > = {
    datePosted: {
      column: PublishedPoolsSearchOrderByColumn.PublishedAt,
      order: SortOrder.Desc,
    },
    deadline: {
      column: PublishedPoolsSearchOrderByColumn.ClosingDate,
      order: SortOrder.Asc,
    },
  };

  const orderBy = [orderByVariable[sortBy]];

  const [{ data, fetching, error }] = useQuery({
    query: OpenOpportunitiesPage_Query,
    variables: {
      where: whereVariable,
      first: PAGE_SIZE,
      orderBy,
    },
  });

  const pools = unpackMaybes(data?.publishedPoolsSearch?.edges).map(
    (edge) => edge.node,
  );

  return (
    <>
      <Heading
        rank="h2"
        size="h3"
        icon={RocketLaunchIcon}
        color="primary"
        className="mt-0 mb-6 font-normal"
      >
        {intl.formatMessage(browseJobsMessages.openOpportunities)}
      </Heading>
      <p className="mb-3">
        {intl.formatMessage({
          id: "C7sYnb",
          defaultMessage:
            "This platform allows you to apply to recruitment processes that make it easy for hiring managers to find you. This page offers you a snapshot of our open recruitment processes. Come back and check this page often!",
          description:
            "Description of how the application process works, paragraph one",
        })}
      </p>
      <p className="mb-12">
        {intl.formatMessage({
          id: "vNFHWp",
          defaultMessage:
            "Your application to a process will be reviewed by our team and if it's a match, you will be invited to an assessment. Once accepted, managers can contact you about job opportunities.",
          description:
            "Description of how the application process works, paragraph two",
        })}
      </p>
      <Pending fetching={fetching} error={error}>
        {data ? (
          <div className="flex flex-col gap-6 xs:flex-row">
            <FilterBar
              featureManageAlertButtons={featureManageAlertButtons}
              optionsFragment={data}
            />
            <div className="flex w-full flex-col">
              <ResultsBar
                fetching={fetching}
                resultCount={data.publishedPoolsSearch.totalCount}
              />

              {pools.length ? (
                <OpportunityResults
                  // start the list over when the filters or sort change, so cards loaded for the previous search don't stay below the new results
                  key={JSON.stringify({ whereVariable, orderBy })}
                  firstPage={data.publishedPoolsSearch}
                  where={whereVariable}
                  orderBy={orderBy}
                />
              ) : (
                <Notice.Root mode="card">
                  <Notice.Content>
                    {intl.formatMessage({
                      defaultMessage:
                        "There aren’t any active opportunities that match your search criteria. You can try a different set of filters, or you can save the current ones as an alert, which will notify you through email when a matching job is posted.",
                      id: "yBV0YH",
                      description: "Null state for opportunity search",
                    })}
                  </Notice.Content>
                  <Notice.Actions>
                    {/* Eventually there will be a "Create an alert" button here too */}
                    <Button
                      mode="inline"
                      color="black"
                      onClick={resetAllFilters}
                    >
                      {intl.formatMessage({
                        defaultMessage: "Reset all filters",
                        id: "0/jj1v",
                        description: "Button text to reset a filter form",
                      })}
                    </Button>
                  </Notice.Actions>
                </Notice.Root>
              )}
            </div>
          </div>
        ) : (
          <p>{intl.formatMessage(commonMessages.notFound)}</p>
        )}
      </Pending>
    </>
  );
};

OpenOpportunitiesPage.displayName = "OpenOpportunitiesPage";

export default OpenOpportunitiesPage;
