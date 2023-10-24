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
  enumToOptions,
} from "@gc-digital-talent/forms";
import {
  AssessmentStepType,
  LocalizedString,
  Maybe,
  PoolSkill,
  Scalars,
  useCreateAssessmentStepMutation,
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

type ScreeningQuestionValue = {
  id?: Scalars["ID"];
  question: LocalizedString;
};

type FormValues = {
  id?: Maybe<Scalars["ID"]>;
  poolId?: Maybe<Scalars["ID"]>;
  sortOrder?: Maybe<number>;
  typeOfAssessment?: Maybe<AssessmentStepType>;
  assessmentTitleEn?: Maybe<string>;
  assessmentTitleFr?: Maybe<string>;
  screeningQuestions?: Maybe<Array<ScreeningQuestionValue>>;
  assessedSkills?: Maybe<Array<Scalars["ID"]>>;
};

interface AssessmentDetailsDialogProps {
  mode?: DialogMode;
  initialValues?: FormValues;
  allPoolSkills: PoolSkill[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const AssessmentDetailsDialog = ({
  allPoolSkills,
  initialValues,
  isOpen,
  setIsOpen,
}: AssessmentDetailsDialogProps) => {
  const intl = useIntl();

  const [{ fetching: createFetching }, executeCreateMutation] =
    useCreateAssessmentStepMutation();

  const methods = useForm<FormValues>({
    defaultValues: initialValues,
  });
  const { handleSubmit, control, watch, setValue, reset } = methods;
  const { remove, move, append, fields } = useFieldArray({
    control,
    name: "screeningQuestions",
  });

  const [selectedTypeOfAssessment] = watch(["typeOfAssessment"]);
  const dialogMode: DialogMode =
    selectedTypeOfAssessment ===
    AssessmentStepType.ScreeningQuestionsAtApplication
      ? "screening_question"
      : "regular";

  React.useEffect(() => {
    if (dialogMode === "regular") {
      setValue("screeningQuestions", []);
    }
    if (dialogMode === "screening_question") {
      setValue("assessmentTitleEn", null);
      setValue("assessmentTitleFr", null);
    }
  }, [dialogMode, setValue]);

  const submitForm = async (values: FormValues) => {
    // can't do this validation in the repeater right now 😢
    if (
      values.typeOfAssessment ===
        AssessmentStepType.ScreeningQuestionsAtApplication &&
      !values.screeningQuestions?.length
    ) {
      toast.error(
        intl.formatMessage({
          defaultMessage:
            "This assessment requires at least one question, please add it here.",
          id: "lVb1hs",
          description:
            "description of 'screening questions' section of the 'assessment details' dialog",
        }),
      );
      return;
    }

    await executeCreateMutation({
      poolId: values.poolId,
      step: {
        type: values.typeOfAssessment,
        sortOrder: values.sortOrder,
        title: {
          en: values.assessmentTitleEn,
          fr: values.assessmentTitleFr,
        },
        poolSkills: {
          sync: values.assessedSkills,
        },
      },
    })
      .then((res) => {
        if (res.data) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "Successfully saved assessment step!",
              id: "W1vWDi",
              description:
                "Success message displayed after unlinking an experience to a skill",
            }),
          );
          setIsOpen(false);
          reset();
        }
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

  const assessedSkillsItems: CheckboxOption[] = allPoolSkills
    .map((poolSkill) => ({
      value: poolSkill.id,
      label: poolSkill?.skill?.name
        ? getLocalizedName(poolSkill.skill.name, intl)
        : intl.formatMessage(commonMessages.nameNotLoaded),
    }))
    .sort((a, b) => {
      return a.label > b.label ? 1 : -1;
    });

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
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
              <input type="hidden" {...methods.register("sortOrder")} />
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
                  options={enumToOptions(AssessmentStepType, [
                    AssessmentStepType.ScreeningQuestionsAtApplication,
                    AssessmentStepType.TechnicalExamAtSite,
                    AssessmentStepType.TechnicalExamAtHome,
                    AssessmentStepType.PscExam,
                    AssessmentStepType.InterviewGroup,
                    AssessmentStepType.InterviewIndividual,
                    AssessmentStepType.InterviewFollowup,
                    AssessmentStepType.ReferenceCheck,
                    AssessmentStepType.AdditionalAssessment,
                  ]).map(({ value }) => ({
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
                          id: "ccyVDQ",
                          description:
                            "title of 'screening questions' section of the 'assessment details' dialog",
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
                      name="questions"
                      total={fields.length}
                      showAdd={canAddScreeningQuestions}
                      showUnsavedChanges
                      onAdd={() => {
                        append({
                          id: "new",
                          question: {
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
                        {fields.length ? (
                          fields.map((item, index) => (
                            <Repeater.Fieldset
                              key={item.id}
                              name="questions"
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
                              // no frontend validation (1-3 questions) possible #7888
                            >
                              <input
                                type="hidden"
                                name={`questions.${index}.id`}
                              />
                              <div
                                data-h2-display="base(grid)"
                                data-h2-grid-template-columns="base(1fr 1fr)"
                                data-h2-gap="base(0 x1)"
                              >
                                <div>
                                  <TextArea
                                    id={`questions.${index}.question.en`}
                                    name={`questions.${index}.question.en`}
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
                                    id={`questions.${index}.question.fr`}
                                    name={`questions.${index}.question.fr`}
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
                          ))
                        ) : (
                          <Well>
                            <p
                              data-h2-font-weight="base(700)"
                              data-h2-margin-bottom="base(x.5)"
                            >
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
                          </Well>
                        )}
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
              </div>
            </form>
          </FormProvider>

          <Dialog.Footer data-h2-justify-content="base(flex-start)">
            <Button
              color="secondary"
              onClick={handleSubmit(submitForm)}
              // disabled={updating || creating}
            >
              {intl.formatMessage({
                defaultMessage: "Save assessment details",
                id: "4AIeko",
                description: "Button text to save assessment details",
              })}
            </Button>
            <Dialog.Close>
              <Button
                mode="inline"
                color="warning"
                // disabled={updating || creating}
              >
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
