import * as React from "react";
import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";

import { TableOfContents } from "@gc-digital-talent/ui";
import { Submit, TextArea } from "@gc-digital-talent/forms";

import {
  PoolStatus,
  LocalizedString,
  Pool,
  UpdatePoolInput,
} from "~/api/generated";
import { EditPoolSectionMetadata } from "~/types/pool";

import { useEditPoolContext } from "./EditPoolContext";

type FormValues = {
  YourWorkEn?: LocalizedString["en"];
  YourWorkFr?: LocalizedString["fr"];
};

export type WorkTasksSubmitData = Pick<UpdatePoolInput, "keyTasks">;

interface WorkTasksSectionProps {
  pool: Pool;
  sectionMetadata: EditPoolSectionMetadata;
  onSave: (submitData: WorkTasksSubmitData) => void;
}

const TEXT_AREA_MAX_WORDS_EN = 400;
const TEXT_AREA_MAX_WORDS_FR = TEXT_AREA_MAX_WORDS_EN + 100;
const TEXT_AREA_ROWS = 15;

const WorkTasksSection = ({
  pool,
  sectionMetadata,
  onSave,
}: WorkTasksSectionProps): JSX.Element => {
  const intl = useIntl();
  const { isSubmitting } = useEditPoolContext();

  const dataToFormValues = (initialData: Pool): FormValues => ({
    YourWorkEn: initialData.keyTasks?.en ?? "",
    YourWorkFr: initialData.keyTasks?.fr ?? "",
  });

  const methods = useForm<FormValues>({
    defaultValues: dataToFormValues(pool),
  });
  const { handleSubmit } = methods;

  const handleSave = (formValues: FormValues) => {
    onSave({
      keyTasks: {
        en: formValues.YourWorkEn,
        fr: formValues.YourWorkFr,
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
            "This information lets applicants know the type of work they will be expected to perform. Talk about the tasks and expectations related to this work.",
          id: "k9nAP5",
          description: "Helper message for filling in the pool work tasks",
        })}
      </p>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleSave)}>
          <div
            data-h2-display="base(grid)"
            data-h2-gap="base(x1)"
            data-h2-grid-template-columns="l-tablet(repeat(2, 1fr))"
            data-h2-margin="base(x1 0)"
          >
            <TextArea
              id="YourWorkEn"
              label={intl.formatMessage({
                defaultMessage: "English - Your work",
                id: "lb7SoP",
                description:
                  "Label for the English - Your Work textarea in the edit pool page.",
              })}
              name="YourWorkEn"
              rows={TEXT_AREA_ROWS}
              {...(!formDisabled && { wordLimit: TEXT_AREA_MAX_WORDS_EN })}
              disabled={formDisabled}
            />
            <TextArea
              id="YourWorkFr"
              label={intl.formatMessage({
                defaultMessage: "French - Your work",
                id: "8bJgxK",
                description:
                  "Label for the French - Your Work textarea in the edit pool page.",
              })}
              name="YourWorkFr"
              {...(!formDisabled && { wordLimit: TEXT_AREA_MAX_WORDS_FR })}
              rows={TEXT_AREA_ROWS}
              disabled={formDisabled}
            />
          </div>

          {!formDisabled && (
            <Submit
              text={intl.formatMessage({
                defaultMessage: "Save work tasks",
                id: "tiv5J7",
                description: "Text on a button to save the pool work tasks",
              })}
              color="tertiary"
              mode="solid"
              isSubmitting={isSubmitting}
            />
          )}
        </form>
      </FormProvider>
    </TableOfContents.Section>
  );
};

export default WorkTasksSection;
