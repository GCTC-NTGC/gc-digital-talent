import { useId } from "react";
import RocketLaunchIcon from "@heroicons/react/24/outline/RocketLaunchIcon";
import { useIntl } from "react-intl";
import ArrowPathIcon from "@heroicons/react/16/solid/ArrowPathIcon";
import { useQuery } from "urql";
import { useSearchParams } from "react-router";
import PlusCircleIcon from "@heroicons/react/24/outline/PlusCircleIcon";
import BellAlertIcon from "@heroicons/react/20/solid/BellAlertIcon";
import Cog8ToothIcon from "@heroicons/react/20/solid/Cog8ToothIcon";
import random from "lodash/random";

import {
  Button,
  Card,
  Chip,
  Chips,
  Heading,
  Notice,
  Pending,
  Ul,
  type ButtonProps,
} from "@gc-digital-talent/ui";
import { graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { commonMessages, formMessages } from "@gc-digital-talent/i18n";

import JobCard from "~/components/JobCard/JobCard";

import BrowseJobsLayout from "./BrowseJobsLayout";
import browseJobsMessages from "./browseJobsMessages";

// features in progress
const featurePaginationButton = true;
const featureManageAlertButtons = true;

const selectedFilterStyle: ButtonProps = {
  mode: "inline",
  color: "black",
  className: "[&_*]:no-underline pointer-events-none",
} as const;

const unselectedFilterStyle: ButtonProps = {
  mode: "inline",
  color: "black",
  className: "font-normal",
} as const;

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
  const sortByLabelId = useId();

  const [searchParams, setSearchParams] = useSearchParams();

  const sortBy = searchParams.get("sortBy") ?? "publishedAt";
  const setSortBy = (s: string) => {
    // already selected, avoid pushing a duplicate history entry
    if (s === sortBy) return;
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("sortBy", s);
      return next;
    });
  };

  const exampleFilter = searchParams.getAll("exampleFilter");
  const addExampleFilter = (value: string) =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.append("exampleFilter", value);
      return next;
    });
  const removeExampleFilter = (value: string) =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      const remaining = next.getAll("exampleFilter").filter((v) => v !== value);
      next.delete("exampleFilter");
      remaining.forEach((v) => next.append("exampleFilter", v));
      return next;
    });

  const handleResetFilters = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("exampleFilter");
      // any other filters here
      return next;
    });
  };

  const [{ data, fetching, error }] = useQuery({
    query: OpenOpportunitiesPage_Query,
  });

  const pools = unpackMaybes(data?.poolsPaginated?.data);

  return (
    <BrowseJobsLayout>
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
        <div className="flex w-full shrink-0 flex-col gap-1.5 xs:w-78">
          <Card space="md">
            <Heading rank="h3" size="h6" className="mx-0 mt-0 mb-4.5">
              {intl.formatMessage({
                defaultMessage: "Filter jobs",
                id: "5/P7D5",
                description: "Heading for job filtering",
              })}
            </Heading>
            {/* filter list */}
            <div className="flex flex-col gap-6">
              {/* this is an example filter block */}
              <div>
                <Button
                  mode="inline"
                  className="mb-1.5"
                  icon={PlusCircleIcon}
                  color="black"
                  onClick={() => addExampleFilter(`Item ${random(1, 1000)}`)}
                >
                  {intl.formatMessage({
                    defaultMessage: "Example",
                    id: "+jIT2i",
                    description: "Title for the example component",
                  })}
                </Button>
                {exampleFilter.length ? (
                  <Chips>
                    {exampleFilter.map((f) => (
                      <Chip key={f} onDismiss={() => removeExampleFilter(f)}>
                        {f}
                      </Chip>
                    ))}
                  </Chips>
                ) : (
                  <div className="text-sm text-gray-500 dark:text-gray-200">
                    {intl.formatMessage({
                      defaultMessage: "No filters selected",
                      id: "sxFMPR",
                      description: "null state for filter list",
                    })}
                  </div>
                )}
              </div>
            </div>
            {featureManageAlertButtons ? (
              <>
                <Card.Separator className="my-6" />
                <Button mode="inline" icon={BellAlertIcon}>
                  {intl.formatMessage({
                    defaultMessage: "Create job alert",
                    id: "YsHrTn",
                    description: "Button to create a job alert",
                  })}
                </Button>
              </>
            ) : null}
          </Card>
          {featureManageAlertButtons ? (
            <Card space="md">
              <Button mode="inline" icon={Cog8ToothIcon} counter={1}>
                {intl.formatMessage({
                  defaultMessage: "Manage my alerts",
                  id: "Tqdczp",
                  description: "Button to manage job alerts",
                })}
              </Button>
            </Card>
          ) : null}
        </div>
        <div className="flex w-full flex-col">
          {/* Results bar */}
          {/* wraps the sort controls below the count when space is tight */}
          <Card className="mb-1.5 flex flex-row flex-wrap items-center gap-x-6 gap-y-3">
            <div role="status" className="grow font-bold">
              {!fetching
                ? intl.formatMessage(
                    {
                      defaultMessage: `{resultCount, plural,
                        =0 {0 open opportunities}
                        one {# open opportunity}
                        other {# open opportunities}
                      }`,
                      id: "Efy/VY",
                      description: "Number of open job opportunities found",
                    },
                    {
                      resultCount: pools.length,
                    },
                  )
                : null}
            </div>
            <div
              role="group"
              aria-labelledby={sortByLabelId}
              className="flex flex-row flex-wrap items-center gap-3 whitespace-nowrap"
            >
              <span
                id={sortByLabelId}
                className="text-gray-500 dark:text-gray-200"
              >
                {intl.formatMessage(formMessages.sortBy)}
                {intl.formatMessage(commonMessages.dividingColon)}
              </span>
              <Button
                aria-pressed={sortBy === "publishedAt"}
                onClick={() => setSortBy("publishedAt")}
                {...(sortBy === "publishedAt"
                  ? selectedFilterStyle
                  : unselectedFilterStyle)}
              >
                {intl.formatMessage({
                  defaultMessage: "Date posted",
                  id: "K7MAfs",
                  description: "Button to sort by date posted",
                })}
              </Button>
              <span
                aria-hidden
                className="self-stretch border-l border-gray-300 dark:border-gray-500"
              />
              <Button
                aria-pressed={sortBy === "closeDate"}
                onClick={() => setSortBy("closeDate")}
                {...(sortBy === "closeDate"
                  ? selectedFilterStyle
                  : unselectedFilterStyle)}
              >
                {intl.formatMessage({
                  defaultMessage: "Deadline",
                  id: "JQcQkH",
                  description: "Button to sort by deadline",
                })}
              </Button>
            </div>
          </Card>
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
                  <Button
                    mode="inline"
                    color="black"
                    onClick={() => handleResetFilters()}
                  >
                    {intl.formatMessage({
                      defaultMessage: "Reset all filters",
                      id: "DO62XW",
                      description: "Button to clear all search filters",
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
    </BrowseJobsLayout>
  );
};

Component.displayName = "OpenOpportunitiesPage";

export default Component;
