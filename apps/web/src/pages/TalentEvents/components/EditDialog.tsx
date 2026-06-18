import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import { defineMessage, useIntl } from "react-intl";
import { type Dispatch, type SetStateAction } from "react";

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

interface EditDialogProps {
  communityDevelopmentProgramId: string;
  developmentProgramOptions: {
    label: string | null | undefined;
    value: string;
  }[];
  onSubmit: SubmitHandler<FormValues>;
  defaultValues?: FormValues;
  active?: boolean;
  open: boolean;
  setOpen: Dispatch<SetStateAction<string | null>>;
}

const EditDialog = ({
  communityDevelopmentProgramId,
  developmentProgramOptions,
  onSubmit,
  defaultValues,
  active = false,
  open,
  setOpen,
}: EditDialogProps) => {
  const intl = useIntl();
  const methods = useForm<FormValues>({ defaultValues });

  const handleSubmit: SubmitHandler<FormValues> = (values) => {
    onSubmit(values);
    methods.reset();
    setOpen(null);
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(isOpen) => {
        if (isOpen) {
          setOpen(communityDevelopmentProgramId);
        } else {
          setOpen(null);
        }
      }}
    >
      <Dialog.Content>
        <Dialog.Header
          subtitle={intl.formatMessage({
            defaultMessage:
              "Edit options for which programs or certifications a nominee can be recommended for",
            id: "fqotTc",
            description: "Dialog subtitle informing of purpose",
          })}
        >
          {intl.formatMessage({
            defaultMessage: "Edit a development opportunity",
            id: "XgV3g1",
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

export default EditDialog;
