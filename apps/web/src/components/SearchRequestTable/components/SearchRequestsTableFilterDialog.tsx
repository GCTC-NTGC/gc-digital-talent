import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useFormContext, SubmitHandler } from "react-hook-form";

import AdjustmentsVerticalIcon from "@heroicons/react/24/outline/AdjustmentsVerticalIcon";
import { Dialog, Button } from "@gc-digital-talent/ui";
import { BasicForm, MultiSelectField } from "@gc-digital-talent/forms";

import { ButtonIcon } from "~/components/Table/ClientManagedTable/tableComponents";
import adminMessages from "~/messages/adminMessages";

import "./SearchRequestsTableFilterDialog.css";
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
  const { reset } = useFormContext();
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
      <Button type="submit" color="primary">
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

const SearchRequestsTableFilterDialog = ({
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
        <Button
          mode="outline"
          color="secondary"
          type="button"
          data-h2-display="base(inline-flex)"
          data-h2-align-items="base(center)"
        >
          <ButtonIcon icon={AdjustmentsVerticalIcon} />
          <span>
            {formatMessage({
              defaultMessage: "Filters",
              id: "1HPhji",
              description:
                "Text label for button to open filter dialog on admin tables.",
            })}
          </span>
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
            <div data-h2-flex-grid="base(flex-start, x1, x.5)">
              <div data-h2-flex-item="base(1of1) p-tablet(1of2) laptop(3of5)">
                <MultiSelectField
                  id="status"
                  label="STATUS"
                  options={optionsData.status}
                />
              </div>
              <div data-h2-flex-item="base(1of1) p-tablet(1of2) laptop(1of3)">
                <MultiSelectField
                  id="departments"
                  label="DEPARTMENTS"
                  options={optionsData.departments}
                  isLoading={rawGraphqlResults.departments.fetching}
                />
              </div>
              <div data-h2-flex-item="base(1of1) p-tablet(1of2) laptop(1of3)">
                <MultiSelectField
                  id="classifications"
                  label="CLASSIFICATIONS"
                  options={optionsData.classifications}
                  isLoading={rawGraphqlResults.classifications.fetching}
                />
              </div>
              <div data-h2-flex-item="base(1of1) p-tablet(1of2) laptop(3of5)">
                <MultiSelectField
                  id="streams"
                  label="STREAMS"
                  options={optionsData.streams}
                />
              </div>
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

export type SearchRequestsTableFiltersProps = Pick<
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
    onSubmit(data);
    setActiveFilters(data);
    setOpen(false);
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
