import * as React from "react";
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
import { errorMessages } from "@gc-digital-talent/i18n";

import labels from "./labels";

const invalidDateTimeMessage = defineMessage({
  defaultMessage: "Enter the date in the form yyyy-MM-dd HH:mm:ss",
  id: "OSoezC",
  description: "Instructions to enter the date in the API DateTime scalar form",
});

export type FormValues = {
  isEnabled: Scalars["Boolean"]["input"];
  publishDate: Scalars["DateTime"]["input"];
  expiryDate: Scalars["DateTime"]["input"];
  messageEn: string;
  messageFr: string;
};

const apiDataToFormValues = (
  apiData: SitewideAnnouncement | null | undefined,
): FormValues => ({
  isEnabled: !!apiData?.isEnabled,
  publishDate: apiData?.publishDate ?? nowUTCDateTime(),
  expiryDate: apiData?.expiryDate ?? nowUTCDateTime(),
  messageEn: apiData?.message.en ?? "",
  messageFr: apiData?.message.fr ?? "",
});

const formValuesToApiData = (formValues: FormValues): SitewideAnnouncement => ({
  isEnabled: formValues.isEnabled,
  publishDate: formValues.publishDate,
  expiryDate: formValues.expiryDate,
  message: {
    en: formValues.messageEn,
    fr: formValues.messageFr,
  },
});

interface SitewideAnnouncementFormProps {
  initialData: SitewideAnnouncement | null | undefined;
  onUpdate: (data: SitewideAnnouncementInput) => Promise<void>;
  setIsEditing: (isEditing: boolean) => void;
}

export const SitewideAnnouncementForm = ({
  initialData,
  onUpdate,
  setIsEditing,
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
        setIsEditing(false);
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
    <section data-h2-container="base(left, s)">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(handleSave)}
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-gap="base(x.5 0)"
        >
          <SwitchInput
            id="isEnabled"
            name="isEnabled"
            label={intl.formatMessage(labels.isEnabled)}
          />
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
          <RichTextInput
            id="messageEn"
            label={intl.formatMessage(labels.messageEn)}
            name="messageEn"
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
          <RichTextInput
            id="messageFr"
            label={intl.formatMessage(labels.messageFr)}
            name="messageFr"
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />

          <div data-h2-align-self="base(flex-start)">
            <Submit />
          </div>
        </form>
      </FormProvider>
    </section>
  );
};

export default SitewideAnnouncementForm;
