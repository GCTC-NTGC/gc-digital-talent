import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";
import QuestionMarkCircleIcon from "@heroicons/react/24/outline/QuestionMarkCircleIcon";

import { Button, ToggleSection } from "@gc-digital-talent/ui";
import { RichTextInput, Submit } from "@gc-digital-talent/forms";
import { commonMessages, formMessages } from "@gc-digital-talent/i18n";
import {
  PoolStatus,
  LocalizedString,
  Pool,
  UpdatePoolInput,
  graphql,
  FragmentType,
  getFragment,
} from "@gc-digital-talent/graphql";

import {
  hasAllEmptyFields,
  hasOneEmptyField,
} from "~/validators/process/whatToExpectAdmission";
import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";
import ToggleForm from "~/components/ToggleForm/ToggleForm";
import useCanUserEditPool from "~/hooks/useCanUserEditPool";

import { useEditPoolContext } from "../EditPoolContext";
import { PublishedEditableSectionProps, SectionProps } from "../../types";
import Display from "./Display";
import ActionWrapper from "../ActionWrapper";
import UpdatePublishedProcessDialog, {
  type FormValues as UpdateFormValues,
} from "../UpdatePublishedProcessDialog/UpdatePublishedProcessDialog";

const EditPoolWhatToExpectAdmission_Fragment = graphql(/* GraphQL */ `
  fragment EditPoolWhatToExpectAdmission on Pool {
    ...UpdatePublishedProcessDialog
    id
    status {
      value
      label {
        en
        fr
      }
    }
    whatToExpectAdmission {
      en
      fr
    }
  }
`);

interface FormValues {
  whatToExpectAdmissionEn?: LocalizedString["en"];
  whatToExpectAdmissionFr?: LocalizedString["fr"];
}

export type WhatToExpectAdmissionSubmitData = Pick<
  UpdatePoolInput,
  "whatToExpectAdmission"
>;

type WhatToExpectAdmissionSectionProps = SectionProps<
  WhatToExpectAdmissionSubmitData,
  FragmentType<typeof EditPoolWhatToExpectAdmission_Fragment>
> &
  PublishedEditableSectionProps;

const TEXT_AREA_MAX_WORDS_EN = 200;
const TEXT_AREA_MAX_WORDS_FR = TEXT_AREA_MAX_WORDS_EN + 100;

const WhatToExpectAdmissionSection = ({
  poolQuery,
  sectionMetadata,
  onSave,
  onUpdatePublished,
}: WhatToExpectAdmissionSectionProps) => {
  const intl = useIntl();
  const pool = getFragment(EditPoolWhatToExpectAdmission_Fragment, poolQuery);
  const isNull = hasAllEmptyFields(pool);
  const canEdit = useCanUserEditPool(pool.status?.value);
  const { isSubmitting } = useEditPoolContext();
  const { isEditing, setIsEditing, icon } = useToggleSectionInfo({
    isNull,
    emptyRequired: hasOneEmptyField(pool),
    fallbackIcon: QuestionMarkCircleIcon,
    optional: true,
  });

  const dataToFormValues = (initialData: Pool): FormValues => ({
    whatToExpectAdmissionEn: initialData.whatToExpectAdmission?.en ?? "",
    whatToExpectAdmissionFr: initialData.whatToExpectAdmission?.fr ?? "",
  });

  const methods = useForm<FormValues>({
    defaultValues: dataToFormValues(pool),
  });
  const { handleSubmit, watch } = methods;
  const values = watch();

  const onSuccess = (formValues: FormValues) => {
    methods.reset(formValues, { keepDirty: true });
    setIsEditing(false);
  };

  const handleSave = async (formValues: FormValues) => {
    return onSave({
      whatToExpectAdmission: {
        en: formValues.whatToExpectAdmissionEn,
        fr: formValues.whatToExpectAdmissionFr,
      },
    })
      .then(() => onSuccess(formValues))
      .catch(() => methods.reset(formValues));
  };

  const handleUpdatePublished = async (formValues: UpdateFormValues) => {
    await onUpdatePublished({
      ...formValues,
      whatToExpectAdmission: {
        en: values.whatToExpectAdmissionEn,
        fr: values.whatToExpectAdmissionFr,
      },
    }).then(() => onSuccess({ ...values }));
  };

  const subtitle = intl.formatMessage({
    defaultMessage:
      "This information helps applicants understand what it means to be in a recruitment process and what they should expect as qualified candidates.",
    id: "zLuuVe",
    description:
      "Describes the 'what to expect after admission' section of a process' advertisement.",
  });

  return (
    <ToggleSection.Root
      id={`${sectionMetadata.id}-form`}
      open={isEditing}
      onOpenChange={setIsEditing}
    >
      <ToggleSection.Header
        icon={icon.icon}
        color={icon.color}
        level="h3"
        size="h4"
        toggle={
          <ToggleForm.LabelledTrigger
            disabled={!canEdit}
            sectionTitle={sectionMetadata.title}
          />
        }
        data-h2-font-weight="base(bold)"
      >
        {sectionMetadata.title}
      </ToggleSection.Header>
      <p>{subtitle}</p>
      <ToggleSection.Content>
        <ToggleSection.InitialContent>
          {isNull ? <ToggleForm.NullDisplay /> : <Display pool={pool} />}
        </ToggleSection.InitialContent>
        <ToggleSection.OpenContent>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleSave)}>
              <div
                data-h2-display="base(grid)"
                data-h2-gap="base(x1)"
                data-h2-grid-template-columns="l-tablet(repeat(2, 1fr))"
              >
                <RichTextInput
                  id="whatToExpectAdmissionEn"
                  label={intl.formatMessage({
                    defaultMessage: "English - What to expect",
                    id: "o7OKLq",
                    description:
                      "Label for the English - What to expect textarea in the edit pool page.",
                  })}
                  name="whatToExpectAdmissionEn"
                  wordLimit={TEXT_AREA_MAX_WORDS_EN}
                  readOnly={!canEdit}
                />
                <RichTextInput
                  id="whatToExpectAdmissionFr"
                  label={intl.formatMessage({
                    defaultMessage: "French - What to expect",
                    id: "zDHOiY",
                    description:
                      "Label for the French - What to expect textarea in the edit pool page.",
                  })}
                  name="whatToExpectAdmissionFr"
                  wordLimit={TEXT_AREA_MAX_WORDS_FR}
                  readOnly={!canEdit}
                />
              </div>

              <ActionWrapper>
                {canEdit && pool.status?.value === PoolStatus.Draft && (
                  <Submit
                    text={intl.formatMessage(formMessages.saveChanges)}
                    aria-label={intl.formatMessage({
                      defaultMessage: "Save what to expect",
                      id: "wimmA1",
                      description:
                        "Text on a button to save the pool what to expect",
                    })}
                    color="secondary"
                    mode="solid"
                    isSubmitting={isSubmitting}
                  />
                )}
                {canEdit && pool.status?.value === PoolStatus.Published && (
                  <UpdatePublishedProcessDialog
                    poolQuery={pool}
                    onUpdatePublished={handleUpdatePublished}
                  />
                )}
                <ToggleSection.Close>
                  <Button mode="inline" type="button" color="warning">
                    {intl.formatMessage(commonMessages.cancel)}
                  </Button>
                </ToggleSection.Close>
              </ActionWrapper>
            </form>
          </FormProvider>
        </ToggleSection.OpenContent>
      </ToggleSection.Content>
    </ToggleSection.Root>
  );
};

export default WhatToExpectAdmissionSection;
