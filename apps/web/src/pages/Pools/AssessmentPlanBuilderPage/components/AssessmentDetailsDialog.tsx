import React from "react";
import { useIntl } from "react-intl";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";

import { Button, Dialog, Well } from "@gc-digital-talent/ui";
import {
  commonMessages,
  errorMessages,
  getLocalizedName,
  uiMessages,
} from "@gc-digital-talent/i18n";
import {
  Select,
  Input,
  Repeater,
  TextArea,
  Checklist,
  CheckboxOption,
  Option,
  Field,
} from "@gc-digital-talent/forms";
import {
  AssessmentStepType,
  Maybe,
  PoolSkill,
  Scalars,
  ScreeningQuestion,
  useCreateAssessmentStepMutation,
  useCreateOrUpdateScreeningQuestionAssessmentStepMutation,
  useUpdateAssessmentStepMutation,
} from "@gc-digital-talent/graphql";
import { getAssessmentStepType } from "@gc-digital-talent/i18n/src/messages/localizedConstants";
import { toast } from "@gc-digital-talent/toast";

import labels from "./AssessmentDetailsDialogLabels";
import {
  SCREENING_QUESTIONS_MAX_QUESTIONS,
  SCREENING_QUESTIONS_TEXT_AREA_EN_MAX_WORDS,
  SCREENING_QUESTIONS_TEXT_AREA_FR_MAX_WORDS,
  SCREENING_QUESTIONS_TEXT_AREA_ROWS,
} from "../constants";

type DialogMode = "regular" | "screening_question";
type DialogAction = "create" | "update";

type FormValues = {
  id?: Maybe<Scalars["ID"]>;
  poolId?: Maybe<Scalars["ID"]>;
  typeOfAssessment?: Maybe<AssessmentStepType>;
  assessmentTitleEn?: Maybe<string>;
  assessmentTitleFr?: Maybe<string>;
  screeningQuestionFieldArray?: Array<{
    id: string | null;
    screeningQuestion: {
      id?: Maybe<Scalars["ID"]>;
      sortOrder?: Maybe<number>;
      en?: Maybe<string>;
      fr?: Maybe<string>;
    };
  }>;
  assessedSkills?: Maybe<Array<Scalars["ID"]>>;
};

type InitialValues = Omit<
  FormValues,
  "poolId" | "screeningQuestionFieldArray"
> & {
  poolId: NonNullable<FormValues["poolId"]>;
  screeningQuestions?: Array<ScreeningQuestion>;
};

interface AssessmentDetailsDialogProps {
  initialValues: InitialValues;
  allPoolSkills: PoolSkill[];
  disallowStepTypes?: AssessmentStepType[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  trigger?: React.ReactNode;
}

const AssessmentDetailsDialog = ({
  initialValues,
  allPoolSkills,
  disallowStepTypes = [],
  isOpen,
  setIsOpen,
  trigger,
}: AssessmentDetailsDialogProps) => {
  const intl = useIntl();
  const dialogAction: DialogAction = initialValues.id ? "update" : "create";

  const [
    { fetching: createAssessmentStepFetching },
    executeCreateAssessmentStepMutation,
  ] = useCreateAssessmentStepMutation();
  const [
    { fetching: updateAssessmentStepFetching },
    executeUpdateAssessmentStepMutation,
  ] = useUpdateAssessmentStepMutation();
  const [
    { fetching: createOrUpdateScreeningQuestionAssessmentStepMutationFetching },
    executeCreateOrUpdateScreeningQuestionAssessmentStepMutation,
  ] = useCreateOrUpdateScreeningQuestionAssessmentStepMutation();

  if (initialValues.screeningQuestions) {
    initialValues.screeningQuestions.sort((a, b) =>
      (a.sortOrder ?? Number.MAX_SAFE_INTEGER) >
      (b.sortOrder ?? Number.MAX_SAFE_INTEGER)
        ? 1
        : -1,
    );
  }

  const methods = useForm<FormValues>({
    defaultValues: {
      ...initialValues,
      screeningQuestionFieldArray: initialValues.screeningQuestions?.map(
        (initialScreeningQuestion) => ({
          id: null, // filled by react-hook-form
          screeningQuestion: {
            id: initialScreeningQuestion.id,
            sortOrder: initialScreeningQuestion.sortOrder,
            en: initialScreeningQuestion.question?.en,
            fr: initialScreeningQuestion.question?.fr,
          },
        }),
      ),
    },
  });
  const { handleSubmit, control, watch, setValue, reset } = methods;

  const [selectedTypeOfAssessment] = watch(["typeOfAssessment"]);
  const dialogMode: DialogMode =
    selectedTypeOfAssessment ===
    AssessmentStepType.ScreeningQuestionsAtApplication
      ? "screening_question"
      : "regular";

  const { remove, move, append, fields } = useFieldArray({
    control,
    name: "screeningQuestionFieldArray",
    rules: {
      required: {
        value: dialogMode === "screening_question",
        message: intl.formatMessage({
          defaultMessage:
            "Include up to 3 questions in your application process.",
          id: "P3WkJv",
          description:
            "Helper message indicating max screening questions allowed",
        }),
      },
      minLength: {
        value: 1,
        message: intl.formatMessage({
          defaultMessage:
            "Include up to 3 questions in your application process.",
          id: "P3WkJv",
          description:
            "Helper message indicating max screening questions allowed",
        }),
      },
      maxLength: {
        value: 3,
        message: intl.formatMessage({
          defaultMessage:
            "Include up to 3 questions in your application process.",
          id: "P3WkJv",
          description:
            "Helper message indicating max screening questions allowed",
        }),
      },
    },
  });

  React.useEffect(() => {
    if (dialogMode === "regular") {
      setValue("screeningQuestionFieldArray", []);
    }
    if (dialogMode === "screening_question") {
      setValue("assessmentTitleEn", null);
      setValue("assessmentTitleFr", null);
    }
  }, [dialogMode, setValue]);

  const submitCreateAssessmentStepMutation = (
    values: FormValues,
  ): Promise<void> => {
    const mutationParameters = {
      poolId: values.poolId,
      assessmentStep: {
        type: values.typeOfAssessment,
        title: {
          en: values.assessmentTitleEn,
          fr: values.assessmentTitleFr,
        },
        poolSkills: {
          sync: values.assessedSkills,
        },
      },
    };
    return executeCreateAssessmentStepMutation(mutationParameters).then(
      (result) => {
        if (result?.data?.createAssessmentStep?.id) {
          return Promise.resolve();
        }
        return Promise.reject();
      },
    );
  };

  const submitUpdateAssessmentStepMutation = (
    values: FormValues,
  ): Promise<void> => {
    const mutationParameters = {
      id: values.id,
      assessmentStep: {
        type: values.typeOfAssessment,
        title: {
          en: values.assessmentTitleEn,
          fr: values.assessmentTitleFr,
        },
        poolSkills: {
          sync: values.assessedSkills,
        },
      },
    };
    return executeUpdateAssessmentStepMutation(mutationParameters).then(
      (res) => {
        if (res?.data?.updateAssessmentStep?.id) {
          return Promise.resolve();
        }
        return Promise.reject();
      },
    );
  };

  const submitCreateOrUpdateAssessmentWithScreeningQuestionsMutation = (
    values: FormValues,
  ): Promise<void> => {
    const mutationParameters = {
      poolId: values.poolId,
      screeningQuestions: values.screeningQuestionFieldArray?.map(
        ({ screeningQuestion }, index) => ({
          question: {
            en: screeningQuestion.en,
            fr: screeningQuestion.fr,
          },
          sortOrder: index + 1,
        }),
      ),
      assessmentStep: {
        title: {
          en: values.assessmentTitleEn,
          fr: values.assessmentTitleFr,
        },
        poolSkills: {
          sync: values.assessedSkills,
        },
      },
    };
    return executeCreateOrUpdateScreeningQuestionAssessmentStepMutation(
      mutationParameters,
    ).then((res) => {
      if (res?.data?.createOrUpdateScreeningQuestionAssessmentStep?.id) {
        return Promise.resolve();
      }
      return Promise.reject();
    });
  };

  const submitForm = (values: FormValues) => {
    let mutationPromise: Promise<void> | null = null;

    if (dialogMode === "screening_question") {
      mutationPromise =
        submitCreateOrUpdateAssessmentWithScreeningQuestionsMutation(values);
    } else if (dialogAction === "update") {
      mutationPromise = submitUpdateAssessmentStepMutation(values);
    } else {
      mutationPromise = submitCreateAssessmentStepMutation(values);
    }

    mutationPromise
      .then(() => {
        toast.success(
          intl.formatMessage({
            defaultMessage: "Successfully saved assessment step!",
            id: "W1vWDi",
            description:
              "Success message displayed after unlinking an experience to a skill",
          }),
        );
        setIsOpen(false);
        reset(); // the create dialog could be used several times in a row
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: saving assessment step failed.",
            id: "DnXch4",
            description:
              "Message displayed to user after assessment step fails to be saved.",
          }),
        );
      });
  };

  const canAddScreeningQuestions =
    fields.length < SCREENING_QUESTIONS_MAX_QUESTIONS;

  const assessedSkillsItems: CheckboxOption[] = allPoolSkills.map(
    (poolSkill) => ({
      value: poolSkill.id,
      label: poolSkill?.skill?.name
        ? getLocalizedName(poolSkill.skill.name, intl)
        : intl.formatMessage(commonMessages.nameNotLoaded),
    }),
  );
  assessedSkillsItems.sort((a, b) => {
    return (a.label ?? "") > (b.label ?? "") ? 1 : -1;
  });

  const assessmentStepTypeOptions = [
    // can't manually choose or edit application screening step
    AssessmentStepType.ScreeningQuestionsAtApplication,
    AssessmentStepType.TechnicalExamAtSite,
    AssessmentStepType.TechnicalExamAtHome,
    AssessmentStepType.PscExam,
    AssessmentStepType.InterviewGroup,
    AssessmentStepType.InterviewIndividual,
    AssessmentStepType.InterviewFollowup,
    AssessmentStepType.ReferenceCheck,
    AssessmentStepType.AdditionalAssessment,
  ]
    .filter(
      (stepType) =>
        !disallowStepTypes.some(
          (disallowStepType) => disallowStepType === stepType,
        ),
    )
    .map<Option>((stepType) => ({
      value: stepType,
      label: intl.formatMessage(getAssessmentStepType(stepType)),
    }));

  const dialogBusy =
    updateAssessmentStepFetching ||
    createAssessmentStepFetching ||
    createOrUpdateScreeningQuestionAssessmentStepMutationFetching;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <Dialog.Trigger>{trigger}</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          subtitle={intl.formatMessage({
            defaultMessage: "Provide additional details about this assessment",
            id: "FffxNt",
            description: "Subtitle for Assessment details dialog",
          })}
        >
          {intl.formatMessage({
            defaultMessage: "Assessment details",
            id: "LOVZi6",
            description: "Title for Assessment details dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(submitForm)}>
              <input type="hidden" {...methods.register("id")} />
              <input type="hidden" {...methods.register("poolId")} />
              <div
                data-h2-display="base(flex)"
                data-h2-flex-direction="base(column)"
                data-h2-gap="base(x1 0)"
                data-h2-margin="base(x1, 0, x2, 0)"
              >
                <div>
                  <div data-h2-font-weight="base(700)">
                    {intl.formatMessage({
                      defaultMessage: "Basic details",
                      id: "i131l/",
                      description:
                        "title of 'basic details' section of the 'assessment details' dialog",
                    })}
                  </div>
                  <div data-h2-margin-top="base(x.25)">
                    {intl.formatMessage({
                      defaultMessage:
                        "Select the method that best describes how your organization plans to assess these skills. You can rename this assessment if necessary.",
                      id: "CCyraT",
                      description:
                        "description of 'basic details' section of the 'assessment details' dialog",
                    })}
                  </div>
                </div>

                <Select
                  id="typeOfAssessment"
                  label={intl.formatMessage(labels.typeOfAssessment)}
                  name="typeOfAssessment"
                  nullSelection={intl.formatMessage(
                    uiMessages.nullSelectionOption,
                  )}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                  disabled={dialogAction === "update"}
                  options={assessmentStepTypeOptions.map(({ value }) => ({
                    value,
                    label: intl.formatMessage(getAssessmentStepType(value)),
                  }))}
                  doNotSort
                />

                {dialogMode === "regular" ? (
                  <div data-h2-flex-grid="base(flex-start, x2, x1)">
                    <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
                      <Input
                        id="assessmentTitleEn"
                        name="assessmentTitleEn"
                        type="text"
                        label={intl.formatMessage(labels.assessmentTitleEn)}
                      />
                    </div>{" "}
                    <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
                      <Input
                        id="assessmentTitleFr"
                        name="assessmentTitleFr"
                        type="text"
                        label={intl.formatMessage(labels.assessmentTitleFr)}
                      />
                    </div>
                  </div>
                ) : null}
                {dialogMode === "screening_question" ? (
                  <>
                    <div>
                      <div data-h2-font-weight="base(700)">
                        {intl.formatMessage({
                          defaultMessage: "Screening questions",
                          id: "V62J5w",
                          description:
                            "title of 'screening questions' section of the assessment builder",
                        })}
                      </div>
                      <div data-h2-margin-top="base(x.25)">
                        {intl.formatMessage({
                          defaultMessage:
                            "This assessment requires at least one question, please add it here.",
                          id: "lVb1hs",
                          description:
                            "description of 'screening questions' section of the 'assessment details' dialog",
                        })}
                      </div>
                    </div>
                    <Repeater.Root
                      data-h2-margin-bottom="base(1rem)"
                      name="screeningQuestionFieldArray"
                      total={fields.length}
                      showAdd={canAddScreeningQuestions}
                      showUnsavedChanges={false}
                      onAdd={() => {
                        append({
                          id: null,
                          screeningQuestion: {
                            en: "",
                            fr: "",
                          },
                        });
                      }}
                      addText={intl.formatMessage(
                        {
                          defaultMessage:
                            "Add a new question ({currentCount}/{maxCount})",
                          id: "pPUC7o",
                          description:
                            "Button text to add a new screening question",
                        },
                        {
                          currentCount: fields.length,
                          maxCount: SCREENING_QUESTIONS_MAX_QUESTIONS,
                        },
                      )}
                    >
                      <>
                        {fields.map(({ id }, index) => (
                          <Repeater.Fieldset
                            name="screeningQuestionFieldArray"
                            key={id}
                            index={index}
                            total={fields.length}
                            onMove={move}
                            onRemove={remove}
                            legend={intl.formatMessage(
                              {
                                defaultMessage: "Screening question {index}",
                                id: "s+ObMR",
                                description:
                                  "Legend for screening question fieldset",
                              },
                              {
                                index: index + 1,
                              },
                            )}
                            hideLegend
                          >
                            <input
                              type="hidden"
                              name={`screeningQuestionFieldArray.${index}.id`}
                            />
                            <input
                              type="hidden"
                              name={`screeningQuestionFieldArray.${index}.sortOrder`}
                            />
                            <div
                              data-h2-display="base(grid)"
                              data-h2-grid-template-columns="base(1fr 1fr)"
                              data-h2-gap="base(0 x1)"
                            >
                              <div>
                                <TextArea
                                  id={`screeningQuestionFieldArray.${index}.screeningQuestion.en`}
                                  name={`screeningQuestionFieldArray.${index}.screeningQuestion.en`}
                                  label={intl.formatMessage(
                                    labels.screeningQuestionEn,
                                    { questionNumber: index + 1 },
                                  )}
                                  rows={SCREENING_QUESTIONS_TEXT_AREA_ROWS}
                                  wordLimit={
                                    SCREENING_QUESTIONS_TEXT_AREA_EN_MAX_WORDS
                                  }
                                  rules={{
                                    required: intl.formatMessage(
                                      errorMessages.required,
                                    ),
                                  }}
                                />
                              </div>
                              <div>
                                <TextArea
                                  id={`screeningQuestionFieldArray.${index}.screeningQuestion.fr`}
                                  name={`screeningQuestionFieldArray.${index}.screeningQuestion.fr`}
                                  label={intl.formatMessage(
                                    labels.screeningQuestionFr,
                                    { questionNumber: index + 1 },
                                  )}
                                  rows={SCREENING_QUESTIONS_TEXT_AREA_ROWS}
                                  wordLimit={
                                    SCREENING_QUESTIONS_TEXT_AREA_FR_MAX_WORDS
                                  }
                                  rules={{
                                    required: intl.formatMessage(
                                      errorMessages.required,
                                    ),
                                  }}
                                />
                              </div>
                            </div>
                          </Repeater.Fieldset>
                        ))}
                        {!canAddScreeningQuestions && (
                          <Well>
                            <p
                              data-h2-font-weight="base(700)"
                              data-h2-margin-bottom="base(x.5)"
                            >
                              {intl.formatMessage({
                                defaultMessage:
                                  "You have reached the maximum amount (3) of screening questions per poster.",
                                id: "qs09PP",
                                description:
                                  "Message displayed when a user adds the maximum number of questions",
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
                  </>
                ) : null}

                <div>
                  <div data-h2-font-weight="base(700)">
                    {intl.formatMessage({
                      defaultMessage: "Skill selection",
                      id: "lmD1ef",
                      description:
                        "title of 'skill selection' section of the 'assessment details' dialog",
                    })}
                  </div>
                  <div data-h2-margin-top="base(x.25)">
                    {intl.formatMessage({
                      defaultMessage:
                        "Using the list of skills from the pool advertisement, select the skills you are planning to assess using this evaluation method. ",
                      id: "ARL2Tz",
                      description:
                        "description of 'skill selection' section of the 'assessment details' dialog",
                    })}
                  </div>
                </div>
                <Checklist
                  idPrefix="assessedSkills"
                  id="assessedSkills"
                  name="assessedSkills"
                  legend={intl.formatMessage(labels.assessedSkills)}
                  items={assessedSkillsItems}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                />
                {!assessedSkillsItems.length ? (
                  <Field.Error>
                    {intl.formatMessage({
                      defaultMessage:
                        "There are no skills selected. Please use the 'Advertisement information' page to add some skills.",
                      id: "aZUxFF",
                      description:
                        "Error message when there aren't any skills to select",
                    })}
                  </Field.Error>
                ) : null}
              </div>
            </form>
          </FormProvider>

          <Dialog.Footer data-h2-justify-content="base(flex-start)">
            <Button
              color="secondary"
              onClick={handleSubmit(submitForm)}
              disabled={dialogBusy}
            >
              {intl.formatMessage({
                defaultMessage: "Save assessment details",
                id: "4AIeko",
                description: "Button text to save assessment details",
              })}
            </Button>
            <Dialog.Close>
              <Button mode="inline" color="warning" disabled={dialogBusy}>
                {intl.formatMessage(commonMessages.cancel)}
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default AssessmentDetailsDialog;
