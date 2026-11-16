import { useState, type ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import { Button, Dialog } from "@gc-digital-talent/ui";
import {
  Checklist,
  Input,
  localizedEnumToOptions,
} from "@gc-digital-talent/forms";
import {
  commonMessages,
  sortPoolPublishedRange,
  type MaybeLocalizedEnums,
} from "@gc-digital-talent/i18n";

import useBrowseJobsSearchParams from "../../useBrowseJobsSearchParams";

interface FormValues {
  advertisementTimings: string[];
  processNumber: string | null;
}

interface Props {
  poolPublishedRangeEnums: MaybeLocalizedEnums;
  children: ReactNode;
}

const AdvancedFiltersDialog = ({
  poolPublishedRangeEnums,
  children,
}: Props) => {
  const intl = useIntl();
  const [open, setOpen] = useState(false);

  const { getFilterValue, getFilterValues, setFilters } =
    useBrowseJobsSearchParams();

  const getFormValuesFromFilters = (): FormValues => ({
    advertisementTimings: getFilterValues("advertisementTiming"),
    processNumber: getFilterValue("processNumber"),
  });

  const formMethods = useForm<FormValues>({
    defaultValues: getFormValuesFromFilters(),
  });

  const advertisementTimingOptions = localizedEnumToOptions(
    sortPoolPublishedRange(poolPublishedRangeEnums),
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
      advertisementTiming: formValues.advertisementTimings,
      processNumber: formValues.processNumber,
    });
    setOpen(false);
  };

  const handleClearFilters = () => {
    setFilters({ advertisementTiming: null, processNumber: null });
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          subtitle={intl.formatMessage({
            defaultMessage:
              "Filter jobs by equity groups, employment conditions and more.",
            id: "BH2C9x",
            description: "Subtitle for advanced filters dialog",
          })}
        >
          {intl.formatMessage({
            defaultMessage: "Advanced filters",
            id: "+D4k6z",
            description: "Title for advanced filters dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <FormProvider {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(handleSaveFilter)}>
              <div className="flex flex-col gap-6">
                <Checklist
                  idPrefix={"advertisementTimings"}
                  legend={intl.formatMessage({
                    defaultMessage: "Timing of advertisement",
                    id: "3f0YY3",
                    description:
                      "Title for a timing of advertisement checklist",
                  })}
                  items={advertisementTimingOptions}
                  name={"advertisementTimings"}
                />
                <Input
                  type="text"
                  id="processNumber"
                  label={intl.formatMessage({
                    defaultMessage: "Reference or selection process number",
                    id: "m8vrqy",
                    description: "Label for a process number input",
                  })}
                  name="processNumber"
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

export default AdvancedFiltersDialog;
