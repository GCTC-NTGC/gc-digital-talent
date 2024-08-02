import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import { Community, UpdateCommunityInput } from "@gc-digital-talent/graphql";
import { Input, RichTextInput, Submit } from "@gc-digital-talent/forms";
import {
  commonMessages,
  errorMessages,
  formMessages,
} from "@gc-digital-talent/i18n";
import { Button, ToggleSection } from "@gc-digital-talent/ui";

import labels from "../../labels";

type FormValues = {
  key: string;
  nameEn: string;
  nameFr: string;
  descriptionEn: string;
  descriptionFr: string;
};

const TEXT_AREA_MAX_WORDS = 200;

const apiDataToFormValues = (
  apiData: UpdateCommunityInput | null | undefined,
): FormValues => ({
  key: apiData?.key ?? "",
  nameEn: apiData?.name?.en ?? "",
  nameFr: apiData?.name?.fr ?? "",
  descriptionEn: apiData?.description?.en ?? "",
  descriptionFr: apiData?.description?.fr ?? "",
});

const formValuesToApiData = (formValues: FormValues): UpdateCommunityInput => ({
  key: formValues.key,
  name: {
    en: formValues.nameEn,
    fr: formValues.nameFr,
  },
  description: {
    en: formValues.descriptionEn,
    fr: formValues.descriptionFr,
  },
});

interface CommunityFormProps {
  initialData: Community | null | undefined;
  onUpdate: (data: UpdateCommunityInput) => Promise<void>;
  onOpenChange: (isOpen: boolean) => void;
  isSubmitting: boolean;
}

const CommunityForm = ({
  initialData,
  onUpdate,
  onOpenChange,
  isSubmitting,
}: CommunityFormProps) => {
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

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(handleSave)}
        data-h2-display="base(grid)"
        data-h2-gap="base(x1)"
        data-h2-grid-template-columns="base(repeat(2, 1fr))"
      >
        <Input
          id="nameEn"
          label={intl.formatMessage(labels.nameEn)}
          name="nameEn"
          type="text"
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
        <Input
          id="nameFr"
          label={intl.formatMessage(labels.nameFr)}
          name="nameFr"
          type="text"
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
        <RichTextInput
          id="descriptionEn"
          label={intl.formatMessage(labels.descriptionEn)}
          name="descriptionEn"
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          wordLimit={TEXT_AREA_MAX_WORDS}
        />
        <RichTextInput
          id="descriptionFr"
          label={intl.formatMessage(labels.descriptionFr)}
          name="descriptionFr"
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          wordLimit={TEXT_AREA_MAX_WORDS}
        />
        <Input
          id="key"
          label={intl.formatMessage(labels.key)}
          name="key"
          type="text"
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
        <div
          data-h2-grid-column="base(span 2)"
          data-h2-display="base(flex)"
          data-h2-gap="base(x.5)"
          data-h2-align-items="base(center)"
          data-h2-flex-wrap="base(wrap)"
        >
          <Submit
            text={intl.formatMessage(formMessages.saveChanges)}
            aria-label={intl.formatMessage({
              defaultMessage: "Save community",
              id: "BceI+w",
              description: "Text on a button to save community",
            })}
            color="secondary"
            mode="solid"
            isSubmitting={isSubmitting}
          />
          <ToggleSection.Close>
            <Button mode="inline" type="button" color="quaternary">
              {intl.formatMessage(commonMessages.cancel)}
            </Button>
          </ToggleSection.Close>
        </div>
      </form>
    </FormProvider>
  );
};

export default CommunityForm;
