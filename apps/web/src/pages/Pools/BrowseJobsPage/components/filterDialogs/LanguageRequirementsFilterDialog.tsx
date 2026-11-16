import { useState, type ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import { Button, Dialog } from "@gc-digital-talent/ui";
import { Checklist, localizedEnumToOptions } from "@gc-digital-talent/forms";
import {
  commonMessages,
  sortLanguageAbility,
  type MaybeLocalizedEnums,
} from "@gc-digital-talent/i18n";

import useBrowseJobsSearchParams from "../../useBrowseJobsSearchParams";

interface FormValues {
  languageRequirements: string[];
}

interface Props {
  languageAbilityEnums: MaybeLocalizedEnums;
  children: ReactNode;
}

const LanguageRequirementsFilterDialog = ({
  languageAbilityEnums,
  children,
}: Props) => {
  const intl = useIntl();
  const [open, setOpen] = useState(false);

  const { resetFilter, getFilterValues, setFilterValues } =
    useBrowseJobsSearchParams();

  const getFormValuesFromFilters = (): FormValues => ({
    languageRequirements: getFilterValues("languageRequirement"),
  });

  const formMethods = useForm<FormValues>({
    defaultValues: getFormValuesFromFilters(),
  });

  const languageRequirementOptions = localizedEnumToOptions(
    sortLanguageAbility(languageAbilityEnums),
    intl,
  );

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      formMethods.reset(getFormValuesFromFilters());
    }
    setOpen(newOpen);
  };

  const handleSaveFilter = (formValues: FormValues) => {
    setFilterValues("languageRequirement", formValues.languageRequirements);
    setOpen(false);
  };

  const handleClearFilters = () => {
    resetFilter("languageRequirement");
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          subtitle={intl.formatMessage({
            defaultMessage: "Filter jobs by language requirements.",
            id: "NSowez",
            description: "Subtitle for a language requirements filters dialog",
          })}
        >
          {intl.formatMessage({
            defaultMessage: "Language requirements",
            id: "nEE/Ds",
            description: "Title for a language requirements filter dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <FormProvider {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(handleSaveFilter)}>
              <div className="flex flex-col gap-6">
                <Checklist
                  idPrefix={"languageRequirements"}
                  legend={intl.formatMessage({
                    defaultMessage: "Language requirements",
                    id: "hzJUl5",
                    description: "Title for a language requirement checklist",
                  })}
                  items={languageRequirementOptions}
                  name={"languageRequirements"}
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

export default LanguageRequirementsFilterDialog;
