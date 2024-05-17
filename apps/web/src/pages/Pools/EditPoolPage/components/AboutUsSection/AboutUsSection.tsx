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

import { useEditPoolContext } from "../EditPoolContext";
import { SectionProps } from "../../types";
import Display from "./Display";
import ActionWrapper from "../ActionWrapper";

export const EditPoolAboutUs_Fragment = graphql(/* GraphQL */ `
  fragment EditPoolAboutUs on Pool {
    id
    status
    aboutUs {
      en
      fr
    }
  }
`);

type FormValues = {
  aboutUsEn?: LocalizedString["en"];
  aboutUsFr?: LocalizedString["fr"];
};

export type AboutUsSubmitData = Pick<UpdatePoolInput, "aboutUs">;

type AboutUsSectionProps = SectionProps<
  AboutUsSubmitData,
  FragmentType<typeof EditPoolAboutUs_Fragment>
>;

const TEXT_AREA_MAX_WORDS_EN = 100;
const TEXT_AREA_MAX_WORDS_FR = TEXT_AREA_MAX_WORDS_EN + 30;

const AboutUsSection = ({
  poolQuery,
  sectionMetadata,
  onSave,
}: AboutUsSectionProps): JSX.Element => {
  const intl = useIntl();
  const pool = getFragment(EditPoolAboutUs_Fragment, poolQuery);
  const isNull = hasAllEmptyFields(pool);
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
  const { handleSubmit } = methods;

  const handleSave = async (formValues: FormValues) => {
    return onSave({
      aboutUs: {
        en: formValues.aboutUsEn ?? "",
        fr: formValues.aboutUsFr ?? "",
      },
    })
      .then(() => {
        methods.reset(formValues, {
          keepDirty: false,
        });
        setIsEditing(false);
      })
      .catch(() => methods.reset(formValues));
  };

  // disabled unless status is draft
  const formDisabled = pool.status !== PoolStatus.Draft;

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
        Icon={icon.icon}
        color={icon.color}
        level="h3"
        size="h4"
        className="font-bold"
        toggle={
          <ToggleForm.LabelledTrigger
            disabled={formDisabled}
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
              <div
                data-h2-display="base(grid)"
                data-h2-gap="base(x1)"
                data-h2-grid-template-columns="l-tablet(repeat(2, 1fr))"
                className="my-6"
              >
                <RichTextInput
                  id="aboutUsEn"
                  label={intl.formatMessage(processMessages.aboutUsEn)}
                  name="aboutUsEn"
                  {...(!formDisabled && {
                    wordLimit: TEXT_AREA_MAX_WORDS_EN,
                  })}
                  readOnly={formDisabled}
                />
                <RichTextInput
                  id="aboutUsFr"
                  label={intl.formatMessage(processMessages.aboutUsFr)}
                  name="aboutUsFr"
                  {...(!formDisabled && {
                    wordLimit: TEXT_AREA_MAX_WORDS_FR,
                  })}
                  readOnly={formDisabled}
                />
              </div>

              <ActionWrapper>
                {!formDisabled && (
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

export default AboutUsSection;
