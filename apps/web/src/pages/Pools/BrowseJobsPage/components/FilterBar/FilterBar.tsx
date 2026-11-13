import type { ComponentPropsWithoutRef } from "react";
import { useIntl } from "react-intl";
import PlusCircleIcon from "@heroicons/react/24/outline/PlusCircleIcon";
import BellAlertIcon from "@heroicons/react/20/solid/BellAlertIcon";
import Cog8ToothIcon from "@heroicons/react/20/solid/Cog8ToothIcon";
import random from "lodash/random";
import { twMerge } from "tailwind-merge";

import { Button, Card, Chip, Chips, Heading } from "@gc-digital-talent/ui";

import useBrowseJobsSearchParams from "../../useBrowseJobsSearchParams";

interface FilterBarProps extends ComponentPropsWithoutRef<"div"> {
  featureManageAlertButtons: boolean;
}

const FilterBar = ({
  featureManageAlertButtons,
  className,
  ...rest
}: FilterBarProps) => {
  const intl = useIntl();

  const {
    getFilterValues,
    addFilterValue,
    removeFilterValue,
    getEnabledFilterCount,
    resetFilters,
  } = useBrowseJobsSearchParams();

  const exampleFilter = getFilterValues("exampleFilter");

  return (
    <div
      className={twMerge(
        "flex w-full shrink-0 flex-col gap-1.5 xs:w-78",
        className,
      )}
      {...rest}
    >
      <Card space="md">
        <div className="mb-4.5 flex flex-row">
          <Heading rank="h3" size="h6" className="m-0 grow">
            {intl.formatMessage({
              defaultMessage: "Filter jobs",
              id: "5/P7D5",
              description: "Heading for job filtering",
            })}
          </Heading>
          {getEnabledFilterCount() > 0 ? (
            <Button color="black" mode="inline" onClick={() => resetFilters()}>
              {intl.formatMessage({
                defaultMessage: "Reset all filters",
                id: "0/jj1v",
                description: "Button text to reset a filter form",
              })}
            </Button>
          ) : null}
        </div>

        {/* filter list */}
        <div className="flex flex-col gap-6">
          {/* this is an example filter block */}
          <div>
            <Button
              mode="inline"
              className="mb-1.5"
              icon={PlusCircleIcon}
              color="black"
              onClick={() =>
                addFilterValue("exampleFilter", `Item ${random(1, 1000)}`)
              }
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
                  <Chip
                    key={f}
                    onDismiss={() => removeFilterValue("exampleFilter", f)}
                  >
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
  );
};

export default FilterBar;
