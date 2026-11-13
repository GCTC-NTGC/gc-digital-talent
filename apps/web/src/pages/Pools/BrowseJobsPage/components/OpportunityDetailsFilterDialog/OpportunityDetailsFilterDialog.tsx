import { useState, type ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { Button, Dialog, Pending } from "@gc-digital-talent/ui";
import { Checklist, localizedEnumToOptions } from "@gc-digital-talent/forms";
import { graphql } from "@gc-digital-talent/graphql";
import {
  commonMessages,
  sortPoolAreaOfSelection,
} from "@gc-digital-talent/i18n";

import useBrowseJobsSearchParams from "../../useBrowseJobsSearchParams";

const OpportunityDetailsFilterOptions_Fragment = graphql(/* GraphQL */ `
  query OpportunityDetailsFilterOptions {
    areasOfSelection: localizedEnumStrings(enumName: "PoolAreaOfSelection") {
      value
      label {
        localized
      }
    }
  }
`);

interface FormValues {
  applicationEligibility: string[];
}

interface Props {
  children: ReactNode;
}

const OpportunityDetailsFilterDialog = ({ children }: Props) => {
  const intl = useIntl();
  const [open, setOpen] = useState(false);

  const { resetFilter, getFilterValues, setFilterValues } =
    useBrowseJobsSearchParams();

  const formMethods = useForm<FormValues>({
    defaultValues: {
      applicationEligibility: getFilterValues("applicationEligibility"),
    },
  });

  const [{ data, fetching, error }] = useQuery({
    query: OpportunityDetailsFilterOptions_Fragment,
    pause: !open,
  });

  const areaOfSelectionOptions = localizedEnumToOptions(
    sortPoolAreaOfSelection(data?.areasOfSelection),
    intl,
  );

  const handleSaveFilter = (formValues: FormValues) => {
    setFilterValues(
      "applicationEligibility",
      formValues.applicationEligibility,
    );
    setOpen(false);
  };

  const handleClearFilters = () => {
    resetFilter("applicationEligibility");
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
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
          <Pending fetching={fetching} error={error}>
            <FormProvider {...formMethods}>
              <form onSubmit={formMethods.handleSubmit(handleSaveFilter)}>
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
          </Pending>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default OpportunityDetailsFilterDialog;
