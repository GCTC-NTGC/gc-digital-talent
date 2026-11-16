import type { ComponentPropsWithoutRef } from "react";
import { useIntl } from "react-intl";
import PlusCircleIcon from "@heroicons/react/24/outline/PlusCircleIcon";
import BellAlertIcon from "@heroicons/react/20/solid/BellAlertIcon";
import Cog8ToothIcon from "@heroicons/react/20/solid/Cog8ToothIcon";
import { twMerge } from "tailwind-merge";
import { FormProvider, useForm } from "react-hook-form";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";

import { Button, Card, Chip, Chips, Heading } from "@gc-digital-talent/ui";
import { Input } from "@gc-digital-talent/forms";
import {
  getFragment,
  graphql,
  type FragmentType,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

import adminMessages from "~/messages/adminMessages";

import useBrowseJobsSearchParams from "../../useBrowseJobsSearchParams";
import OpportunityDetailsFilterDialog from "../filterDialogs/OpportunityDetailsFilterDialog";
import OrganizationsFilterDialog from "../filterDialogs/OrganizationsFilterDialog";

const Options_Fragment = graphql(/* GraphQL */ `
  fragment BrowseJobsFilterBarOptions on Query {
    poolAreaOfSelectionEnums: localizedEnumStrings(
      enumName: "PoolAreaOfSelection"
    ) {
      value
      label {
        localized
      }
    }
    departments {
      id
      name {
        localized
      }
    }
    classifications {
      id
      groupAndLevel
    }
  }
`);
interface SearchByKeywordForm {
  searchByKeyword: string;
}

interface FilterDefinition {
  key: string;
  label: string;
  handleRemove: () => void;
}

const filtersToChips = (filters: FilterDefinition[]) =>
  filters
    .toSorted((f1, f2) => (f1.label > f2.label ? 1 : -1))
    .map((f) => (
      <Chip key={f.key} onDismiss={f.handleRemove}>
        {f.label}
      </Chip>
    ));

interface FilterBarProps extends ComponentPropsWithoutRef<"div"> {
  featureManageAlertButtons: boolean;
  optionsFragment: FragmentType<typeof Options_Fragment>;
}

const FilterBar = ({
  featureManageAlertButtons,
  optionsFragment,
  className,
  ...rest
}: FilterBarProps) => {
  const intl = useIntl();
  const options = getFragment(Options_Fragment, optionsFragment);

  const {
    getFilterValues,
    addFilterValue,
    removeFilterValue,
    getEnabledFilterCount,
    resetFilters,
  } = useBrowseJobsSearchParams();

  const keywordFilters = getFilterValues("keyword").map((f) => ({
    key: `keyword:${f}`,
    label: f ?? intl.formatMessage(commonMessages.notFound),
    handleRemove: () => removeFilterValue("keyword", f),
  }));

  const opportunityDetailsFilters = [
    ...getFilterValues("applicationEligibility").map((f) => ({
      key: `applicationEligibility:${f}`,
      label:
        options?.poolAreaOfSelectionEnums?.find((e) => e.value === f)?.label
          .localized ?? f,
      handleRemove: () => removeFilterValue("applicationEligibility", f),
    })),
    ...getFilterValues("classification").map((f) => ({
      key: `classification:${f}`,
      label:
        options?.classifications?.find((c) => c?.id === f)?.groupAndLevel ??
        intl.formatMessage(commonMessages.notFound),
      handleRemove: () => removeFilterValue("classification", f),
    })),
    // minimum salary
  ];
  const organizationsFilters = getFilterValues("organization").map((f) => ({
    key: `organization:${f}`,
    label:
      options?.departments?.find((e) => e?.id === f)?.name.localized ??
      intl.formatMessage(commonMessages.notFound),
    handleRemove: () => removeFilterValue("organization", f),
  }));

  const keywordFormMethods = useForm<SearchByKeywordForm>();

  const handleKeywordFormSubmit = ({
    searchByKeyword: keyword,
  }: SearchByKeywordForm) => {
    addFilterValue("keyword", keyword);
    keywordFormMethods.reset();
  };

  const filterNullMessage = (
    <div className="text-sm text-gray-500 dark:text-gray-200">
      {intl.formatMessage({
        defaultMessage: "No filters selected",
        id: "sxFMPR",
        description: "null state for filter list",
      })}
    </div>
  );

  return (
    <div
      className={twMerge(
        "flex w-full shrink-0 flex-col gap-1.5 xs:w-78",
        className,
      )}
      {...rest}
    >
      <Card space="md">
        <div className="mb-4.5 flex flex-row items-baseline">
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
          <div>
            <FormProvider {...keywordFormMethods}>
              <form
                onSubmit={keywordFormMethods.handleSubmit(
                  handleKeywordFormSubmit,
                )}
              >
                <div className="mb-1.5 flex flex-row items-end gap-1">
                  <div className="min-w-0 flex-1">
                    <Input
                      type="text"
                      id="searchByKeyword"
                      label={intl.formatMessage(adminMessages.searchByKeyword)}
                      name="searchByKeyword"
                    />
                  </div>
                  <div className="shrink-0">
                    <Button type="submit">
                      <PlusIcon
                        className="h-6 w-auto"
                        aria-label={intl.formatMessage({
                          defaultMessage: "Add a keyword",
                          id: "aTcy3P",
                          description: "Button to submit a keyword",
                        })}
                        role="img"
                        aria-hidden="false"
                      />
                    </Button>
                  </div>
                </div>
              </form>
            </FormProvider>

            {keywordFilters.length ? (
              <Chips>{filtersToChips(keywordFilters)}</Chips>
            ) : (
              filterNullMessage
            )}
          </div>
          <div>
            <OpportunityDetailsFilterDialog
              poolAreaOfSelectionEnums={options.poolAreaOfSelectionEnums}
              classifications={options.classifications}
            >
              <Button
                mode="inline"
                className="mb-1.5"
                icon={PlusCircleIcon}
                color="black"
              >
                {intl.formatMessage({
                  defaultMessage: "Opportunity details",
                  id: "KyyLUM",
                  description: "Title for opportunities filter dialog",
                })}
              </Button>
            </OpportunityDetailsFilterDialog>
            {opportunityDetailsFilters.length ? (
              <Chips>{filtersToChips(opportunityDetailsFilters)}</Chips>
            ) : (
              filterNullMessage
            )}
          </div>
          <div>
            <OrganizationsFilterDialog organizations={options.departments}>
              <Button
                mode="inline"
                className="mb-1.5"
                icon={PlusCircleIcon}
                color="black"
              >
                {intl.formatMessage({
                  defaultMessage: "Organizations",
                  id: "XmF74L",
                  description: "Title for organizations filter dialog",
                })}
              </Button>
            </OrganizationsFilterDialog>
            {organizationsFilters.length ? (
              <Chips>{filtersToChips(organizationsFilters)}</Chips>
            ) : (
              filterNullMessage
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
