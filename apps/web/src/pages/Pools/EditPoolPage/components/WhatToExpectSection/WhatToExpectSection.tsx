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

import { hasAllEmptyFields } from "~/validators/process/whatToExpect";
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

const EditPoolWhatToExpect_Fragment = graphql(/* GraphQL */ `
  fragment EditPoolWhatToExpect on Pool {
    ...UpdatePublishedProcessDialog
    id
    status {
      value
      label {
        en
        fr
      }
    }
    whatToExpect {
      en
      fr
    }
  }
`);

interface FormValues {
  whatToExpectEn?: LocalizedString["en"];
  whatToExpectFr?: LocalizedString["fr"];
}

export type WhatToExpectSubmitData = Pick<UpdatePoolInput, "whatToExpect">;

type WhatToExpectSectionProps = SectionProps<
  WhatToExpectSubmitData,
  FragmentType<typeof EditPoolWhatToExpect_Fragment>
> &
  PublishedEditableSectionProps;

const TEXT_AREA_MAX_WORDS_EN = 200;
const TEXT_AREA_MAX_WORDS_FR = TEXT_AREA_MAX_WORDS_EN + 100;

const WhatToExpectSection = ({
  poolQuery,
  sectionMetadata,
  onSave,
  onUpdatePublished,
}: WhatToExpectSectionProps) => {
  const intl = useIntl();
  const pool = getFragment(EditPoolWhatToExpect_Fragment, poolQuery);
  const isNull = hasAllEmptyFields(pool);
  const canEdit = useCanUserEditPool(pool.status?.value);
  const { isSubmitting } = useEditPoolContext();
  const { isEditing, setIsEditing, icon } = useToggleSectionInfo({
    isNull,
    emptyRequired: false,
    fallbackIcon: QuestionMarkCircleIcon,
    optional: true,
  });

  const dataToFormValues = (initialData: Pool): FormValues => ({
    whatToExpectEn: initialData.whatToExpect?.en ?? "",
    whatToExpectFr: initialData.whatToExpect?.fr ?? "",
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
      whatToExpect: {
        en: formValues.whatToExpectEn,
        fr: formValues.whatToExpectFr,
      },
    })
      .then(() => onSuccess(formValues))
      .catch(() => methods.reset(formValues));
  };

  const handleUpdatePublished = async (formValues: UpdateFormValues) => {
    await onUpdatePublished({
      ...formValues,
      whatToExpect: {
        en: values.whatToExpectEn,
        fr: values.whatToExpectFr,
      },
    }).then(() => onSuccess({ ...values }));
  };

  const subtitle = intl.formatMessage({
    defaultMessage:
      "This information lets applicants know what they can expect after they apply, such as further exams, meeting with managers directly, and possible timelines.",
    id: "+/ZsxX",
    description:
      "Describes the 'what to expect after applying' section of a process' advertisement.",
  });

  return (
    <ToggleSection.Root
      id={`${sectionMetadata.id}-form`}
      open={isEditing}
      onOpenChange={setIsEditing}
    >
      <ToggleSection.Header
        Icon={icon.icon}
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
                  id="whatToExpectEn"
                  label={intl.formatMessage({
                    defaultMessage: "English - What to expect",
                    id: "o7OKLq",
                    description:
                      "Label for the English - What to expect textarea in the edit pool page.",
                  })}
                  name="whatToExpectEn"
                  wordLimit={TEXT_AREA_MAX_WORDS_EN}
                  readOnly={!canEdit}
                />
                <RichTextInput
                  id="whatToExpectFr"
                  label={intl.formatMessage({
                    defaultMessage: "French - What to expect",
                    id: "zDHOiY",
                    description:
                      "Label for the French - What to expect textarea in the edit pool page.",
                  })}
                  name="whatToExpectFr"
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
                  <Button mode="inline" type="button" color="quaternary">
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

export default WhatToExpectSection;
