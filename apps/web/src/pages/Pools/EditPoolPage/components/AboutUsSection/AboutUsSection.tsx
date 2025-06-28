import { JSX } from "react";
import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";
import NewspaperIcon from "@heroicons/react/24/outline/NewspaperIcon";

import { Button, ToggleSection } from "@gc-digital-talent/ui";
import { RichTextInput, Submit } from "@gc-digital-talent/forms";
import { commonMessages, formMessages } from "@gc-digital-talent/i18n";
import {
  PoolStatus,
  LocalizedString,
  Pool,
  UpdatePoolInput,
  FragmentType,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";

import {
  hasAllEmptyFields,
  hasOneEmptyField,
} from "~/validators/process/aboutUs";
import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";
import ToggleForm from "~/components/ToggleForm/ToggleForm";
import processMessages from "~/messages/processMessages";
import useCanUserEditPool from "~/hooks/useCanUserEditPool";

import { useEditPoolContext } from "../EditPoolContext";
import { PublishedEditableSectionProps, SectionProps } from "../../types";
import Display from "./Display";
import ActionWrapper from "../ActionWrapper";
import UpdatePublishedProcessDialog, {
  type FormValues as UpdateFormValues,
} from "../UpdatePublishedProcessDialog/UpdatePublishedProcessDialog";

const EditPoolAboutUs_Fragment = graphql(/* GraphQL */ `
  fragment EditPoolAboutUs on Pool {
    ...UpdatePublishedProcessDialog
    id
    status {
      value
      label {
        en
        fr
      }
    }
    aboutUs {
      en
      fr
    }
  }
`);

interface FormValues {
  aboutUsEn?: LocalizedString["en"];
  aboutUsFr?: LocalizedString["fr"];
}

export type AboutUsSubmitData = Pick<UpdatePoolInput, "aboutUs">;

type AboutUsSectionProps = SectionProps<
  AboutUsSubmitData,
  FragmentType<typeof EditPoolAboutUs_Fragment>
> &
  PublishedEditableSectionProps;

const TEXT_AREA_MAX_WORDS_EN = 100;
const TEXT_AREA_MAX_WORDS_FR = TEXT_AREA_MAX_WORDS_EN + 30;

const AboutUsSection = ({
  poolQuery,
  sectionMetadata,
  onSave,
  onUpdatePublished,
}: AboutUsSectionProps): JSX.Element => {
  const intl = useIntl();
  const pool = getFragment(EditPoolAboutUs_Fragment, poolQuery);
  const isNull = hasAllEmptyFields(pool);
  const canEdit = useCanUserEditPool(pool.status?.value);
  const { isSubmitting } = useEditPoolContext();
  const { isEditing, setIsEditing, icon } = useToggleSectionInfo({
    isNull,
    emptyRequired: hasOneEmptyField(pool), // Not a required field
    fallbackIcon: NewspaperIcon,
    optional: true,
  });

  const dataToFormValues = (initialData: Pool): FormValues => ({
    aboutUsEn: initialData.aboutUs?.en ?? "",
    aboutUsFr: initialData.aboutUs?.fr ?? "",
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
      aboutUs: {
        en: formValues.aboutUsEn ?? "",
        fr: formValues.aboutUsFr ?? "",
      },
    })
      .then(() => onSuccess(formValues))
      .catch(() => methods.reset(formValues));
  };

  const handleUpdatePublished = async (formValues: UpdateFormValues) => {
    await onUpdatePublished({
      ...formValues,
      aboutUs: {
        en: values.aboutUsEn,
        fr: values.aboutUsFr,
      },
    }).then(() => onSuccess({ ...values }));
  };

  const subtitle = intl.formatMessage({
    defaultMessage:
      "This <strong>optional</strong> section allows you to provide further context for the department, branch, or team that will be hiring from this process.",
    id: "cweZUH",
    description:
      "Describes the 'about us' section of a process' advertisement.",
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
        className="font-bold"
        toggle={
          <ToggleForm.LabelledTrigger
            disabled={!canEdit}
            sectionTitle={sectionMetadata.title}
          />
        }
      >
        {sectionMetadata.title}
      </ToggleSection.Header>
      <p>{subtitle}</p>
      <ToggleSection.Content>
        <ToggleSection.InitialContent>
          {isNull ? (
            <ToggleForm.NullDisplay optional />
          ) : (
            <Display pool={pool} />
          )}
        </ToggleSection.InitialContent>
        <ToggleSection.OpenContent>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleSave)}>
              <div className="my-6 grid gap-6 sm:grid-cols-2">
                <RichTextInput
                  id="aboutUsEn"
                  label={intl.formatMessage(processMessages.aboutUsEn)}
                  name="aboutUsEn"
                  wordLimit={TEXT_AREA_MAX_WORDS_EN}
                  readOnly={!canEdit}
                />
                <RichTextInput
                  id="aboutUsFr"
                  label={intl.formatMessage(processMessages.aboutUsFr)}
                  name="aboutUsFr"
                  wordLimit={TEXT_AREA_MAX_WORDS_FR}
                  readOnly={!canEdit}
                />
              </div>

              <ActionWrapper>
                {canEdit && pool.status?.value === PoolStatus.Draft && (
                  <Submit
                    text={intl.formatMessage(formMessages.saveChanges)}
                    aria-label={intl.formatMessage({
                      defaultMessage: "Save about us",
                      id: "ME4sNt",
                      description: "Text on a button to save the pool about us",
                    })}
                    color="secondary"
                    mode="solid"
                    isSubmitting={isSubmitting}
                  />
                  // eslint-disable-next-line formatjs/no-literal-string-in-jsx
                )}{" "}
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

export default AboutUsSection;
