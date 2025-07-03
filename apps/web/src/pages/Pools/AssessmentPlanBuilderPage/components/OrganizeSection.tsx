import { useMemo, useState, useEffect } from "react";
import { defineMessage, useIntl } from "react-intl";
import sortBy from "lodash/sortBy";
import { useMutation } from "urql";

import { toast } from "@gc-digital-talent/toast";
import { Accordion, CardRepeater, Heading, Well } from "@gc-digital-talent/ui";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import {
  graphql,
  AssessmentStep,
  AssessmentStepType,
  PoolStatus,
  FragmentType,
  getFragment,
} from "@gc-digital-talent/graphql";

import AssessmentDetailsDialog from "./AssessmentDetailsDialog";
import { PAGE_SECTION_ID } from "../navigation";
import {
  ASSESSMENT_STEPS_FEW_STEPS,
  ASSESSMENT_STEPS_MANY_STEPS,
  ASSESSMENT_STEPS_MAX_STEPS,
} from "../constants";
import AssessmentStepCard from "./AssessmentStepCard";

export const sectionTitle = defineMessage({
  defaultMessage: "Organize assessment approach",
  id: "qFY+K4",
  description: "Title for the organize section in the assessment plan builder",
});

const OrganizeSection_DeleteMutation = graphql(/* GraphQL */ `
  mutation deleteAssessmentStep($id: UUID!) {
    deleteAssessmentStep(id: $id) {
      id
    }
  }
`);
const OrganizeSection_SwapMutation = graphql(/* GraphQL */ `
  mutation swapAssessmentStepOrder($stepIdA: UUID!, $stepIdB: UUID!) {
    swapAssessmentStepOrder(stepIdA: $stepIdA, stepIdB: $stepIdB) {
      id
    }
  }
`);

const OrganizeSectionPool_Fragment = graphql(/* GraphQL */ `
  fragment OrganizeSectionPool on Pool {
    id
    status {
      value
      label {
        en
        fr
      }
    }
    ...AssessmentStepCardPool
    poolSkills {
      ...AssessmentDetailsDialogPoolSkill
    }
    assessmentSteps {
      id
      type {
        value
        label {
          en
          fr
        }
      }
      sortOrder
      poolSkills {
        id
        skill {
          id
          key
          category {
            value
            label {
              en
              fr
            }
          }
          name {
            en
            fr
          }
        }
      }
    }
  }
`);

interface OrganizeSectionProps {
  poolQuery: FragmentType<typeof OrganizeSectionPool_Fragment>;
  pageIsLoading: boolean;
}

const OrganizeSection = ({
  poolQuery,
  pageIsLoading: pageLoading,
}: OrganizeSectionProps) => {
  const intl = useIntl();
  const pool = getFragment(OrganizeSectionPool_Fragment, poolQuery);
  const initialSteps = useMemo(
    () => sortBy(unpackMaybes(pool.assessmentSteps), (step) => step.sortOrder),
    [pool.assessmentSteps],
  );
  const [steps, setSteps] =
    useState<Pick<AssessmentStep, "id" | "type" | "title" | "poolSkills">[]>(
      initialSteps,
    );

  useEffect(() => {
    setSteps(initialSteps);
  }, [initialSteps]);

  const resetSteps = () => {
    setSteps(initialSteps);
  };

  const [{ fetching: deleteFetching }, executeDeleteMutation] = useMutation(
    OrganizeSection_DeleteMutation,
  );
  const [{ fetching: swapFetching }, executeSwapMutation] = useMutation(
    OrganizeSection_SwapMutation,
  );

  const disabledIndexes = steps
    .map((step, index) => {
      return step.type?.value === AssessmentStepType.ApplicationScreening
        ? index
        : undefined;
    })
    .filter(notEmpty);

  const remove = (index: number) => {
    const { id } = steps[index];

    executeDeleteMutation({ id })
      .then((res) => {
        if (res.data?.deleteAssessmentStep?.id) {
          return Promise.resolve();
        }
        return Promise.reject(new Error(res.error?.toString()));
      })
      .then(() => {
        toast.success(
          intl.formatMessage({
            defaultMessage: "Successfully saved assessment steps!",
            id: "dGgEAz",
            description: "Success message displayed after all steps were saved",
          }),
        );
      })
      .catch(() => {
        resetSteps();
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

  const move = (indexFrom: number, indexTo: number) => {
    const id1 = steps[indexFrom].id;
    const id2 = steps[indexTo].id;

    executeSwapMutation({
      stepIdA: id1,
      stepIdB: id2,
    })
      .then((res) => {
        if (
          res.data?.swapAssessmentStepOrder?.length === 2 &&
          res.data.swapAssessmentStepOrder.every((step) => !!step?.id)
        ) {
          return Promise.resolve();
        }
        return Promise.reject(new Error(res.error?.toString()));
      })
      .then(() => {
        toast.success(
          intl.formatMessage({
            defaultMessage: "Successfully saved assessment steps!",
            id: "dGgEAz",
            description: "Success message displayed after all steps were saved",
          }),
        );
      })
      .catch(() => {
        resetSteps();
        toast.error(
          intl.formatMessage({
            defaultMessage: "Not all assessment steps changes saved.",
            id: "cNeFmG",
            description:
              "Error message displayed after all some steps were not changed",
          }),
        );
      });
  };
  // first index is application screening and can never be moved
  const moveDisabledIndexes = [0];
  // screening question step optionally exists
  const indexOfScreeningQuestionStep = steps.findIndex(
    (step) =>
      step.type?.value === AssessmentStepType.ScreeningQuestionsAtApplication,
  );
  // screening question can never be moved
  if (indexOfScreeningQuestionStep >= 0) {
    moveDisabledIndexes.push(indexOfScreeningQuestionStep);
  }

  const formDisabled =
    pool.status?.value !== PoolStatus.Draft ||
    deleteFetching ||
    swapFetching ||
    pageLoading;
  const alreadyHasAScreeningQuestionsStep = indexOfScreeningQuestionStep >= 0;

  return (
    <>
      <Heading
        level="h3"
        id={PAGE_SECTION_ID.ORGANIZE_ASSESSMENT_APPROACH}
        className="mt-0"
      >
        {intl.formatMessage(sectionTitle)}
      </Heading>
      <p className="my-6">
        {intl.formatMessage({
          defaultMessage:
            "Use this section to define which assessments will be used as part of your assessment process. Make sure every essential skill is assessed at least once to complete your assessment plan.",
          id: "xtNiNu",
          description:
            "Introduction to the organize section in the assessment plan builder, paragraph 1",
        })}
      </p>
      <p className="my-6">
        {intl.formatMessage({
          defaultMessage:
            "You can also change the order in which you plan to perform these evaluations. The only exceptions are the “Application screening” and the “Screening questions (at the time of application)” assessments which will always be the first and second steps in any assessment process.",
          id: "qX9s0l",
          description:
            "Introduction to the organize section in the assessment plan builder, paragraph 2",
        })}
      </p>
      <Accordion.Root type="multiple" size="sm">
        <Accordion.Item value="one">
          <Accordion.Trigger as="h4">
            {intl.formatMessage({
              defaultMessage: "How many assessments should I include?",
              id: "WhQFXx",
              description:
                "first question in the organize section in the assessment plan builder",
            })}
          </Accordion.Trigger>
          <Accordion.Content>
            <p className="mb-3">
              {intl.formatMessage({
                defaultMessage:
                  "Every skill you have identified on your poster needs to be assessed through at least one method. In cases where you are relying on claims made by a candidate (e.g. the initial application) you need to select an additional assessment method to test or validate the applicant's claim to have a skill. In most cases this will mean that you have two to three additional assessment methods beyond the initial application.",
                id: "Y+GgIV",
                description:
                  "First paragraph of first answer of the Frequently Asked Questions for logging in",
              })}
            </p>
            <p>
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
          <Accordion.Trigger as="h4">
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
      <div className="my-6">
        <CardRepeater.Root<
          Pick<AssessmentStep, "id" | "type" | "title" | "poolSkills">
        >
          items={steps}
          disabled={formDisabled}
          max={ASSESSMENT_STEPS_MAX_STEPS}
          moveDisabledIndexes={moveDisabledIndexes}
          editDisabledIndexes={disabledIndexes}
          removeDisabledIndexes={disabledIndexes}
          onUpdate={setSteps}
          add={
            <AssessmentDetailsDialog
              trigger={
                <CardRepeater.Add>
                  {intl.formatMessage({
                    defaultMessage: "Add a new assessment",
                    id: "VWLWLY",
                    description:
                      "Button text to add a new assessment to the assessment plan",
                  })}
                </CardRepeater.Add>
              }
              onError={resetSteps}
              poolSkillsQuery={unpackMaybes(pool.poolSkills)}
              disallowStepTypes={
                alreadyHasAScreeningQuestionsStep
                  ? [AssessmentStepType.ScreeningQuestionsAtApplication]
                  : []
              }
              initialValues={{
                id: null,
                poolId: pool.id,
              }}
            />
          }
        >
          {steps.map((assessmentStep, index) => (
            <AssessmentStepCard
              key={assessmentStep.id}
              index={index}
              onMove={move}
              onRemove={remove}
              assessmentStep={assessmentStep}
              poolQuery={pool}
            />
          ))}
        </CardRepeater.Root>
      </div>
      <div className="flex flex-col gap-6">
        {steps.length >= ASSESSMENT_STEPS_MANY_STEPS ? (
          <Well color="warning">
            <p className="font-bold">
              {steps.length === ASSESSMENT_STEPS_MAX_STEPS
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
          </Well>
        ) : null}
        {steps.length <= ASSESSMENT_STEPS_FEW_STEPS ? (
          <Well color="warning">
            <p className="font-bold">
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
          </Well>
        ) : null}
      </div>
    </>
  );
};

export default OrganizeSection;
