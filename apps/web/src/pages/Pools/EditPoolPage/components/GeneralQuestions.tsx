import React from "react";
import { useIntl } from "react-intl";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";

import { TableOfContents } from "@gc-digital-talent/ui";
import { errorMessages } from "@gc-digital-talent/i18n";
import { Repeater, TextArea, Submit } from "@gc-digital-talent/forms";
import { notEmpty } from "@gc-digital-talent/helpers";

import {
  CreateGeneralQuestionInput,
  UpdateGeneralQuestionInput,
  LocalizedString,
  Pool,
  Scalars,
  PoolStatus,
  UpdatePoolInput,
} from "~/api/generated";
import { EditPoolSectionMetadata } from "~/types/pool";

import { useEditPoolContext } from "./EditPoolContext";

const MAX_GENERAL_QUESTIONS = 3;
const TEXT_AREA_ROWS = 3;
const TEXT_AREA_MAX_WORDS = 200;

type GeneralQuestionValue = {
  id?: Scalars["ID"];
  question: LocalizedString;
};

type FormValues = {
  questions?: Array<GeneralQuestionValue>;
};

export type GeneralQuestionsSubmitData = Pick<
  UpdatePoolInput,
  "generalQuestions"
>;

interface GeneralQuestionsProps {
  pool: Pool;
  sectionMetadata: EditPoolSectionMetadata;
  onSave: (submitData: GeneralQuestionsSubmitData) => void;
}

const GeneralQuestions = ({
  pool,
  sectionMetadata,
  onSave,
}: GeneralQuestionsProps) => {
  const intl = useIntl();
  const { isSubmitting } = useEditPoolContext();

  const dataToFormValues = (initialData: Pool): FormValues => ({
    questions:
      initialData?.generalQuestions
        ?.filter(notEmpty)
        .map(({ id, question }) => ({
          id: id || "new",
          question: {
            en: question?.en || "",
            fr: question?.fr || "",
          },
        })) || [],
  });
  const defaultValues = dataToFormValues(pool);

  const methods = useForm<FormValues>({
    values: defaultValues,
  });
  const { handleSubmit, control } = methods;
  const { remove, move, append, fields } = useFieldArray({
    control,
    name: "questions",
  });

  const handleSave = (formValues: FormValues) => {
    const create: Array<CreateGeneralQuestionInput> = [];
    const update: Array<UpdateGeneralQuestionInput> = [];
    const toBeDeleted = pool.generalQuestions
      ?.filter((existingQuestion) => {
        return !formValues.questions?.some(
          (question) =>
            question.id === existingQuestion?.id && question.id !== "new",
        );
      })
      .filter(notEmpty)
      .map((q) => q.id);
    formValues.questions?.forEach(({ id, question }, index) => {
      const sortOrder = index + 1;
      if (!id || id === "new") {
        create.push({
          question,
          sortOrder,
        });
      } else {
        update.push({
          id,
          question,
          sortOrder,
        });
      }
    });

    onSave({
      generalQuestions: {
        update,
        create,
        delete: toBeDeleted,
      },
    });
    methods.reset(formValues, {
      keepDirty: false,
    });
  };

  // disabled unless status is draft
  const formDisabled = pool.status !== PoolStatus.Draft;

  const canAdd = fields.length < MAX_GENERAL_QUESTIONS;

  const customNullMessage = (
    <>
      <p data-h2-font-weight="base(700)" data-h2-margin-bottom="base(x.5)">
        {intl.formatMessage({
          defaultMessage: "You have no questions.",
          id: "izt28e",
          description:
            "Message that appears when there are no screening messages for a pool",
        })}
      </p>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Start adding some questions using the following button.",
          id: "vDqzWG",
          description:
            "Instructions on how to add a question when there are none",
        })}
      </p>
    </>
  );

  const maxItemsMessage = (
    <>
      <p data-h2-font-weight="base(700)" data-h2-margin-bottom="base(x.5)">
        {intl.formatMessage(
          {
            defaultMessage:
              "You have reached the maximum amount ({maxItems}) of screening questions per poster.",
            id: "Kklz7F",
            description:
              "Message displayed when a user adds the maximum number of questions",
          },
          { maxItems: MAX_GENERAL_QUESTIONS },
        )}
      </p>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Remember, applicants will submit information on how they meet each skill requirement through the regular application process.",
          id: "fNYEBT",
          description:
            "Disclaimer reminding admins of how the application process works when they reach the maximum screening questions",
        })}
      </p>
    </>
  );

  return (
    <TableOfContents.Section id={sectionMetadata.id}>
      <TableOfContents.Heading data-h2-margin-top="base(0)">
        {sectionMetadata.title}
      </TableOfContents.Heading>
      <p data-h2-margin="base(x1, 0)">
        {intl.formatMessage({
          defaultMessage:
            "Include up to 3 questions in your application process.",
          id: "P3WkJv",
          description:
            "Helper message indicating max screening questions allowed",
        })}
      </p>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleSave)}>
          <Repeater.Root
            name="questions"
            total={fields.length}
            showAdd={canAdd && !formDisabled}
            maxItems={MAX_GENERAL_QUESTIONS}
            onAdd={() => {
              append({
                id: "new",
                question: {
                  en: "",
                  fr: "",
                },
              });
            }}
            addText={intl.formatMessage({
              defaultMessage: "Add screening question",
              id: "vf7/Xq",
              description: "Button text to add a new screening question",
            })}
            customNullMessage={customNullMessage}
            maxItemsMessage={maxItemsMessage}
            showUnsavedChanges
            data-h2-margin-bottom="base(1rem)"
          >
            {fields.map((item, index) => (
              <Repeater.Fieldset
                key={item.id}
                index={index}
                name="questions"
                total={fields.length}
                onMove={move}
                onRemove={remove}
                disabled={formDisabled}
                legend={intl.formatMessage(
                  {
                    defaultMessage: "Screening question {index}",
                    id: "s+ObMR",
                    description: "Legend for screening question fieldset",
                  },
                  {
                    index: index + 1,
                  },
                )}
              >
                <input type="hidden" name={`questions.${index}.id`} />
                <div
                  data-h2-display="base(grid)"
                  data-h2-grid-template-columns="base(1fr 1fr)"
                  data-h2-gap="base(0 x1)"
                >
                  <div>
                    <TextArea
                      id={`questions.${index}.question.en`}
                      name={`questions.${index}.question.en`}
                      label="Question (EN)"
                      disabled={formDisabled}
                      rows={TEXT_AREA_ROWS}
                      wordLimit={TEXT_AREA_MAX_WORDS}
                      rules={{
                        required: intl.formatMessage(errorMessages.required),
                      }}
                    />
                  </div>
                  <div>
                    <TextArea
                      id={`questions.${index}.question.fr`}
                      name={`questions.${index}.question.fr`}
                      label="Question (FR)"
                      disabled={formDisabled}
                      rows={TEXT_AREA_ROWS}
                      wordLimit={TEXT_AREA_MAX_WORDS}
                      rules={{
                        required: intl.formatMessage(errorMessages.required),
                      }}
                    />
                  </div>
                </div>
              </Repeater.Fieldset>
            ))}
          </Repeater.Root>

          {!formDisabled && (
            <Submit
              text={intl.formatMessage({
                defaultMessage: "Save screening questions",
                id: "lTkp5g",
                description:
                  "Text on a button to save the pool screening questions",
              })}
              color="secondary"
              mode="solid"
              isSubmitting={isSubmitting}
            />
          )}
        </form>
      </FormProvider>
    </TableOfContents.Section>
  );
};

export default GeneralQuestions;
