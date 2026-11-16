import { useState, type ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import { Button, Dialog } from "@gc-digital-talent/ui";
import { Combobox } from "@gc-digital-talent/forms";
import { commonMessages } from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import useBrowseJobsSearchParams from "../../useBrowseJobsSearchParams";

interface FormValues {
  organizations: string[];
}

interface Props {
  organizations: ({ id: string; name: { localized: string | null } } | null)[];
  children: ReactNode;
}

const OrganizationsFilterDialog = ({ organizations, children }: Props) => {
  const intl = useIntl();
  const [open, setOpen] = useState(false);

  const { resetFilter, getFilterValues, setFilterValues } =
    useBrowseJobsSearchParams();

  const getFormValuesFromFilters = (): FormValues => ({
    organizations: getFilterValues("organization"),
  });

  const formMethods = useForm<FormValues>({
    defaultValues: getFormValuesFromFilters(),
  });

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      formMethods.reset(getFormValuesFromFilters());
    }
    setOpen(newOpen);
  };

  const handleSaveFilter = (formValues: FormValues) => {
    setFilterValues("organization", formValues.organizations);
    setOpen(false);
  };

  const handleClearFilters = () => {
    resetFilter("organization");
    setOpen(false);
  };

  const organizationOptions = unpackMaybes(organizations)
    .map((o) => ({
      value: o.id,
      label: o.name.localized ?? intl.formatMessage(commonMessages.notFound),
    }))
    .toSorted((a, b) => (a.label > b.label ? 1 : 0));

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          subtitle={intl.formatMessage({
            defaultMessage: "Filter jobs by hiring organization.",
            id: "St94tY",
            description: "Subtitle for organizations filter dialog",
          })}
        >
          {intl.formatMessage({
            defaultMessage: "Organizations",
            id: "XmF74L",
            description: "Title for organizations filter dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <FormProvider {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(handleSaveFilter)}>
              <Combobox
                options={organizationOptions}
                id={"organizations"}
                label={intl.formatMessage({
                  defaultMessage: "Hiring organizations",
                  id: "LRR7iu",
                  description: "Label for an organization picker",
                })}
                name={"organizations"}
                isMulti
              ></Combobox>
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

export default OrganizationsFilterDialog;
