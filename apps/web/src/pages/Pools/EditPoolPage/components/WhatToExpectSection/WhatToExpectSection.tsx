import * as React from "react";
import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";
import QuestionMarkCircleIcon from "@heroicons/react/24/outline/QuestionMarkCircleIcon";

import { Button, ToggleSection } from "@gc-digital-talent/ui";
import { RichTextInput, Submit } from "@gc-digital-talent/forms";
import { commonMessages } from "@gc-digital-talent/i18n";

import {
  PoolStatus,
  LocalizedString,
  Pool,
  UpdatePoolInput,
} from "~/api/generated";
import { hasAllEmptyFields } from "~/validators/process/whatToExpect";
import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";
import ToggleForm from "~/components/ToggleForm/ToggleForm";

import { useEditPoolContext } from "../EditPoolContext";
import { SectionProps } from "../../types";
import Display from "./Display";
import ActionWrapper from "../ActionWrapper";

type FormValues = {
  whatToExpectEn?: LocalizedString["en"];
  whatToExpectFr?: LocalizedString["fr"];
};

export type WhatToExpectSubmitData = Pick<UpdatePoolInput, "whatToExpect">;

type WhatToExpectSectionProps = SectionProps<WhatToExpectSubmitData>;

const TEXT_AREA_MAX_WORDS_EN = 200;
const TEXT_AREA_MAX_WORDS_FR = TEXT_AREA_MAX_WORDS_EN + 100;

const WhatToExpectSection = ({
  pool,
  sectionMetadata,
  onSave,
}: WhatToExpectSectionProps): JSX.Element => {
  const intl = useIntl();
  const isNull = hasAllEmptyFields(pool);
  const { isSubmitting } = useEditPoolContext();
  const { isEditing, setIsEditing, icon } = useToggleSectionInfo({
    isNull,
    emptyRequired: false,
    fallbackIcon: QuestionMarkCircleIcon,
  });

  const dataToFormValues = (initialData: Pool): FormValues => ({
    whatToExpectEn: initialData.whatToExpect?.en ?? "",
    whatToExpectFr: initialData.whatToExpect?.fr ?? "",
  });

  const methods = useForm<FormValues>({
    defaultValues: dataToFormValues(pool),
  });
  const { handleSubmit } = methods;

  const handleSave = async (formValues: FormValues) => {
    return onSave({
      whatToExpect: {
        en: formValues.whatToExpectEn,
        fr: formValues.whatToExpectFr,
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
      "This information lets applicants know what they can expect after they apply, such as further exams, meeting with managers directly and possible timelines.",
    id: "ww+trY",
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
                <RichTextInput
                  id="whatToExpectEn"
                  label={intl.formatMessage({
                    defaultMessage: "English - What to expect",
                    id: "o7OKLq",
                    description:
                      "Label for the English - What to expect textarea in the edit pool page.",
                  })}
                  name="whatToExpectEn"
                  {...(!formDisabled && { wordLimit: TEXT_AREA_MAX_WORDS_EN })}
                  readOnly={formDisabled}
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
                  {...(!formDisabled && { wordLimit: TEXT_AREA_MAX_WORDS_FR })}
                  readOnly={formDisabled}
                />
              </div>

              <ActionWrapper>
                {!formDisabled && (
                  <Submit
                    text={intl.formatMessage({
                      defaultMessage: "Save what to expect",
                      id: "wimmA1",
                      description:
                        "Text on a button to save the pool what to expect",
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

export default WhatToExpectSection;
