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
import Spacer from "~/components/Spacer/Spacer";

import { useEditPoolContext } from "./EditPoolContext";

type FormValues = {
  yourImpactEn?: LocalizedString["en"];
  yourImpactFr?: LocalizedString["fr"];
};

export type YourImpactSubmitData = Pick<UpdatePoolInput, "yourImpact">;

interface YourImpactSectionProps {
  pool: Pool;
  sectionMetadata: EditPoolSectionMetadata;
  onSave: (submitData: YourImpactSubmitData) => void;
}

const TEXT_AREA_MAX_WORDS_EN = 200;
const TEXT_AREA_MAX_WORDS_FR = TEXT_AREA_MAX_WORDS_EN + 100;
const TEXT_AREA_ROWS = 15;

const YourImpactSection = ({
  pool,
  sectionMetadata,
  onSave,
}: YourImpactSectionProps): JSX.Element => {
  const intl = useIntl();
  const { isSubmitting } = useEditPoolContext();

  const dataToFormValues = (initialData: Pool): FormValues => ({
    yourImpactEn: initialData.yourImpact?.en ?? "",
    yourImpactFr: initialData.yourImpact?.fr ?? "",
  });

  const methods = useForm<FormValues>({
    defaultValues: dataToFormValues(pool),
  });
  const { handleSubmit } = methods;

  const handleSave = (formValues: FormValues) => {
    onSave({
      yourImpact: {
        en: formValues.yourImpactEn,
        fr: formValues.yourImpactFr,
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
            "This information lets applicants know what kind of work and environment they are applying to. Use this space to talk about the area of government this process will aim to improve and the value this work creates.",
          id: "HbzGOJ",
          description: "Helper message for filling in the pool introduction",
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

          {!formDisabled && (
            <Submit
              text={intl.formatMessage({
                defaultMessage: "Save introduction",
                id: "UduzGA",
                description: "Text on a button to save the pool introduction",
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

export default YourImpactSection;
