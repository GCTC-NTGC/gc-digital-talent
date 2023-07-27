import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useFormContext, SubmitHandler } from "react-hook-form";

import AdjustmentsVerticalIcon from "@heroicons/react/24/outline/AdjustmentsVerticalIcon";
import { Dialog, Button } from "@gc-digital-talent/ui";
import { BasicForm, MultiSelectField } from "@gc-digital-talent/forms";

import adminMessages from "~/messages/adminMessages";

import useFilterOptions from "./utils";

type Option = { value: string; label: string };

export type FormValues = {
  status: Option["value"][];
  departments: Option["value"][];
  classifications: Option["value"][];
  streams: Option["value"][];
};

const Footer = (): JSX.Element => {
  const { formatMessage } = useIntl();
  const {
    reset,
    formState: { isSubmitting },
  } = useFormContext();
  const { emptyFormValues } = useFilterOptions();
  const handleClear = () => {
    reset(emptyFormValues);
  };

  return (
    <>
      <Button color="secondary" mode="inline" onClick={handleClear}>
        {formatMessage({
          description: "Clear button within the search filter dialog",
          defaultMessage: "Clear filters",
          id: "uC0YPE",
        })}
      </Button>
      <Button type="submit" color="primary" disabled={isSubmitting}>
        {formatMessage({
          description: "Submit button within the search filter dialog",
          defaultMessage: "Show results",
          id: "V4+lDw",
        })}
      </Button>
    </>
  );
};

interface SearchRequestsTableFilterDialogProps {
  isOpen?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: SubmitHandler<FormValues>;
  activeFilters: FormValues;
}

export const SearchRequestsTableFilterDialog = ({
  onSubmit,
  activeFilters,
  isOpen,
  onOpenChange,
}: SearchRequestsTableFilterDialogProps): JSX.Element => {
  const { formatMessage } = useIntl();
  const { optionsData, rawGraphqlResults } = useFilterOptions();

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Trigger>
        <Button color="secondary" type="button" icon={AdjustmentsVerticalIcon}>
          {formatMessage({
            defaultMessage: "Filters",
            id: "1HPhji",
            description:
              "Text label for button to open filter dialog on admin tables.",
          })}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          subtitle={formatMessage({
            defaultMessage:
              "Narrow down your table results using the following filters.",
            id: "hqZfyb",
            description: "Candidate search filter dialog: subtitle",
          })}
        >
          {formatMessage({
            defaultMessage: "Select filters",
            id: "P9SZBZ",
            description: "Candidate search filter dialog: title",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <BasicForm
            {...{ onSubmit }}
            options={{
              defaultValues: activeFilters,
            }}
          >
            <div
              data-h2-display="base(grid)"
              data-h2-grid-template-columns="p-tablet(repeat(2, 1fr))"
              data-h2-gap="base(x1)"
            >
              <MultiSelectField
                id="status"
                name="status"
                label={formatMessage(adminMessages.status)}
                options={optionsData.status}
                doNotSort
              />
              <MultiSelectField
                id="departments"
                name="departments"
                label={formatMessage(adminMessages.departments)}
                options={optionsData.departments}
                isLoading={rawGraphqlResults.departments.fetching}
              />
              <MultiSelectField
                id="classifications"
                name="classifications"
                label={formatMessage(adminMessages.classifications)}
                options={optionsData.classifications}
                isLoading={rawGraphqlResults.classifications.fetching}
              />
              <MultiSelectField
                id="streams"
                name="streams"
                label={formatMessage(adminMessages.streams)}
                options={optionsData.streams}
              />
            </div>
            <Dialog.Footer>
              <Footer />
            </Dialog.Footer>
          </BasicForm>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

type SearchRequestsTableFiltersProps = Pick<
  SearchRequestsTableFilterDialogProps,
  "onSubmit"
> & {
  isOpenDefault?: boolean;
  initialFilters?: FormValues;
};

const SearchRequestsTableFilters = ({
  onSubmit,
  isOpenDefault = false,
  initialFilters,
  ...rest
}: SearchRequestsTableFiltersProps) => {
  const [isOpen, setOpen] = React.useState<boolean>(isOpenDefault);
  const { emptyFormValues } = useFilterOptions();
  const initialStateActiveFilters = initialFilters ?? emptyFormValues;
  const [activeFilters, setActiveFilters] = useState<FormValues>(
    initialStateActiveFilters,
  );

  const handleSubmit: SubmitHandler<FormValues> = (data) => {
    setActiveFilters(data);
    setOpen(false);
    return onSubmit(data);
  };

  return (
    <SearchRequestsTableFilterDialog
      {...{ activeFilters, isOpenDefault, isOpen }}
      {...rest}
      onOpenChange={setOpen}
      onSubmit={handleSubmit}
    />
  );
};

export default SearchRequestsTableFilters;
