import type { ComponentPropsWithoutRef } from "react";
import { useIntl } from "react-intl";
import PlusCircleIcon from "@heroicons/react/24/outline/PlusCircleIcon";
import BellAlertIcon from "@heroicons/react/20/solid/BellAlertIcon";
import Cog8ToothIcon from "@heroicons/react/20/solid/Cog8ToothIcon";
import { twMerge } from "tailwind-merge";
import { FormProvider, useForm } from "react-hook-form";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";

import { Button, Card, Heading } from "@gc-digital-talent/ui";
import { Input } from "@gc-digital-talent/forms";
import {
  getFragment,
  graphql,
  type FragmentType,
} from "@gc-digital-talent/graphql";
import { commonMessages, narrowEnumType } from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import adminMessages from "~/messages/adminMessages";

import useBrowseJobsSearchParams from "../../useBrowseJobsSearchParams";
import OpportunityDetailsFilterDialog from "../filterDialogs/OpportunityDetailsFilterDialog";
import OrganizationsFilterDialog from "../filterDialogs/OrganizationsFilterDialog";
import AdvancedFiltersDialog from "../filterDialogs/AdvancedFiltersDialog";
import LanguageRequirementsFilterDialog from "../filterDialogs/LanguageRequirementsFilterDialog";
import FilterChips from "./FilterChips";

const Options_Fragment = graphql(/* GraphQL */ `
  fragment BrowseJobsFilterBarOptions on Query {
    ...OpportunityDetailsFilterDialogOptions
    ...LanguageRequirementsFilterDialogOptions
    ...OrganizationsFilterDialogOptions
    ...AdvancedFiltersDialogOptions
    poolAreaOfSelectionEnums: localizedEnumOptions(
      enumName: "PoolAreaOfSelection"
    ) {
      ... on LocalizedPoolAreaOfSelection {
        value
        label {
          localized
        }
      }
    }
    departments {
      id
      name {
        localized
      }
    }
    classifications(availableInSearch: true) {
      id
      groupAndLevel
    }
    poolPublishedRangeEnums: localizedEnumOptions(
      enumName: "PoolPublishedRange"
    ) {
      ... on LocalizedPoolPublishedRange {
        value
        label {
          localized
        }
      }
    }
    languageAbilityEnums: localizedEnumOptions(enumName: "LanguageAbility") {
      ... on LocalizedLanguageAbility {
        value
        label {
          localized
        }
      }
    }
    salaryRangeEnums: localizedEnumOptions(enumName: "SalaryRange") {
      ... on LocalizedSalaryRange {
        value
        label {
          localized
        }
      }
    }
  }
`);
interface SearchByKeywordForm {
  searchByKeyword: string;
}

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

  const poolAreaOfSelectionLabels = new Map(
    narrowEnumType(
      unpackMaybes(options.poolAreaOfSelectionEnums),
      "PoolAreaOfSelection",
    ).map((e) => [e.value.toString(), e.label.localized]),
  );
  const classificationLabels = new Map(
    unpackMaybes(options.classifications).map((c) => [c.id, c.groupAndLevel]),
  );
  const salaryRangeLabels = new Map(
    narrowEnumType(unpackMaybes(options.salaryRangeEnums), "SalaryRange").map(
      (e) => [e.value.toString(), e.label.localized],
    ),
  );
  const languageAbilityLabels = new Map(
    narrowEnumType(
      unpackMaybes(options.languageAbilityEnums),
      "LanguageAbility",
    ).map((e) => [e.value.toString(), e.label.localized]),
  );
  const departmentLabels = new Map(
    unpackMaybes(options.departments).map((d) => [d.id, d.name.localized]),
  );
  const poolPublishedRangeLabels = new Map(
    narrowEnumType(
      unpackMaybes(options.poolPublishedRangeEnums),
      "PoolPublishedRange",
    ).map((e) => [e.value.toString(), e.label.localized]),
  );

  const {
    getFilterValues,
    addFilterValue,
    removeFilterValue,
    getEnabledFilterCount,
    resetAllFilters,
  } = useBrowseJobsSearchParams();

  const keywordFilters = getFilterValues("keywords").map((f) => ({
    key: `keywords:${f}`,
    label: f,
    onRemove: () => removeFilterValue("keywords", f),
  }));
  const opportunityDetailsFilters = [
    ...getFilterValues("applicationEligibilities").map((f) => ({
      key: `applicationEligibilities:${f}`,
      label: poolAreaOfSelectionLabels.get(f) ?? f,
      onRemove: () => removeFilterValue("applicationEligibilities", f),
    })),
    ...getFilterValues("classifications").map((f) => ({
      key: `classifications:${f}`,
      label:
        classificationLabels.get(f) ??
        intl.formatMessage(commonMessages.notFound),
      onRemove: () => removeFilterValue("classifications", f),
    })),
    ...getFilterValues("minimumSalary").map((f) => ({
      key: `minimumSalary:${f}`,
      label: salaryRangeLabels.get(f) ?? f,
      onRemove: () => removeFilterValue("minimumSalary", f),
    })),
  ];
  const languageRequirementsFilters = [
    ...getFilterValues("languageRequirements").map((f) => ({
      key: `languageRequirements:${f}`,
      label: languageAbilityLabels.get(f) ?? f,
      onRemove: () => removeFilterValue("languageRequirements", f),
    })),
  ];
  const organizationsFilters = getFilterValues("organizations").map((f) => ({
    key: `organizations:${f}`,
    label:
      departmentLabels.get(f) ?? intl.formatMessage(commonMessages.notFound),
    onRemove: () => removeFilterValue("organizations", f),
  }));
  const advancedFilters = [
    ...getFilterValues("advertisementTimings").map((f) => ({
      key: `advertisementTimings:${f}`,
      label: poolPublishedRangeLabels.get(f) ?? f,
      onRemove: () => removeFilterValue("advertisementTimings", f),
    })),
    ...getFilterValues("processNumber").map((f) => ({
      key: `processNumber:${f}`,
      label: f,
      onRemove: () => removeFilterValue("processNumber", f),
    })),
  ];

  const keywordFormMethods = useForm<SearchByKeywordForm>();

  const handleKeywordFormSubmit = ({
    searchByKeyword,
  }: SearchByKeywordForm) => {
    const keyword = searchByKeyword?.trim();
    if (keyword) addFilterValue("keywords", keyword);
    keywordFormMethods.reset();
  };

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
            <Button
              color="black"
              mode="inline"
              onClick={() => resetAllFilters()}
            >
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
            <FilterChips filters={keywordFilters} />
          </div>
          <div>
            <OpportunityDetailsFilterDialog optionsQuery={options}>
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
            <FilterChips filters={opportunityDetailsFilters} />
          </div>
          <div>
            <LanguageRequirementsFilterDialog optionsQuery={options}>
              <Button
                mode="inline"
                className="mb-1.5"
                icon={PlusCircleIcon}
                color="black"
              >
                {intl.formatMessage({
                  defaultMessage: "Language requirements",
                  id: "nEE/Ds",
                  description:
                    "Title for a language requirements filter dialog",
                })}
              </Button>
            </LanguageRequirementsFilterDialog>
            <FilterChips filters={languageRequirementsFilters} />
          </div>
          <div>
            <OrganizationsFilterDialog optionsQuery={options}>
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
            <FilterChips filters={organizationsFilters} />
          </div>
          <div>
            <AdvancedFiltersDialog optionsQuery={options}>
              <Button
                mode="inline"
                className="mb-1.5"
                icon={PlusCircleIcon}
                color="black"
              >
                {intl.formatMessage({
                  defaultMessage: "Advanced filters",
                  id: "eozWFc",
                  description: "Title for the additional filters",
                })}
              </Button>
            </AdvancedFiltersDialog>
            <FilterChips filters={advancedFilters} />
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
