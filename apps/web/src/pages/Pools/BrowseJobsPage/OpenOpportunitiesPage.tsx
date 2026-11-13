import RocketLaunchIcon from "@heroicons/react/24/outline/RocketLaunchIcon";
import { useIntl } from "react-intl";
import ArrowPathIcon from "@heroicons/react/16/solid/ArrowPathIcon";
import { useQuery } from "urql";

import { Button, Heading, Notice, Pending, Ul } from "@gc-digital-talent/ui";
import { graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import JobCard from "~/components/JobCard/JobCard";

import browseJobsMessages from "./browseJobsMessages";
import ResultsBar from "./components/ResultsBar/ResultsBar";
import FilterBar from "./components/FilterBar/FilterBar";
import useBrowseJobsSearchParams from "./useBrowseJobsSearchParams";

// features in progress
const featurePaginationButton = true;
const featureManageAlertButtons = true;

// this will soon be replaced with a new search query
const OpenOpportunitiesPage_Query = graphql(/* GraphQL */ `
  query OpenOpportunitiesPage {
    poolsPaginated(
      where: { statuses: [PUBLISHED], isHidden: false }
      first: 500
      orderBy: { column: CLOSING_DATE, order: ASC }
    ) {
      data {
        id
        ...JobCard
      }
    }
  }
`);

export const OpenOpportunitiesPage = () => {
  const intl = useIntl();

  const { resetFilters } = useBrowseJobsSearchParams();

  const [{ data, fetching, error }] = useQuery({
    query: OpenOpportunitiesPage_Query,
  });

  const pools = unpackMaybes(data?.poolsPaginated?.data);

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
      <div className="flex flex-col gap-6 xs:flex-row">
        <FilterBar featureManageAlertButtons={featureManageAlertButtons} />
        <div className="flex w-full flex-col">
          <ResultsBar fetching={fetching} resultCount={pools.length} />
          <Pending fetching={fetching} error={error}>
            {pools.length ? (
              <Ul unStyled className="flex flex-col gap-1.5">
                {pools.map((pool) => (
                  <li key={pool.id}>
                    <JobCard poolQuery={pool} />
                  </li>
                ))}
              </Ul>
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
                  <Button mode="inline" color="black" onClick={resetFilters}>
                    {intl.formatMessage({
                      defaultMessage: "Reset all filters",
                      id: "0/jj1v",
                      description: "Button text to reset a filter form",
                    })}
                  </Button>
                </Notice.Actions>
              </Notice.Root>
            )}
          </Pending>

          {featurePaginationButton ? (
            <div className="mt-6 self-center">
              <Button color="secondary" icon={ArrowPathIcon}>
                {intl.formatMessage({
                  defaultMessage: "Load more results",
                  id: "HuA8aL",
                  description: "Button text to load the next set of results",
                })}
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

OpenOpportunitiesPage.displayName = "OpenOpportunitiesPage";

export default OpenOpportunitiesPage;
