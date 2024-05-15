import * as React from "react";
import { useIntl } from "react-intl";
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  UseFormProps,
  useForm,
  DefaultValues,
} from "react-hook-form";
import AdjustmentsVerticalIcon from "@heroicons/react/20/solid/AdjustmentsVerticalIcon";

import { Dialog, Button } from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";

// Used by specific dialogs
export type CommonFilterDialogProps<TFieldValues extends FieldValues> = {
  onSubmit: SubmitHandler<TFieldValues>;
  /** When the user resets filters they will return to these values. If initialValues is empty, resetValues is used to initialize the filters. */
  resetValues: TFieldValues;
  /** If initialValues is set, it will override resetValues when the filter form is first initialized. */
  initialValues?: Partial<TFieldValues>;
};

type FilterDialogProps<TFieldValues extends FieldValues> = {
  onSubmit: CommonFilterDialogProps<TFieldValues>["onSubmit"];
  options?: UseFormProps<TFieldValues, unknown>;
  // Values to reset to (removing URL state)
  resetValues: CommonFilterDialogProps<TFieldValues>["resetValues"];
  defaultOpen?: boolean;
  children: React.ReactNode;
  /** Modify the filter count in the button (most commonly used for hidden filters) */
  modifyFilterCount?: number;
};

const FilterDialog = <TFieldValues extends FieldValues>({
  onSubmit,
  options,
  children,
  resetValues,
  modifyFilterCount,
  defaultOpen = false,
}: FilterDialogProps<TFieldValues>) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(defaultOpen);
  const intl = useIntl();
  const defaultValues =
    options?.defaultValues ??
    (resetValues as DefaultValues<TFieldValues> | undefined);
  const methods = useForm({
    mode: "onSubmit",
    ...options,
    defaultValues,
  });
  const {
    reset,
    formState: { isSubmitting },
  } = methods;
  // Spreading removes the `ReadOnly` type
  const [activeFilters, setActiveFilters] = React.useState<
    Partial<TFieldValues>
  >({ ...options?.defaultValues });
  const filterCount = Object.values(activeFilters ?? {}).filter((value) => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value && notEmpty(value);
  }).length;

  const handleSubmit: SubmitHandler<TFieldValues> = async (
    newValues: TFieldValues,
  ) => {
    setActiveFilters(newValues);
    await onSubmit(newValues);
    setIsOpen(false);
  };

  // Reset form and submit
  const handleClear = async () => {
    reset(resetValues);
    setActiveFilters(resetValues);
    await methods.handleSubmit(onSubmit)();
    setIsOpen(false);
  };

  // Reset the form with no submission on close
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      reset((currentValues) => ({
        ...currentValues,
        ...activeFilters,
      }));
    }

    setIsOpen(newOpen);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Trigger>
        <Button
          color="quaternary"
          type="button"
          icon={AdjustmentsVerticalIcon}
          {...(filterCount > 0 && {
            counter: filterCount + (modifyFilterCount ?? 0),
          })}
        >
          {intl.formatMessage({
            defaultMessage: "Filters",
            id: "1HPhji",
            description:
              "Text label for button to open filter dialog on admin tables.",
          })}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content wide>
        <Dialog.Header
          subtitle={intl.formatMessage({
            defaultMessage:
              "Narrow down your table results using the following filters.",
            id: "hqZfyb",
            description: "Candidate search filter dialog: subtitle",
          })}
        >
          {intl.formatMessage({
            defaultMessage: "Select filters",
            id: "P9SZBZ",
            description: "Candidate search filter dialog: title",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)}>
              {children}
              <Dialog.Footer>
                <Button type="submit" color="secondary" disabled={isSubmitting}>
                  {intl.formatMessage({
                    description:
                      "Submit button within the search filter dialog",
                    defaultMessage: "Show results",
                    id: "V4+lDw",
                  })}
                </Button>
                <Button
                  color="warning"
                  mode="inline"
                  type="reset"
                  onClick={handleClear}
                >
                  {intl.formatMessage({
                    description:
                      "Button text to reset table filters to the default values",
                    defaultMessage: "Reset filters",
                    id: "ROfrit",
                  })}
                </Button>
              </Dialog.Footer>
            </form>
          </FormProvider>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default FilterDialog;
