import * as React from "react";
import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";

import { TableOfContents } from "@gc-digital-talent/ui";
import { Checkbox, Submit, TextArea } from "@gc-digital-talent/forms";

import {
  PoolStatus,
  LocalizedString,
  Pool,
  UpdatePoolInput,
} from "~/api/generated";
import { EditPoolSectionMetadata } from "~/types/pool";

import { useEditPoolContext } from "./EditPoolContext";

type FormValues = {
  hasSpecialNote: boolean;
  specialNoteEn?: LocalizedString["en"];
  specialNoteFr?: LocalizedString["fr"];
};

export type SpecialNoteSubmitData = Pick<UpdatePoolInput, "specialNote">;

interface SpecialNoteSectionProps {
  pool: Pool;
  sectionMetadata: EditPoolSectionMetadata;
  onSave: (submitData: SpecialNoteSubmitData) => void;
}

const TEXT_AREA_MAX_WORDS_EN = 100;
const TEXT_AREA_MAX_WORDS_FR = TEXT_AREA_MAX_WORDS_EN + 100;
const TEXT_AREA_ROWS = 1;

const SpecialNoteSection = ({
  pool,
  sectionMetadata,
  onSave,
}: SpecialNoteSectionProps): JSX.Element => {
  const intl = useIntl();
  const { isSubmitting } = useEditPoolContext();

  const dataToFormValues = (initialData: Pool): FormValues => ({
    hasSpecialNote: !!(
      initialData.specialNote?.en || initialData.specialNote?.fr
    ),
    specialNoteEn: initialData.specialNote?.en ?? "",
    specialNoteFr: initialData.specialNote?.fr ?? "",
  });

  const methods = useForm<FormValues>({
    defaultValues: dataToFormValues(pool),
  });
  const { handleSubmit, watch } = methods;
  const watchHasSpecialNote = watch("hasSpecialNote");

  const handleSave = (formValues: FormValues) => {
    onSave({
      specialNote: {
        en: formValues.specialNoteEn,
        fr: formValues.specialNoteFr,
      },
    });
    methods.reset(formValues, {
      keepDirty: false,
    });
  };

  // disabled unless status is draft
  const formDisabled = pool.status !== PoolStatus.Draft;

  return (
    <TableOfContents.Section id={sectionMetadata.id}>
      <TableOfContents.Heading data-h2-margin="base(x3, 0, x1, 0)">
        {sectionMetadata.title}
      </TableOfContents.Heading>
      <p data-h2-margin-bottom="base(0)">
        {intl.formatMessage({
          defaultMessage:
            "Most job advertisements will not require a special note. This section is for special circumstances only. Examples of this special note include identifying if a process may be used to hire in multiple classifications or if the process is limited to application from a specific equity group.",
          id: "OZisnP",
          description:
            "Helper message for filling in the edit pool special note section",
        })}
      </p>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleSave)}>
          <div data-h2-margin-top="base(x1)">
            <Checkbox
              id="has-special-note"
              name="hasSpecialNote"
              boundingBox
              boundingBoxLabel={intl.formatMessage({
                defaultMessage: "Confirmation of need for special note",
                id: "JBavNE",
                description:
                  "Label for input confirmation of need for special note on edit pool.",
              })}
              label={intl.formatMessage({
                defaultMessage:
                  "I need a special note. I have reviewed my job advertisement preview and I confirm that this information is not covered anywhere else on the job advertisement.",
                id: "BMJeFv",
                description:
                  "Checkbox selection that confirms need for a special note on edit page.",
              })}
              disabled={formDisabled}
            />
          </div>
          {watchHasSpecialNote && (
            <>
              <div
                data-h2-display="base(grid)"
                data-h2-gap="base(x1)"
                data-h2-grid-template-columns="l-tablet(repeat(2, 1fr))"
                data-h2-margin="base(x1, 0)"
              >
                <TextArea
                  id="whatToExpectEn"
                  label={intl.formatMessage({
                    defaultMessage: "English - Special note for this process",
                    id: "+JMvBQ",
                    description:
                      "Label for the English - Special note for this process textarea on edit pool page.",
                  })}
                  name="specialNoteEn"
                  rows={TEXT_AREA_ROWS}
                  {...(!formDisabled && { wordLimit: TEXT_AREA_MAX_WORDS_EN })}
                  disabled={formDisabled}
                />
                <TextArea
                  id="whatToExpectFr"
                  label={intl.formatMessage({
                    defaultMessage: "French - Special note for this process",
                    id: "YcMhCm",
                    description:
                      "Label for the French - Special note for this process textarea in the edit pool page.",
                  })}
                  name="specialNoteFr"
                  {...(!formDisabled && { wordLimit: TEXT_AREA_MAX_WORDS_FR })}
                  rows={TEXT_AREA_ROWS}
                  disabled={formDisabled}
                />
              </div>
              {!formDisabled && (
                <Submit
                  text={intl.formatMessage({
                    defaultMessage: "Save special note",
                    id: "SH3WsZ",
                    description:
                      "Text on a button to save the pool special note",
                  })}
                  color="tertiary"
                  mode="solid"
                  isSubmitting={isSubmitting}
                />
              )}
            </>
          )}
        </form>
      </FormProvider>
    </TableOfContents.Section>
  );
};

export default SpecialNoteSection;
