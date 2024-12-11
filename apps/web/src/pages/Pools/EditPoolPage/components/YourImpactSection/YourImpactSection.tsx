import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";
import PresentationChartBarIcon from "@heroicons/react/24/outline/PresentationChartBarIcon";

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
  hasEmptyRequiredFields,
  hasAllEmptyFields,
} from "~/validators/process/yourImpact";
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

const EditPoolYourImpact_Fragment = graphql(/* GraphQL */ `
  fragment EditPoolYourImpact on Pool {
    ...UpdatePublishedProcessDialog
    id
    status {
      value
      label {
        en
        fr
      }
    }
    yourImpact {
      en
      fr
    }
  }
`);

interface FormValues {
  yourImpactEn?: LocalizedString["en"];
  yourImpactFr?: LocalizedString["fr"];
}

export type YourImpactSubmitData = Pick<UpdatePoolInput, "yourImpact">;

type YourImpactSectionProps = SectionProps<
  YourImpactSubmitData,
  FragmentType<typeof EditPoolYourImpact_Fragment>
> &
  PublishedEditableSectionProps;

const TEXT_AREA_MAX_WORDS_EN = 200;
const TEXT_AREA_MAX_WORDS_FR = TEXT_AREA_MAX_WORDS_EN + 100;

const YourImpactSection = ({
  poolQuery,
  sectionMetadata,
  onSave,
  onUpdatePublished,
}: YourImpactSectionProps) => {
  const intl = useIntl();
  const pool = getFragment(EditPoolYourImpact_Fragment, poolQuery);
  const isNull = hasAllEmptyFields(pool);
  const canEdit = useCanUserEditPool(pool.status?.value);
  const emptyRequired = hasEmptyRequiredFields(pool);
  const { isSubmitting } = useEditPoolContext();
  const { isEditing, setIsEditing, icon } = useToggleSectionInfo({
    isNull,
    emptyRequired,
    fallbackIcon: PresentationChartBarIcon,
  });

  const dataToFormValues = (initialData: Pool): FormValues => ({
    yourImpactEn: initialData.yourImpact?.en ?? "",
    yourImpactFr: initialData.yourImpact?.fr ?? "",
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
      yourImpact: {
        en: formValues.yourImpactEn,
        fr: formValues.yourImpactFr,
      },
    })
      .then(() => onSuccess(formValues))
      .catch(() => methods.reset(formValues));
  };

  const handleUpdatePublished = async (formValues: UpdateFormValues) => {
    await onUpdatePublished({
      ...formValues,
      yourImpact: {
        en: values.yourImpactEn,
        fr: values.yourImpactFr,
      },
    }).then(() => onSuccess({ ...values }));
  };

  const subtitle = intl.formatMessage({
    defaultMessage:
      "This information lets applicants know what kind of work and environment they're applying to. Use this space to talk about the area of government this process will aim to improve and the value this kind of work creates.",
    id: "hD2x/p",
    description:
      "Describes the 'your impact' section of a process' advertisement.",
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
                data-h2-margin-bottom="base(x1)"
              >
                <RichTextInput
                  id="yourImpactEn"
                  label={intl.formatMessage({
                    defaultMessage: "English - Your impact",
                    id: "NfRLs/",
                    description:
                      "Label for the English - Your Impact textarea in the edit pool page.",
                  })}
                  name="yourImpactEn"
                  wordLimit={TEXT_AREA_MAX_WORDS_EN}
                  readOnly={!canEdit}
                />
                <RichTextInput
                  id="yourImpactFr"
                  label={intl.formatMessage({
                    defaultMessage: "French - Your impact",
                    id: "fPy7Mg",
                    description:
                      "Label for the French - Your Impact textarea in the edit pool page.",
                  })}
                  name="yourImpactFr"
                  wordLimit={TEXT_AREA_MAX_WORDS_FR}
                  readOnly={!canEdit}
                />
              </div>
              <ActionWrapper>
                {canEdit && pool.status?.value === PoolStatus.Draft && (
                  <Submit
                    text={intl.formatMessage(formMessages.saveChanges)}
                    aria-label={intl.formatMessage({
                      defaultMessage: "Save introduction",
                      id: "UduzGA",
                      description:
                        "Text on a button to save the pool introduction",
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

export default YourImpactSection;
