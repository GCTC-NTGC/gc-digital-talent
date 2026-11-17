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
  sortPoolAreaOfSelection,
  sortSalaryRange,
} from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import {
  getFragment,
  graphql,
  type FragmentType,
} from "@gc-digital-talent/graphql";

import useBrowseJobsSearchParams from "../../useBrowseJobsSearchParams";
import FilterDialog from "./FilterDialog";

const OpportunityDetailsFilterDialogOptions_Fragment = graphql(/* GraphQL */ `
  fragment OpportunityDetailsFilterDialogOptions on Query {
    poolAreaOfSelectionEnums: localizedEnumStrings(
      enumName: "PoolAreaOfSelection"
    ) {
      value
      label {
        localized
      }
    }
    classifications(availableInSearch: true) {
      id
      groupAndLevel
    }
    salaryRangeEnums: localizedEnumStrings(enumName: "SalaryRange") {
      value
      label {
        localized
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
    sortPoolAreaOfSelection(poolAreaOfSelectionEnums),
    intl,
  );

  const classificationOptions = unpackMaybes(classifications)
    .map((o) => ({
      value: o.id,
      label: o.groupAndLevel ?? intl.formatMessage(commonMessages.notFound),
    }))
    .toSorted((a, b) => a.label.localeCompare(b.label));

  const minimumSalaryOptions = localizedEnumToOptions(
    sortSalaryRange(salaryRangeEnums),
    intl,
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
          "Filter jobs by eligibility criteria, employment length, salary range, and more.",
        id: "H3mgnz",
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
        label={intl.formatMessage({
          defaultMessage: "Classifications",
          id: "jxRrxU",
          description: "Label for a classification picker",
        })}
        name={"classifications"}
        isMulti
      />
      <RadioGroup
        idPrefix="minimumSalary"
        legend={intl.formatMessage({
          defaultMessage: "Minimum salary",
          id: "P4sciG",
          description: "label for a minimum salary picker",
        })}
        items={minimumSalaryOptions}
        name="minimumSalary"
      />
    </FilterDialog>
  );
};

export default OpportunityDetailsFilterDialog;
