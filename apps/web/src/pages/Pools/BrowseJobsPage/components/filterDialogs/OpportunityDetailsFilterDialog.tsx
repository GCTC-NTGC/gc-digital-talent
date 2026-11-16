import { useState, type ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import { Button, Dialog } from "@gc-digital-talent/ui";
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
  const [open, setOpen] = useState(false);

  const { getFilterValue, getFilterValues, setFilters } =
    useBrowseJobsSearchParams();

  const getFormValuesFromFilters = (): FormValues => ({
    applicationEligibility: getFilterValues("applicationEligibility"),
    classifications: getFilterValues("classification"),
    minimumSalary: getFilterValue("minimumSalary"),
  });

  const formMethods = useForm<FormValues>({
    defaultValues: getFormValuesFromFilters(),
  });

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

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      formMethods.reset(getFormValuesFromFilters());
    }
    setOpen(newOpen);
  };

  const handleSaveFilter = (formValues: FormValues) => {
    setFilters({
      applicationEligibility: formValues.applicationEligibility,
      classification: formValues.classifications,
      minimumSalary: formValues.minimumSalary,
    });
    setOpen(false);
  };

  const handleClearFilters = () => {
    setFilters({
      applicationEligibility: null,
      classification: null,
      minimumSalary: null,
    });
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          subtitle={intl.formatMessage({
            defaultMessage:
              "Filter jobs by eligibility criteria, employment length, salary range, and more.",
            id: "H3mgnz",
            description: "Subtitle for opportunity details dialog",
          })}
        >
          {intl.formatMessage({
            defaultMessage: "Opportunity details",
            id: "KyyLUM",
            description: "Title for opportunities filter dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <FormProvider {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(handleSaveFilter)}>
              <div className="flex flex-col gap-6">
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
              </div>
              <Dialog.Footer>
                <Button type="submit" color="primary">
                  {intl.formatMessage({
                    defaultMessage: "Save filters",
                    id: "9yKptF",
                    description: "Command to save the filter set",
                  })}
                </Button>
                <Button
                  type="button"
                  color="primary"
                  mode="inline"
                  onClick={() => handleClearFilters()}
                >
                  {intl.formatMessage({
                    defaultMessage: "Clear filters",
                    id: "OVeNqb",
                    description: "Command to clear the filter set",
                  })}
                </Button>
                <Dialog.Close>
                  <Button type="button" color="warning" mode="inline">
                    {intl.formatMessage(commonMessages.cancel)}
                  </Button>
                </Dialog.Close>
              </Dialog.Footer>
            </form>
          </FormProvider>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default OpportunityDetailsFilterDialog;
