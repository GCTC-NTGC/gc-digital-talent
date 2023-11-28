import React from "react";
import { useIntl } from "react-intl";
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  UseFormProps,
  useForm,
} from "react-hook-form";
import AdjustmentsVerticalIcon from "@heroicons/react/20/solid/AdjustmentsVerticalIcon";

import { Dialog, Button } from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";

// Used by specific dialogs
export type CommonFilterDialogProps<TFieldValues extends FieldValues> = {
  onSubmit: SubmitHandler<TFieldValues>;
  defaultValues?: Partial<TFieldValues>;
};

type FilterDialogProps<TFieldValues extends FieldValues> = {
  onSubmit: CommonFilterDialogProps<TFieldValues>["onSubmit"];
  options?: UseFormProps<TFieldValues, unknown>;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

const FilterDialog = <TFieldValues extends FieldValues>({
  onSubmit,
  options,
  children,
  defaultOpen = false,
}: FilterDialogProps<TFieldValues>) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(defaultOpen);
  const intl = useIntl();
  const methods = useForm({
    mode: "onSubmit",
    ...options,
    defaultValues: options?.defaultValues,
  });
  const {
    watch,
    reset,
    formState: { isSubmitting },
  } = methods;
  const values = watch();
  const filterCount = Object.values(values).filter((value) => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value && notEmpty(value);
  }).length;

  const handleSubmit: SubmitHandler<TFieldValues> = async (
    newValues: TFieldValues,
  ) => {
    await onSubmit(newValues);
    setIsOpen(false);
  };

  const handleClear = async () => {
    reset();
    await methods.handleSubmit(onSubmit)();
    setIsOpen(false);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button
          color="quaternary"
          type="button"
          icon={AdjustmentsVerticalIcon}
          {...(filterCount > 0 && {
            counter: filterCount,
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
                <Button
                  color="secondary"
                  mode="inline"
                  type="reset"
                  onClick={handleClear}
                >
                  {intl.formatMessage({
                    description: "Clear button within the search filter dialog",
                    defaultMessage: "Clear filters",
                    id: "uC0YPE",
                  })}
                </Button>
                <Button type="submit" color="primary" disabled={isSubmitting}>
                  {intl.formatMessage({
                    description:
                      "Submit button within the search filter dialog",
                    defaultMessage: "Show results",
                    id: "V4+lDw",
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
