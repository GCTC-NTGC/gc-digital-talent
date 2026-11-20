import { useState, type ReactNode } from "react";
import {
  FormProvider,
  useForm,
  type DefaultValues,
  type FieldValues,
} from "react-hook-form";
import { useIntl } from "react-intl";

import { Button, Dialog } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import browseJobsMessages from "../../browseJobsMessages";

interface FilterDialogProps<TFormValues extends FieldValues> {
  title: string;
  subtitle: string;
  trigger: ReactNode;
  // read the current filters into form values, each time the dialog opens
  getFormValues: () => DefaultValues<TFormValues>;
  onSave: (formValues: TFormValues) => void;
  onClear: () => void;
  // the form fields
  children: ReactNode;
}

/**
 * Dialog for editing a group of browse jobs filters.
 * Handles the form, syncing it with the current filters, and the save/clear/cancel footer.
 */
const FilterDialog = <TFormValues extends FieldValues>({
  title,
  subtitle,
  trigger,
  getFormValues,
  onSave,
  onClear,
  children,
}: FilterDialogProps<TFormValues>) => {
  const intl = useIntl();
  const [open, setOpen] = useState(false);

  const formMethods = useForm<TFormValues>({
    defaultValues: getFormValues(),
  });

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      formMethods.reset(getFormValues());
    }
    setOpen(newOpen);
  };

  const handleSave = (formValues: TFormValues) => {
    onSave(formValues);
    setOpen(false);
  };

  const handleClear = () => {
    onClear();
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger>{trigger}</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header subtitle={subtitle}>{title}</Dialog.Header>
        <Dialog.Body>
          <FormProvider {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(handleSave)}>
              <div className="flex flex-col gap-6">{children}</div>
              <Dialog.Footer>
                <Button type="submit" color="primary">
                  {intl.formatMessage(browseJobsMessages.saveFilters)}
                </Button>
                <Button
                  type="button"
                  color="primary"
                  mode="inline"
                  onClick={handleClear}
                >
                  {intl.formatMessage(browseJobsMessages.clearFilters)}
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

export default FilterDialog;
