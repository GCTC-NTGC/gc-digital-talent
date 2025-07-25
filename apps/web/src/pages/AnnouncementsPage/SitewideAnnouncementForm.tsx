import { FormProvider, ValidateResult, useForm } from "react-hook-form";
import { defineMessage, useIntl } from "react-intl";

import {
  formDateTimeStringToDate,
  nowUTCDateTime,
} from "@gc-digital-talent/date-helpers";
import {
  Scalars,
  SitewideAnnouncement,
  SitewideAnnouncementInput,
} from "@gc-digital-talent/graphql";
import {
  Input,
  RichTextInput,
  Submit,
  SwitchInput,
} from "@gc-digital-talent/forms";
import {
  commonMessages,
  errorMessages,
  formMessages,
} from "@gc-digital-talent/i18n";
import { Button, ToggleSection } from "@gc-digital-talent/ui";

import labels from "./labels";

const invalidDateTimeMessage = defineMessage({
  defaultMessage: "Enter the date in the format yyyy-MM-dd HH:mm:ss",
  id: "deiBi4",
  description:
    "Instructions to enter the date in the API DateTime scalar format",
});

interface FormValues {
  isEnabled: Scalars["Boolean"]["input"];
  publishDate: Scalars["DateTime"]["input"];
  expiryDate: Scalars["DateTime"]["input"];
  titleEn: string;
  messageEn: string;
  titleFr: string;
  messageFr: string;
}

const apiDataToFormValues = (
  apiData: SitewideAnnouncement | null | undefined,
): FormValues => ({
  isEnabled: !!apiData?.isEnabled,
  publishDate: apiData?.publishDate ?? nowUTCDateTime(),
  expiryDate: apiData?.expiryDate ?? nowUTCDateTime(),
  titleEn: apiData?.title.en ?? "",
  messageEn: apiData?.message.en ?? "",
  titleFr: apiData?.title.fr ?? "",
  messageFr: apiData?.message.fr ?? "",
});

const formValuesToApiData = (formValues: FormValues): SitewideAnnouncement => ({
  isEnabled: formValues.isEnabled,
  publishDate: formValues.publishDate,
  expiryDate: formValues.expiryDate,
  title: {
    en: formValues.titleEn,
    fr: formValues.titleFr,
  },
  message: {
    en: formValues.messageEn,
    fr: formValues.messageFr,
  },
});

interface SitewideAnnouncementFormProps {
  initialData: SitewideAnnouncement | null | undefined;
  onUpdate: (data: SitewideAnnouncementInput) => Promise<void>;
  onOpenChange: (isOpen: boolean) => void;
  isSubmitting: boolean;
}

const SitewideAnnouncementForm = ({
  initialData,
  onUpdate,
  onOpenChange,
  isSubmitting,
}: SitewideAnnouncementFormProps) => {
  const intl = useIntl();
  const methods = useForm<FormValues>({
    defaultValues: apiDataToFormValues(initialData),
  });
  const { handleSubmit } = methods;

  const handleSave = async (formValues: FormValues) => {
    return onUpdate(formValuesToApiData(formValues))
      .then(() => {
        methods.reset(formValues, {
          keepDirty: false,
        });
        onOpenChange(false);
      })
      .catch(() => methods.reset(formValues));
  };

  const validateDateTimeInput = (value: string | null): ValidateResult => {
    if (!value) {
      return intl.formatMessage(invalidDateTimeMessage);
    }
    try {
      const parsedValue = formDateTimeStringToDate(value);
      if (Number.isNaN(parsedValue.getTime())) {
        return intl.formatMessage(invalidDateTimeMessage);
      }
      return undefined;
    } catch {
      return intl.formatMessage(invalidDateTimeMessage);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleSave)}>
        <div className="mb-6 grid gap-6 xs:grid-cols-2">
          <div className="xs:col-span-2">
            <SwitchInput
              id="isEnabled"
              name="isEnabled"
              label={intl.formatMessage(labels.isEnabled)}
            />
          </div>
          <Input
            id="publishDate"
            label={intl.formatMessage(labels.publishDateUtc)}
            name="publishDate"
            type="text"
            rules={{
              required: intl.formatMessage(errorMessages.required),
              validate: validateDateTimeInput,
            }}
          />
          <Input
            id="expiryDate"
            label={intl.formatMessage(labels.expiryDateUtc)}
            name="expiryDate"
            type="text"
            rules={{
              required: intl.formatMessage(errorMessages.required),
              validate: validateDateTimeInput,
            }}
          />
          <Input
            id="titleEn"
            label={intl.formatMessage(commonMessages.title)}
            appendLanguageToLabel={"en"}
            name="titleEn"
            type="text"
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
          <Input
            id="titleFr"
            label={intl.formatMessage(commonMessages.title)}
            appendLanguageToLabel={"fr"}
            name="titleFr"
            type="text"
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
          <RichTextInput
            id="messageEn"
            label={intl.formatMessage(labels.message)}
            appendLanguageToLabel={"en"}
            name="messageEn"
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
          <RichTextInput
            id="messageFr"
            label={intl.formatMessage(labels.message)}
            appendLanguageToLabel={"fr"}
            name="messageFr"
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
        </div>
        <div className="flex flex-col flex-wrap items-center gap-3 xs:flex-row">
          <Submit
            text={intl.formatMessage(formMessages.saveChanges)}
            aria-label={intl.formatMessage({
              defaultMessage: "Save sitewide announcement",
              id: "dyzeVv",
              description: "Text on a button to save the sitewide announcement",
            })}
            color="secondary"
            mode="solid"
            isSubmitting={isSubmitting}
          />
          <ToggleSection.Close>
            <Button mode="inline" type="button" color="warning">
              {intl.formatMessage(commonMessages.cancel)}
            </Button>
          </ToggleSection.Close>
        </div>
      </form>
    </FormProvider>
  );
};

export default SitewideAnnouncementForm;
