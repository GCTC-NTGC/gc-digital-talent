import { type ReactNode } from "react";
import { useIntl } from "react-intl";

import {
  Checklist,
  Combobox,
  localizedEnumToOptions,
  RadioGroup,
} from "@gc-digital-talent/forms";
import {
  commonMessages,
  ENUM_SORT_ORDER,
  narrowEnumType,
} from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import {
  getFragment,
  graphql,
  type FragmentType,
} from "@gc-digital-talent/graphql";

import adminMessages from "~/messages/adminMessages";

import useBrowseJobsSearchParams from "../../useBrowseJobsSearchParams";
import FilterDialog from "./FilterDialog";

const OpportunityDetailsFilterDialogOptions_Fragment = graphql(/* GraphQL */ `
  fragment OpportunityDetailsFilterDialogOptions on Query {
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
    classifications(availableInSearch: true) {
      id
      groupAndLevel
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

interface FormValues {
  applicationEligibilities: string[];
  classifications: string[];
  minimumSalary: string | null;
}

interface Props {
  optionsQuery: FragmentType<
    typeof OpportunityDetailsFilterDialogOptions_Fragment
  >;
  children: ReactNode;
}

const OpportunityDetailsFilterDialog = ({ optionsQuery, children }: Props) => {
  const intl = useIntl();
  const { poolAreaOfSelectionEnums, classifications, salaryRangeEnums } =
    getFragment(OpportunityDetailsFilterDialogOptions_Fragment, optionsQuery);
  const { getFilterValue, getFilterValues, setFilters } =
    useBrowseJobsSearchParams();

  const areaOfSelectionOptions = localizedEnumToOptions(
    narrowEnumType(
      unpackMaybes(poolAreaOfSelectionEnums),
      "PoolAreaOfSelection",
    ),
    intl,
    ENUM_SORT_ORDER.POOL_AREA_OF_SELECTION,
  );

  const classificationOptions = unpackMaybes(classifications)
    .map((o) => ({
      value: o.id,
      label: o.groupAndLevel ?? intl.formatMessage(commonMessages.notFound),
    }))
    .toSorted((a, b) => a.label.localeCompare(b.label));

  const minimumSalaryOptions = localizedEnumToOptions(
    narrowEnumType(unpackMaybes(salaryRangeEnums), "SalaryRange"),
    intl,
    ENUM_SORT_ORDER.SALARY_RANGE,
  );

  return (
    <FilterDialog<FormValues>
      title={intl.formatMessage({
        defaultMessage: "Opportunity details",
        id: "KyyLUM",
        description: "Title for opportunities filter dialog",
      })}
      subtitle={intl.formatMessage({
        defaultMessage:
          "Filter jobs by eligibility criteria, classification, and salary range.",
        id: "YfUnG2",
        description: "Subtitle for opportunity details dialog",
      })}
      trigger={children}
      getFormValues={() => ({
        applicationEligibilities: getFilterValues("applicationEligibilities"),
        classifications: getFilterValues("classifications"),
        minimumSalary: getFilterValue("minimumSalary"),
      })}
      onSave={(formValues) =>
        setFilters({
          applicationEligibilities: formValues.applicationEligibilities,
          classifications: formValues.classifications,
          minimumSalary: formValues.minimumSalary,
        })
      }
      onClear={() =>
        setFilters({
          applicationEligibilities: null,
          classifications: null,
          minimumSalary: null,
        })
      }
    >
      <Checklist
        idPrefix={"applicationEligibilities"}
        legend={intl.formatMessage({
          defaultMessage: "Application eligibility",
          id: "P3U7AV",
          description: "Title for an area of selection checklist",
        })}
        items={areaOfSelectionOptions}
        name={"applicationEligibilities"}
      />
      <Combobox
        options={classificationOptions}
        id={"classifications"}
        label={intl.formatMessage(adminMessages.classifications)}
        name={"classifications"}
        isMulti
      />
      <RadioGroup
        idPrefix="minimumSalary"
        legend={intl.formatMessage({
          defaultMessage: "Minimum salary",
          id: "VWEwki",
          description: "Label for classification minimum salary display",
        })}
        items={minimumSalaryOptions}
        name="minimumSalary"
      />
    </FilterDialog>
  );
};

export default OpportunityDetailsFilterDialog;
