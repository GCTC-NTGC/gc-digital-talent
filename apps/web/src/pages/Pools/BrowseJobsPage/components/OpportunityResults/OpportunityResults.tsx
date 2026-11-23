import { useState } from "react";
import { useIntl } from "react-intl";
import ArrowPathIcon from "@heroicons/react/16/solid/ArrowPathIcon";
import { useClient } from "urql";

import { Button, Ul } from "@gc-digital-talent/ui";
import {
  graphql,
  type OpenOpportunitiesMoreResultsQuery,
  type PublishedPoolsSearchInput,
  type QueryPublishedPoolsSearchOrderByOrderByClause,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { errorMessages } from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";

import JobCard from "~/components/JobCard/JobCard";

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
  pageSize: number;
  where: PublishedPoolsSearchInput;
  orderBy: QueryPublishedPoolsSearchOrderByOrderByClause[];
}

const OpportunityResults = ({
  firstPage,
  pageSize,
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
  // or the last card, if that page added no new cards
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
        first: pageSize,
        after: lastPage.pageInfo.endCursor,
      })
      .toPromise();
    setFetchingMore(false);

    if (data) {
      // a deadline extended mid-browse can bring an already shown pool back on a later page, so keep only its first card
      const shownIds = new Set(pools.map((pool) => pool.id));
      setMorePages((pages) => [
        ...pages,
        {
          ...data.publishedPoolsSearch,
          edges: unpackMaybes(data.publishedPoolsSearch.edges).filter(
            (edge) => !shownIds.has(edge.node.id),
          ),
        },
      ]);
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

export default OpportunityResults;
