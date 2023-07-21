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
  whatToExpectEn?: LocalizedString["en"];
  whatToExpectFr?: LocalizedString["fr"];
};

export type WhatToExpectSubmitData = Pick<UpdatePoolInput, "whatToExpect">;

interface WhatToExpectSectionProps {
  pool: Pool;
  sectionMetadata: EditPoolSectionMetadata;
  onSave: (submitData: WhatToExpectSubmitData) => void;
}

const TEXT_AREA_MAX_WORDS_EN = 200;
const TEXT_AREA_MAX_WORDS_FR = TEXT_AREA_MAX_WORDS_EN + 100;
const TEXT_AREA_ROWS = 3;

const WhatToExpectSection = ({
  pool,
  sectionMetadata,
  onSave,
}: WhatToExpectSectionProps): JSX.Element => {
  const intl = useIntl();
  const { isSubmitting } = useEditPoolContext();

  const dataToFormValues = (initialData: Pool): FormValues => ({
    whatToExpectEn: initialData.whatToExpect?.en ?? "",
    whatToExpectFr: initialData.whatToExpect?.fr ?? "",
  });

  const methods = useForm<FormValues>({
    defaultValues: dataToFormValues(pool),
  });
  const { handleSubmit } = methods;

  const handleSave = (formValues: FormValues) => {
    onSave({
      whatToExpect: {
        en: formValues.whatToExpectEn,
        fr: formValues.whatToExpectFr,
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
            "This information lets applicants know what they can expect after they apply, such as further exams, meeting with managers directly and possible timelines.",
          id: "wPXjeq",
          description:
            "Helper message for filling in the pool what to expect after you apply section",
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
              id="whatToExpectEn"
              label={intl.formatMessage({
                defaultMessage: "English - What to expect",
                id: "o7OKLq",
                description:
                  "Label for the English - What to expect textarea in the edit pool page.",
              })}
              name="whatToExpectEn"
              rows={TEXT_AREA_ROWS}
              {...(!formDisabled && { wordLimit: TEXT_AREA_MAX_WORDS_EN })}
              disabled={formDisabled}
            />
            <TextArea
              id="whatToExpectFr"
              label={intl.formatMessage({
                defaultMessage: "French - What to expect",
                id: "zDHOiY",
                description:
                  "Label for the French - What to expect textarea in the edit pool page.",
              })}
              name="whatToExpectFr"
              {...(!formDisabled && { wordLimit: TEXT_AREA_MAX_WORDS_FR })}
              rows={TEXT_AREA_ROWS}
              disabled={formDisabled}
            />
          </div>

          {!formDisabled && (
            <Submit
              text={intl.formatMessage({
                defaultMessage: "Save what to expect",
                id: "wimmA1",
                description: "Text on a button to save the pool what to expect",
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

export default WhatToExpectSection;
