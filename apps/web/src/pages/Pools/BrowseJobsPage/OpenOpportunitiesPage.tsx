import RocketLaunchIcon from "@heroicons/react/24/outline/RocketLaunchIcon";
import { useIntl } from "react-intl";
import ArrowPathIcon from "@heroicons/react/16/solid/ArrowPathIcon";
import { useQuery } from "urql";

import {
  Button,
  Card,
  Heading,
  Pending,
  Ul,
  UNICODE_CHAR,
} from "@gc-digital-talent/ui";
import { graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import JobCard from "~/components/JobCard/JobCard";

import BrowseJobsLayout from "./BrowseJobsLayout";

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

export const Component = () => {
  const intl = useIntl();

  const [{ data, fetching, error }] = useQuery({
    query: OpenOpportunitiesPage_Query,
  });

  const pools = unpackMaybes(data?.poolsPaginated?.data);

  // todo: implement sorting
  const sortedPools = pools.toSorted((a, b) => 0);

  return (
    <BrowseJobsLayout>
      <Heading
        rank="h2"
        size="h3"
        icon={RocketLaunchIcon}
        color="primary"
        className="mt-0 mb-6 font-normal"
      >
        {intl.formatMessage({
          defaultMessage: "Open job opportunities",
          id: "fSMBX0",
          description: "Title for the current jobs recruiting candidates",
        })}
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
        <div className="flex w-full flex-col gap-1.5 xs:w-78">
          <Card>filter jobs</Card>
          <Card>manage my alerts</Card>
        </div>
        <div className="flex w-full flex-col">
          {/* Results bar */}
          <Card className="mb-1.5 flex flex-row items-center gap-6">
            <div className="grow">
              <span className="font-bold">
                {intl.formatMessage(
                  {
                    defaultMessage: `{resultCount, plural,
                        zero {0 matching opportunities}
                        one {# matching opportunity}
                        other {# matching opportunities}
                      }`,
                    id: "J+ZAtS",
                    description: "opportunity result count",
                  },
                  {
                    resultCount: sortedPools.length,
                  },
                )}
              </span>
            </div>
            <div className="flex flex-row items-center gap-3">
              <span className="text-gray-500 dark:text-gray-200">
                {intl.formatMessage({
                  defaultMessage: "Sort by:",
                  id: "Ee09EO",
                  description: "Prefix for some sorting options",
                })}
              </span>
              {/* TODO: visual and accessible indication of current setting */}
              <Button mode="inline" color="black">
                {intl.formatMessage({
                  defaultMessage: "Date posted",
                  id: "K7MAfs",
                  description: "Button to sort by date posted",
                })}
              </Button>
              <span className="text-gray-500 dark:text-gray-200">
                {UNICODE_CHAR.VERTICAL_LINE}
              </span>
              <Button mode="inline" color="black">
                {intl.formatMessage({
                  defaultMessage: "Deadline",
                  id: "JQcQkH",
                  description: "Button to sort by deadline",
                })}
              </Button>
            </div>
          </Card>
          <Pending fetching={fetching} error={error}>
            {sortedPools.length ? (
              <Ul unStyled className="flex flex-col gap-1.5">
                {sortedPools.map((pool) => (
                  <li key={pool.id}>
                    <JobCard poolQuery={pool} />
                  </li>
                ))}
              </Ul>
            ) : (
              <span>no results</span>
            )}
          </Pending>

          <div className="mt-6 self-center">
            {/* todo: button doesn't do anything */}
            <Button color="secondary" icon={ArrowPathIcon}>
              {intl.formatMessage({
                defaultMessage: "Load more results",
                id: "HuA8aL",
                description: "Button text to load the next set of results",
              })}
            </Button>
          </div>
        </div>
      </div>
    </BrowseJobsLayout>
  );
};

Component.displayName = "OpenOpportunitiesPage";

export default Component;
