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
  type MaybeLocalizedEnums,
} from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import useBrowseJobsSearchParams from "../../useBrowseJobsSearchParams";
import FilterDialog from "./FilterDialog";

interface FormValues {
  applicationEligibility: string[];
  classifications: string[];
  minimumSalary: string | null;
}

interface Props {
  poolAreaOfSelectionEnums: MaybeLocalizedEnums;
  classifications: ({
    id: string;
    groupAndLevel: string | null;
  } | null)[];
  salaryRangeEnums: MaybeLocalizedEnums;
  children: ReactNode;
}

const OpportunityDetailsFilterDialog = ({
  poolAreaOfSelectionEnums,
  classifications,
  salaryRangeEnums,
  children,
}: Props) => {
  const intl = useIntl();
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
        applicationEligibility: getFilterValues("applicationEligibility"),
        classifications: getFilterValues("classification"),
        minimumSalary: getFilterValue("minimumSalary"),
      })}
      onSave={(formValues) =>
        setFilters({
          applicationEligibility: formValues.applicationEligibility,
          classification: formValues.classifications,
          minimumSalary: formValues.minimumSalary,
        })
      }
      onClear={() =>
        setFilters({
          applicationEligibility: null,
          classification: null,
          minimumSalary: null,
        })
      }
    >
      <Checklist
        idPrefix={"applicationEligibility"}
        legend={intl.formatMessage({
          defaultMessage: "Application eligibility",
          id: "P3U7AV",
          description: "Title for an area of selection checklist",
        })}
        items={areaOfSelectionOptions}
        name={"applicationEligibility"}
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
