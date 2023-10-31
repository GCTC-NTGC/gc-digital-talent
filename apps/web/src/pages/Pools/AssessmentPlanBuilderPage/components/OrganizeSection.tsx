import React from "react";
import { defineMessage, useIntl } from "react-intl";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import PlusCircleIcon from "@heroicons/react/20/solid/PlusCircleIcon";

import { toast } from "@gc-digital-talent/toast";
import { Accordion, Button, Heading } from "@gc-digital-talent/ui";
import {
  AssessmentStep,
  AssessmentStepType,
  Pool,
  PoolStatus,
  useDeleteAssessmentStepMutation,
  useUpdateAssessmentStepMutation,
} from "@gc-digital-talent/graphql";
import { notEmpty } from "@gc-digital-talent/helpers";
import { Repeater } from "@gc-digital-talent/forms";
import Context from "@gc-digital-talent/forms/src/components/Field/Context";

import AssessmentDetailsDialog from "./AssessmentDetailsDialog";
import { PAGE_SECTION_ID } from "../navigation";
import {
  ASSESSMENT_STEPS_FEW_STEPS,
  ASSESSMENT_STEPS_MANY_STEPS,
  ASSESSMENT_STEPS_MAX_STEPS,
} from "../constants";
import AssessmentStepFieldset from "./AssessmentStepFieldset";

type FormValues = {
  assessmentStepFieldArray?: Array<{
    id: string | null;
    assessmentStep: AssessmentStep;
  }>;
};

const sectionTitle = defineMessage({
  defaultMessage: "Organize assessment approach",
  id: "qFY+K4",
  description: "Title for the organize section in the assessment plan builder",
});

export interface OrganizeSectionProps {
  pool: Pool;
  pageIsLoading: boolean;
}

const OrganizeSection = ({
  pool,
  pageIsLoading: pageLoading,
}: OrganizeSectionProps) => {
  const intl = useIntl();
  const addId = React.useId();
  const [isNewStepDialogOpen, setIsNewStepDialogOpen] =
    React.useState<boolean>(false);

  const [{ fetching: deleteFetching }, executeDeleteMutation] =
    useDeleteAssessmentStepMutation();
  const [{ fetching: updateFetching }, executeUpdateMutation] =
    useUpdateAssessmentStepMutation();

  const initialAssessmentSteps = pool.assessmentSteps?.filter(notEmpty) ?? [];
  initialAssessmentSteps.sort((a, b) =>
    (a.sortOrder ?? Number.MAX_SAFE_INTEGER) >
    (b.sortOrder ?? Number.MAX_SAFE_INTEGER)
      ? 1
      : -1,
  );

  const defaultValues = {
    assessmentStepFieldArray: initialAssessmentSteps.map((assessmentStep) => ({
      id: null, // filled by react-hook-form
      assessmentStep,
    })),
  };

  const methods = useForm<FormValues>({
    values: defaultValues,
  });

  const { control } = methods;
  const {
    remove: fieldArrayRemove,
    move: fieldArrayMove,
    fields,
  } = useFieldArray({
    control,
    name: "assessmentStepFieldArray",
  });

  const remove = (index: number) => {
    const { id } = fields[index].assessmentStep;

    executeDeleteMutation({ id })
      .then((res) => {
        if (res.data?.deleteAssessmentStep?.id) {
          return Promise.resolve();
        }
        return Promise.reject();
      })
      .then(() => {
        toast.success(
          intl.formatMessage({
            defaultMessage: "Successfully saved assessment steps!",
            id: "dGgEAz",
            description: "Success message displayed after all steps were saved",
          }),
        );
        fieldArrayRemove(index); // optimistic UI update
      })
      .catch(() =>
        toast.error(
          intl.formatMessage({
            defaultMessage: "Not all assessment steps changes saved.",
            id: "cNeFmG",
            description:
              "Error message displayed after all some steps were not changed",
          }),
        ),
      );
  };

  const move = (indexFrom: number, indexTo: number) => {
    const modifiedArray = [...initialAssessmentSteps];
    modifiedArray.splice(indexTo, 0, modifiedArray.splice(indexFrom, 1)[0]); // https://stackoverflow.com/a/5306832

    const toBeMovedItems = modifiedArray
      .map((assessmentStep, index) => ({
        id: assessmentStep.id,
        oldSortOrder: assessmentStep.sortOrder,
        newSortOrder: index + 1,
      }))
      .filter((item) => item.oldSortOrder !== item.newSortOrder);

    const updatePromises = toBeMovedItems.map((item) =>
      executeUpdateMutation({
        id: item.id,
        assessmentStep: {
          sortOrder: item.newSortOrder,
        },
      }).then((res) => {
        if (res.data?.updateAssessmentStep?.id) {
          return Promise.resolve();
        }
        return Promise.reject();
      }),
    );

    Promise.all(updatePromises)
      .then(() => {
        fieldArrayMove(indexFrom, indexTo); // optimistic UI update
        toast.success(
          intl.formatMessage({
            defaultMessage: "Successfully saved assessment steps!",
            id: "dGgEAz",
            description: "Success message displayed after all steps were saved",
          }),
        );
      })
      .catch(() =>
        toast.error(
          intl.formatMessage({
            defaultMessage: "Not all assessment steps changes saved.",
            id: "cNeFmG",
            description:
              "Error message displayed after all some steps were not changed",
          }),
        ),
      );
  };

  const formDisabled =
    pool.status !== PoolStatus.Draft ||
    deleteFetching ||
    updateFetching ||
    pageLoading;
  const canAdd = fields.length < ASSESSMENT_STEPS_MAX_STEPS;
  const alreadyHasAScreeningQuestionsStep = !!pool.assessmentSteps?.find(
    (assessmentStep) =>
      assessmentStep?.type ===
      AssessmentStepType.ScreeningQuestionsAtApplication,
  );

  return (
    <>
      <Heading level="h3" id={PAGE_SECTION_ID.ORGANIZE_ASSESSMENT_APPROACH}>
        {intl.formatMessage(sectionTitle)}
      </Heading>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Use this section to define which assessments will be used as part of your assessment process. You can also change the order in which you plan to perform these evaluations. The only exceptions are the “Application screening” and the “Screening questions (at the time of application)” assessments which will always be the first and second steps in any pool advertisement.",
          id: "F46Sel",
          description:
            "introduction to the organize section in the assessment plan builder",
        })}
      </p>
      <Accordion.Root type="multiple" mode="simple">
        <Accordion.Item value="one">
          <Accordion.Header
            headingAs="h4"
            data-h2-font-size="base(copy)"
            data-h2-text-decoration="base(underline)"
          >
            <Accordion.Trigger data-h2-font-weight="base(700)">
              {intl.formatMessage({
                defaultMessage: "How many assessments should I include?",
                id: "WhQFXx",
                description:
                  "first question in the organize section in the assessment plan builder",
              })}
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "Every skill you have identified on your poster needs to be assessed through at least one method. In cases where you are relying on claims made by a candidate (e.g. the initial application) you need to select an additional assessment method to test or validate the applicant's claim to have a skill. In most cases this will mean that you have two to three additional assessment methods beyond the initial application.",
                id: "Y+GgIV",
                description:
                  "First paragraph of first answer of the Frequently Asked Questions for logging in",
              })}
            </p>
            <p data-h2-margin-top="base(x.5)">
              {intl.formatMessage({
                defaultMessage:
                  "You do not need to assess each essential criteria through each assessment method. For example, technical skills claims from applicants are often best validated through some form of exam or technical interview question, while behavioural skills are often best validated through interview or reference check.",
                id: "VAI+TU",
                description:
                  "Second paragraph of second answer of the Frequently Asked Questions for logging in",
              })}
            </p>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="two">
          <Accordion.Header
            headingAs="h4"
            data-h2-font-size="base(copy)"
            data-h2-text-decoration="base(underline)"
          >
            <Accordion.Trigger data-h2-font-weight="base(700)">
              {intl.formatMessage(
                {
                  defaultMessage:
                    "What if I need more than {maxSteps} assessment methods?",
                  id: "LphzpW",
                  description:
                    "second question in the organize section in the assessment plan builder",
                },
                {
                  maxSteps: ASSESSMENT_STEPS_MAX_STEPS,
                },
              )}
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>
            <p>
              {intl.formatMessage(
                {
                  defaultMessage:
                    'Ultimately, it\'s the decision of the hiring panel or manager to determine how many assessment methods are appropriate. If you have more than {maxSteps}, select "Additional Assessment" for your last choice, and then reach out to our team. We can walk you through how these additional assessments can be handled on the platform.',
                  id: "9IMcqY",
                  description:
                    "First paragraph of second answer of the Frequently Asked Questions for logging in",
                },
                {
                  maxSteps: ASSESSMENT_STEPS_MAX_STEPS,
                },
              )}
            </p>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
      <div data-h2-margin-top="base(x1)">
        <FormProvider {...methods}>
          <form>
            <Repeater.Root
              name="assessmentStepFieldArray"
              total={fields.length}
              data-h2-margin-bottom="base(1rem)"
              showAdd={false}
              customButton={
                canAdd && !formDisabled
                  ? {
                      id: addId,
                      button: (
                        <AssessmentDetailsDialog
                          trigger={
                            <Button
                              id={addId}
                              icon={PlusCircleIcon}
                              type="button"
                              mode="placeholder"
                              block
                              color="secondary"
                            >
                              {intl.formatMessage(
                                {
                                  defaultMessage:
                                    "Add a new assessment ({currentCount}/{maxCount})",
                                  id: "jwCFf7",
                                  description:
                                    "Button text to add a new assessment to the assessment plan",
                                },
                                {
                                  currentCount: fields.length,
                                  maxCount: ASSESSMENT_STEPS_MAX_STEPS,
                                },
                              )}
                            </Button>
                          }
                          allPoolSkills={
                            pool.poolSkills?.filter(notEmpty) ?? []
                          }
                          disallowStepTypes={
                            alreadyHasAScreeningQuestionsStep
                              ? [
                                  AssessmentStepType.ScreeningQuestionsAtApplication,
                                ]
                              : []
                          }
                          initialValues={{
                            id: null,
                            poolId: pool.id,
                            sortOrder: fields.length + 1,
                          }}
                          isOpen={isNewStepDialogOpen}
                          setIsOpen={setIsNewStepDialogOpen}
                        />
                      ),
                    }
                  : undefined
              }
            >
              <>
                {fields.map(({ id, assessmentStep }, index) => {
                  return (
                    <AssessmentStepFieldset
                      key={id}
                      index={index}
                      assessmentStep={assessmentStep}
                      total={fields.length}
                      formDisabled={formDisabled}
                      pool={pool}
                      onRemove={() => remove(index)}
                      onMove={move}
                    />
                  );
                })}
              </>
            </Repeater.Root>

            <div
              data-h2-display="base(flex)"
              data-h2-gap="base(x1)"
              data-h2-flex-direction="base(column)"
            >
              {fields.length >= ASSESSMENT_STEPS_MANY_STEPS ? (
                <Context color="warning">
                  <p data-h2-font-weight="base(700)">
                    {fields.length === ASSESSMENT_STEPS_MAX_STEPS
                      ? intl.formatMessage({
                          defaultMessage: "You are at the limit!",
                          id: "j7+E9C",
                          description:
                            "Title for warning message when the user has added the maximum assessments to the assessment plan",
                        })
                      : intl.formatMessage({
                          defaultMessage: "You are approaching the limit!",
                          id: "1moJ8r",
                          description:
                            "Title for warning message when the user has added many assessments to the assessment plan",
                        })}
                  </p>
                  <p>
                    {intl.formatMessage(
                      {
                        defaultMessage:
                          "You can add up to {maxSteps} assessment methods, but you don't need to. You are covered as long as every skill has been taken into account. Choosing too many assessment methods can delay the staffing process and reduce the chances of a successful hire.",
                        id: "J/JdxQ",
                        description:
                          "Description for warning message when the user has added many assessments to the assessment plan",
                      },
                      {
                        maxSteps: ASSESSMENT_STEPS_MAX_STEPS,
                      },
                    )}
                  </p>
                </Context>
              ) : null}
              {fields.length <= ASSESSMENT_STEPS_FEW_STEPS ? (
                <Context color="warning">
                  <p data-h2-font-weight="base(700)">
                    {intl.formatMessage({
                      defaultMessage: "You have too few assessments",
                      id: "ypxaI2",
                      description:
                        "Title for warning message when the user has few assessments to the assessment plan",
                    })}
                  </p>
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "Consider adding at least one assessment method to strengthen the quality of your candidate pool.",
                      id: "xCoGIm",
                      description:
                        "Description for warning message when the user has few assessments to the assessment plan",
                    })}
                  </p>
                </Context>
              ) : null}
            </div>
          </form>
        </FormProvider>
      </div>
    </>
  );
};

export default OrganizeSection;
