import React from "react";
import { useIntl } from "react-intl";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";

import { TableOfContents, Well } from "@gc-digital-talent/ui";
import { errorMessages } from "@gc-digital-talent/i18n";
import { Repeater, TextArea, Submit } from "@gc-digital-talent/forms";
import { notEmpty } from "@gc-digital-talent/helpers";

import {
  CreateScreeningQuestionInput,
  UpdateScreeningQuestionInput,
  LocalizedString,
  PoolAdvertisement,
  Scalars,
  AdvertisementStatus,
  UpdatePoolAdvertisementInput,
} from "~/api/generated";
import { EditPoolSectionMetadata } from "~/types/pool";

import { useEditPoolContext } from "./EditPoolContext";

type ScreeningQuestionValue = {
  id?: Scalars["ID"];
  question: LocalizedString;
};

type FormValues = {
  questions?: Array<ScreeningQuestionValue>;
};

export type ScreeningQuestionsSubmitData = Pick<
  UpdatePoolAdvertisementInput,
  "screeningQuestions"
>;

interface ScreeningQuestionsProps {
  poolAdvertisement: PoolAdvertisement;
  sectionMetadata: EditPoolSectionMetadata;
  onSave: (submitData: ScreeningQuestionsSubmitData) => void;
}

const ScreeningQuestions = ({
  poolAdvertisement,
  sectionMetadata,
  onSave,
}: ScreeningQuestionsProps) => {
  const intl = useIntl();
  const { isSubmitting } = useEditPoolContext();

  const dataToFormValues = (initialData: PoolAdvertisement): FormValues => ({
    questions:
      initialData?.screeningQuestions
        ?.filter(notEmpty)
        .map(({ id, question }) => ({
          id: id || "new",
          question: {
            en: question?.en || "",
            fr: question?.fr || "",
          },
        })) || [],
  });

  const methods = useForm<FormValues>({
    defaultValues: dataToFormValues(poolAdvertisement),
  });
  const { handleSubmit, control } = methods;
  const { remove, move, append, fields } = useFieldArray({
    control,
    name: "questions",
  });

  const handleSave = (formValues: FormValues) => {
    const create: Array<CreateScreeningQuestionInput> = [];
    const update: Array<UpdateScreeningQuestionInput> = [];
    const toBeDeleted = poolAdvertisement.screeningQuestions
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
      screeningQuestions: {
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
  const formDisabled =
    poolAdvertisement.advertisementStatus !== AdvertisementStatus.Draft;

  const canAdd = fields.length < 3;
  return (
    <TableOfContents.Section id={sectionMetadata.id}>
      <TableOfContents.Heading data-h2-margin="base(x3, 0, x1, 0)">
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
            data-h2-margin-bottom="base(1rem)"
            showAdd={canAdd && !formDisabled}
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
          >
            <>
              {fields.length ? (
                fields.map((item, index) => (
                  <Repeater.Fieldset
                    key={item.id}
                    index={index}
                    total={fields.length}
                    onMove={move}
                    onRemove={remove}
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
                      data-h2-gap="base(0, x.5)"
                      data-h2-margin="base(-x1, 0)"
                    >
                      <TextArea
                        id={`questions.${index}.question.en`}
                        name={`questions.${index}.question.en`}
                        label="Question (EN)"
                        disabled={formDisabled}
                        rules={{
                          required: intl.formatMessage(errorMessages.required),
                        }}
                      />
                      <TextArea
                        id={`questions.${index}.question.fr`}
                        name={`questions.${index}.question.fr`}
                        label="Question (FR)"
                        disabled={formDisabled}
                        rules={{
                          required: intl.formatMessage(errorMessages.required),
                        }}
                      />
                    </div>
                  </Repeater.Fieldset>
                ))
              ) : (
                <Well>
                  <p
                    data-h2-font-weight="base(700)"
                    data-h2-margin-bottom="base(x.5)"
                  >
                    {intl.formatMessage({
                      defaultMessage: "You have no questions.",
                      id: "Pw/QMl",
                      description:
                        "MEssage that appears when there are no screening messages for a pool",
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
                </Well>
              )}
              {!canAdd && (
                <Well>
                  <p
                    data-h2-font-weight="base(700)"
                    data-h2-margin-bottom="base(x.5)"
                  >
                    {intl.formatMessage({
                      defaultMessage:
                        "You have reached the maximum amount (3) of screening questions per poster.",
                      id: "KhQxO8",
                      description:
                        "MEssage displayed when a user adds the maximum number of questions",
                    })}
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
                </Well>
              )}
            </>
          </Repeater.Root>
          {!formDisabled && (
            <Submit
              text={intl.formatMessage({
                defaultMessage: "Save screening questions",
                id: "lTkp5g",
                description:
                  "Text on a button to save the pool screening questions",
              })}
              color="cta"
              mode="solid"
              isSubmitting={isSubmitting}
            />
          )}
        </form>
      </FormProvider>
    </TableOfContents.Section>
  );
};

export default ScreeningQuestions;
