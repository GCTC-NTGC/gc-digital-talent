import PlusCircleIcon from "@heroicons/react/24/solid/PlusCircleIcon";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import { defineMessage, useIntl } from "react-intl";
import { useState } from "react";

import { Select, TextArea } from "@gc-digital-talent/forms";
import {
  commonMessages,
  errorMessages,
  formMessages,
  uiMessages,
} from "@gc-digital-talent/i18n";
import { Button, Dialog } from "@gc-digital-talent/ui";

import adminMessages from "~/messages/adminMessages";

const descriptionLabel = defineMessage({
  defaultMessage: "Nomination specific context",
  id: "G1aodw",
  description: "Label for the nomination specific context textarea",
});

export interface FormValues {
  value: string;
  description: {
    en: string | null;
    fr: string | null;
  };
}

interface AddDialogProps {
  developmentProgramOptions: {
    label: string | null | undefined;
    value: string;
  }[];
  onSubmit: SubmitHandler<FormValues>;
  defaultValues?: FormValues;
  active?: boolean;
}

const AddDialog = ({
  developmentProgramOptions,
  onSubmit,
  defaultValues,
  active = false,
}: AddDialogProps) => {
  const intl = useIntl();
  const methods = useForm<FormValues>({ defaultValues });
  const [open, setOpen] = useState(false);

  const handleSubmit: SubmitHandler<FormValues> = (values) => {
    onSubmit(values);
    methods.reset();
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button
          color="primary"
          mode="placeholder"
          icon={PlusCircleIcon}
          className="w-full"
        >
          {intl.formatMessage({
            defaultMessage: "Add an opportunity",
            id: "9doHjH",
            description:
              "Button to open dialog to create development opportunity",
          })}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          subtitle={intl.formatMessage({
            defaultMessage:
              "Add options for which programs or certifications a nominee can be recommended for",
            id: "mIKz0E",
            description: "Dialog subtitle informing of purpose",
          })}
        >
          {intl.formatMessage({
            defaultMessage: "Add a development opportunity",
            id: "P5iSTk",
            description: "Dialog header informing of purpose",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <p className="mb-4.5">
            {intl.formatMessage({
              defaultMessage:
                "Select an opportunity from the list of professionalization options provided by your community.",
              id: "l4ffhH",
              description: "Explanation of dialog",
            })}
          </p>
          <FormProvider {...methods}>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                await methods.handleSubmit(handleSubmit)(e);
                return false;
              }}
            >
              {!active && (
                <Select
                  id="value"
                  name="value"
                  label={intl.formatMessage(adminMessages.professionalization)}
                  nullSelection={intl.formatMessage(
                    uiMessages.nullSelectionOption,
                  )}
                  options={developmentProgramOptions}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                />
              )}
              <div className="mt-6 grid grid-cols-2 gap-6">
                <TextArea
                  id="description_en"
                  name="description.en"
                  label={intl.formatMessage(descriptionLabel)}
                  appendLanguageToLabel={"en"}
                />
                <TextArea
                  id="description_fr"
                  name="description.fr"
                  label={intl.formatMessage(descriptionLabel)}
                  appendLanguageToLabel={"fr"}
                />
              </div>
              <Dialog.Footer>
                <Button color="primary">
                  {intl.formatMessage(formMessages.saveChanges)}
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

export default AddDialog;
