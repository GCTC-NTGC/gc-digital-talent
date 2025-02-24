import { useIntl } from "react-intl";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useMutation, useQuery } from "urql";
import { ReactNode, useState, useEffect } from "react";

import { Button, Chip, Chips, Dialog, Well } from "@gc-digital-talent/ui";
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
  Field,
  alphaSortOptions,
  localizedEnumToOptions,
} from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import {
  graphql,
  AssessmentStepType,
  Maybe,
  PoolSkill,
  ScreeningQuestion,
  Scalars,
  PoolSkillType,
  FragmentType,
  getFragment,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import processMessages from "~/messages/processMessages";

import labels from "./AssessmentDetailsDialogLabels";
import {
  SCREENING_QUESTIONS_MAX_QUESTIONS,
  SCREENING_QUESTIONS_TEXT_AREA_EN_MAX_WORDS,
  SCREENING_QUESTIONS_TEXT_AREA_FR_MAX_WORDS,
  SCREENING_QUESTIONS_TEXT_AREA_ROWS,
} from "../constants";
import { poolSkillToOption } from "../utils";

interface AssessedSkillsItems {
  essentialSkillItems: CheckboxOption[];
  assetSkills: CheckboxOption[];
}

const AssessmentDetailsDialog_CreateMutation = graphql(/* GraphQL */ `
  mutation createAssessmentStep(
    $poolId: UUID!
    $assessmentStep: AssessmentStepInput
  ) {
    createAssessmentStep(poolId: $poolId, assessmentStep: $assessmentStep) {
      id
    }
  }
`);

const AssessmentDetailsDialog_UpdateMutation = graphql(/* GraphQL */ `
  mutation updateAssessmentStep(
    $id: UUID!
    $assessmentStep: AssessmentStepInput
  ) {
    updateAssessmentStep(id: $id, assessmentStep: $assessmentStep) {
      id
    }
  }
`);

const AssessmentDetailsDialog_ScreeningQuestionMutation = graphql(
  /* GraphQL */ `
    mutation createOrUpdateScreeningScreeningAssessmentStep(
      $poolId: UUID!
      $screeningQuestions: [SyncScreeningQuestionsInput]
      $assessmentStep: ScreeningQuestionAssessmentStepInput
    ) {
      createOrUpdateScreeningQuestionAssessmentStep(
        poolId: $poolId
        screeningQuestions: $screeningQuestions
        assessmentStep: $assessmentStep
      ) {
        id
      }
    }
  `,
);

const AssessmentDetailsDialogPoolSkill_Fragment = graphql(/* GraphQL */ `
  fragment AssessmentDetailsDialogPoolSkill on PoolSkill {
    id
    type {
      value
      label {
        en
        fr
      }
    }
    skill {
      id
      category {
        value
        label {
          en
          fr
        }
      }
      key
      name {
        en
        fr
      }
    }
    assessmentSteps {
      id
    }
  }
`);

const AssessmentDetailsDialogOptions_Query = graphql(/* GraphQL */ `
  query AssessmentDetailsDialogOptions {
    assessmentStepTypes: localizedEnumStrings(enumName: "AssessmentStepType") {
      value
      label {
        en
        fr
      }
    }
  }
`);

const allowedStepTypes = [
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
];

type DialogMode = "regular" | "screening_question";
type DialogAction = "create" | "update";

interface FormValues {
  id?: Maybe<Scalars["ID"]["output"]>;
  poolId?: Maybe<Scalars["ID"]["output"]>;
  typeOfAssessment?: Maybe<AssessmentStepType>;
  assessmentTitleEn?: Maybe<string>;
  assessmentTitleFr?: Maybe<string>;
  screeningQuestionFieldArray?: {
    id: string | null;
    screeningQuestion: {
      id?: Maybe<Scalars["ID"]["output"]>;
      sortOrder?: Maybe<number>;
      en?: Maybe<string>;
      fr?: Maybe<string>;
    };
  }[];
  assessedSkills?: Maybe<Scalars["ID"]["output"][]>;
  assessedSkillsScreeningQuestions?: Maybe<Scalars["ID"]["output"][]>;
}

type InitialValues = Omit<
  FormValues,
  "poolId" | "screeningQuestionFieldArray"
> & {
  poolId: NonNullable<FormValues["poolId"]>;
  screeningQuestions?: ScreeningQuestion[];
};

interface AssessmentDetailsDialogProps {
  initialValues: InitialValues;
  poolSkillsQuery: FragmentType<
    typeof AssessmentDetailsDialogPoolSkill_Fragment
  >[];
  disallowStepTypes?: AssessmentStepType[];
  trigger: ReactNode;
  onError?: () => void;
}

const AssessmentDetailsDialog = ({
  initialValues,
  poolSkillsQuery,
  disallowStepTypes = [],
  trigger,
  onError,
}: AssessmentDetailsDialogProps) => {
  const intl = useIntl();
  const [{ data: stringsData }] = useQuery({
    query: AssessmentDetailsDialogOptions_Query,
  });
  const allPoolSkills = getFragment(
    AssessmentDetailsDialogPoolSkill_Fragment,
    poolSkillsQuery,
  );
  const dialogAction: DialogAction = initialValues.id ? "update" : "create";
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [
    { fetching: createAssessmentStepFetching },
    executeCreateAssessmentStepMutation,
  ] = useMutation(AssessmentDetailsDialog_CreateMutation);
  const [
    { fetching: updateAssessmentStepFetching },
    executeUpdateAssessmentStepMutation,
  ] = useMutation(AssessmentDetailsDialog_UpdateMutation);
  const [
    { fetching: createOrUpdateScreeningQuestionAssessmentStepMutationFetching },
    executeCreateOrUpdateScreeningQuestionAssessmentStepMutation,
  ] = useMutation(AssessmentDetailsDialog_ScreeningQuestionMutation);

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
  const {
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = methods;

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

  useEffect(() => {
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
      poolId: values.poolId ?? "",
      assessmentStep: {
        type: values.typeOfAssessment,
        title: {
          en: values.assessmentTitleEn,
          fr: values.assessmentTitleFr,
        },
        poolSkills: {
          sync: values.assessedSkills ?? [],
        },
      },
    };
    return executeCreateAssessmentStepMutation(mutationParameters).then(
      (result) => {
        if (result?.data?.createAssessmentStep?.id) {
          return Promise.resolve();
        }
        return Promise.reject(new Error(result.error?.toString()));
      },
    );
  };

  const submitUpdateAssessmentStepMutation = (
    values: FormValues,
  ): Promise<void> => {
    const mutationParameters = {
      id: values.id ?? "",
      assessmentStep: {
        type: values.typeOfAssessment,
        title: {
          en: values.assessmentTitleEn,
          fr: values.assessmentTitleFr,
        },
        poolSkills: {
          sync: values.assessedSkills ?? [],
        },
      },
    };
    return executeUpdateAssessmentStepMutation(mutationParameters).then(
      (res) => {
        if (res?.data?.updateAssessmentStep?.id) {
          return Promise.resolve();
        }
        return Promise.reject(new Error(res.error?.toString()));
      },
    );
  };

  const submitCreateOrUpdateAssessmentWithScreeningQuestionsMutation = (
    values: FormValues,
  ): Promise<void> => {
    const mutationParameters = {
      poolId: values.poolId ?? "",
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
          sync:
            values.assessedSkills?.length && values.assessedSkills.length > 0
              ? values.assessedSkills
              : [],
        },
      },
    };
    return executeCreateOrUpdateScreeningQuestionAssessmentStepMutation(
      mutationParameters,
    ).then((res) => {
      if (res?.data?.createOrUpdateScreeningQuestionAssessmentStep?.id) {
        return Promise.resolve();
      }
      return Promise.reject(new Error(res.error?.toString()));
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
        onError?.();
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

  const assessedSkillsItems: AssessedSkillsItems = allPoolSkills.reduce(
    (assessedSkills: AssessedSkillsItems, poolSkill: PoolSkill) => {
      if (poolSkill.type?.value === PoolSkillType.Essential) {
        return {
          essentialSkillItems: [
            ...assessedSkills.essentialSkillItems,
            poolSkillToOption(
              { id: poolSkill.id, skill: poolSkill.skill },
              intl,
            ),
          ],
          assetSkills: assessedSkills.assetSkills,
        };
      }

      if (poolSkill.type?.value === PoolSkillType.Nonessential) {
        return {
          assetSkills: [
            ...assessedSkills.assetSkills,
            poolSkillToOption(
              { id: poolSkill.id, skill: poolSkill.skill },
              intl,
            ),
          ],
          essentialSkillItems: assessedSkills.essentialSkillItems,
        };
      }

      return assessedSkills;
    },
    {
      essentialSkillItems: [],
      assetSkills: [],
    },
  );

  const assessmentStepTypeOptions = localizedEnumToOptions(
    stringsData?.assessmentStepTypes?.filter((stepType) => {
      const value = (stepType.value ?? "") as AssessmentStepType;
      return (
        allowedStepTypes.includes(value) && !disallowStepTypes.includes(value)
      );
    }),
    intl,
  );
  const dialogBusy =
    updateAssessmentStepFetching ||
    createAssessmentStepFetching ||
    createOrUpdateScreeningQuestionAssessmentStepMutationFetching;

  const missingEssentialSkills = allPoolSkills
    .filter((poolSkill) => poolSkill.type?.value === PoolSkillType.Essential)
    .filter(({ assessmentSteps }) => {
      const steps = unpackMaybes(assessmentSteps);

      if (steps.length === 0) {
        return true;
      }

      return false;
    });

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <Dialog.Trigger>{trigger}</Dialog.Trigger>
      <Dialog.Content hasSubtitle>
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
                  options={assessmentStepTypeOptions}
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
                      {/* eslint-disable-next-line formatjs/no-literal-string-in-jsx */}
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
                        {intl.formatMessage(processMessages.screeningQuestions)}
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
                      showAdd={canAddScreeningQuestions}
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
                            isLast={index === fields.length - 1}
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

                <div data-h2-display="base(grid)" data-h2-gap="base(x.25)">
                  <div data-h2-font-weight="base(700)">
                    {intl.formatMessage({
                      defaultMessage: "Skill selection",
                      id: "lmD1ef",
                      description:
                        "title of 'skill selection' section of the 'assessment details' dialog",
                    })}
                  </div>
                  <div>
                    {intl.formatMessage({
                      defaultMessage:
                        "Using the list of skills from the recruitment process, select the skills you are planning to assess using this evaluation method.",
                      id: "II4+N3",
                      description:
                        "description of 'skill selection' section of the 'assessment details' dialog",
                    })}
                  </div>
                  {missingEssentialSkills.length ? (
                    <Well
                      color="warning"
                      data-h2-margin-top="base(x.25)"
                      data-h2-padding="base(x.5)"
                    >
                      <p
                        data-h2-margin-bottom="base(x.5)"
                        data-h2-font-size="base(caption)"
                      >
                        {intl.formatMessage({
                          defaultMessage:
                            "The following skills are missing at least 1 assessment",
                          id: "EY7YQM",
                          description:
                            "Warning message for skills with missing assessment on the 'assessment details' dialog",
                        })}
                        {intl.formatMessage(commonMessages.dividingColon)}
                      </p>
                      <Chips>
                        {missingEssentialSkills.map(({ skill }) => (
                          <Chip key={skill?.id} color="warning">
                            {getLocalizedName(skill?.name, intl)}
                          </Chip>
                        ))}
                      </Chips>
                    </Well>
                  ) : null}
                </div>
                {assessedSkillsItems.essentialSkillItems.length > 0 && (
                  <Checklist
                    idPrefix="essentialSkills"
                    id="essentialSkills"
                    name="assessedSkills"
                    legend={intl.formatMessage(labels.essentialSkills)}
                    items={alphaSortOptions(
                      assessedSkillsItems.essentialSkillItems,
                    )}
                    rules={{
                      validate: (selectedAssessedSkills: string[]) => {
                        return selectedAssessedSkills.length > 0;
                      },
                    }}
                  />
                )}
                {assessedSkillsItems.assetSkills.length > 0 && (
                  <Checklist
                    idPrefix="assetSkills"
                    id="assetSkills"
                    name="assessedSkills"
                    legend={intl.formatMessage(labels.assetSkills)}
                    items={alphaSortOptions(assessedSkillsItems.assetSkills)}
                    rules={{
                      validate: (selectedAssessedSkills: string[]) => {
                        return selectedAssessedSkills.length > 0;
                      },
                    }}
                  />
                )}
                {errors.assessedSkills ? (
                  <Field.Error>
                    {intl.formatMessage(errorMessages.required)}
                  </Field.Error>
                ) : null}
                {!assessedSkillsItems.essentialSkillItems.length &&
                !assessedSkillsItems.assetSkills.length ? (
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

          <Dialog.Footer>
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
