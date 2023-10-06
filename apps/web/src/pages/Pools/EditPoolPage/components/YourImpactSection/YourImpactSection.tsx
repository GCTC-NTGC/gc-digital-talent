import * as React from "react";
import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";
import PresentationChartBarIcon from "@heroicons/react/24/outline/PresentationChartBarIcon";

import { Button, ToggleSection } from "@gc-digital-talent/ui";
import { Submit, TextArea } from "@gc-digital-talent/forms";
import { commonMessages } from "@gc-digital-talent/i18n";

import {
  PoolStatus,
  LocalizedString,
  Pool,
  UpdatePoolInput,
} from "~/api/generated";
import {
  hasEmptyRequiredFields,
  hasAllEmptyFields,
} from "~/validators/process/yourImpact";
import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";
import ToggleForm from "~/components/ToggleForm/ToggleForm";

import { useEditPoolContext } from "../EditPoolContext";
import { SectionProps } from "../../types";
import Display from "./Display";
import ActionWrapper from "../ActionWrapper";

type FormValues = {
  yourImpactEn?: LocalizedString["en"];
  yourImpactFr?: LocalizedString["fr"];
};

export type YourImpactSubmitData = Pick<UpdatePoolInput, "yourImpact">;

type YourImpactSectionProps = SectionProps<YourImpactSubmitData>;

const TEXT_AREA_MAX_WORDS_EN = 200;
const TEXT_AREA_MAX_WORDS_FR = TEXT_AREA_MAX_WORDS_EN + 100;
const TEXT_AREA_ROWS = 15;

const YourImpactSection = ({
  pool,
  sectionMetadata,
  onSave,
}: YourImpactSectionProps): JSX.Element => {
  const intl = useIntl();
  const isNull = hasAllEmptyFields(pool);
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
  const { handleSubmit } = methods;

  const handleSave = async (formValues: FormValues) => {
    await onSave({
      yourImpact: {
        en: formValues.yourImpactEn,
        fr: formValues.yourImpactFr,
      },
    }).then(() => {
      methods.reset(formValues, {
        keepDirty: false,
      });
      setIsEditing(false);
    });
  };

  // disabled unless status is draft
  const formDisabled = pool.status !== PoolStatus.Draft;

  const subtitle = intl.formatMessage({
    defaultMessage:
      "This information lets applicants know what kind of work, and environment they are applying to. Use this space to talk about the area of government this process will aim to improve. And the value this kind of work creates.",
    id: "P7ZWZ/",
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
        size="h5"
        toggle={
          <ToggleForm.LabelledTrigger
            disabled={formDisabled}
            sectionTitle={sectionMetadata.title}
          />
        }
      >
        {sectionMetadata.title}
      </ToggleSection.Header>
      <ToggleSection.Content>
        <ToggleSection.InitialContent>
          {isNull ? (
            <ToggleForm.NullDisplay
              title={sectionMetadata.id}
              content={subtitle}
            />
          ) : (
            <Display pool={pool} subtitle={subtitle} />
          )}
        </ToggleSection.InitialContent>
        <ToggleSection.OpenContent>
          <p>{subtitle}</p>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleSave)}>
              <div
                data-h2-display="base(grid)"
                data-h2-gap="base(x1)"
                data-h2-grid-template-columns="l-tablet(repeat(2, 1fr))"
                data-h2-margin="base(x1 0)"
              >
                <TextArea
                  id="yourImpactEn"
                  label={intl.formatMessage({
                    defaultMessage: "English - Your impact",
                    id: "NfRLs/",
                    description:
                      "Label for the English - Your Impact textarea in the edit pool page.",
                  })}
                  name="yourImpactEn"
                  {...(!formDisabled && { wordLimit: TEXT_AREA_MAX_WORDS_EN })}
                  rows={TEXT_AREA_ROWS}
                  disabled={formDisabled}
                />
                <TextArea
                  id="yourImpactFr"
                  label={intl.formatMessage({
                    defaultMessage: "French - Your impact",
                    id: "fPy7Mg",
                    description:
                      "Label for the French - Your Impact textarea in the edit pool page.",
                  })}
                  name="yourImpactFr"
                  {...(!formDisabled && { wordLimit: TEXT_AREA_MAX_WORDS_FR })}
                  rows={TEXT_AREA_ROWS}
                  disabled={formDisabled}
                />
              </div>

              <ActionWrapper>
                {!formDisabled && (
                  <Submit
                    text={intl.formatMessage({
                      defaultMessage: "Save introduction",
                      id: "UduzGA",
                      description:
                        "Text on a button to save the pool introduction",
                    })}
                    color="tertiary"
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

export default YourImpactSection;
