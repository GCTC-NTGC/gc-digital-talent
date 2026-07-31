import { Fragment } from "react";
import { useIntl } from "react-intl";

import { unpackMaybes } from "@gc-digital-talent/helpers";
import {
  appendLanguageName,
  commonMessages,
  formMessages,
} from "@gc-digital-talent/i18n";
import {
  Accordion,
  CardRepeater,
  Heading,
  UNICODE_CHAR,
  Notice,
  useCardRepeaterContext,
} from "@gc-digital-talent/ui";
import type { FragmentType } from "@gc-digital-talent/graphql";
import {
  AssessmentStepType,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";

import processMessages from "~/messages/processMessages";

import { assessmentStepDisplayName } from "../utils";
import AssessmentDetailsDialog from "./AssessmentDetailsDialog";
import ConfirmationDialog from "./ConfirmationDialog";

const AssessmentStepCardPool_Fragment = graphql(/* GraphQL */ `
  fragment AssessmentStepCardPool on Pool {
    id
    poolSkills {
      ...AssessmentDetailsDialogPoolSkill
    }
    screeningQuestions {
      id
      sortOrder
      question {
        en
        fr
      }
    }
  }
`);

const AssessmentStepCardStep_Fragment = graphql(/* GraphQL */ `
  fragment AssessmentStepCardStep on AssessmentStep {
    id
    title {
      en
      fr
      localized
    }
    type {
      value
      label {
        localized
      }
    }
    poolSkills {
      id
      skill {
        name {
          localized
        }
      }
    }
  }
`);

interface AssessmentStepCardProps {
  index: number;
  assessmentStepQuery: FragmentType<typeof AssessmentStepCardStep_Fragment>;
  poolQuery: FragmentType<typeof AssessmentStepCardPool_Fragment>;
  onRemove: (index: number) => Promise<void>;
  onMove: (fromIndex: number, toIndex: number) => void;
}

const AssessmentStepCard = ({
  index,
  assessmentStepQuery,
  poolQuery,
  onRemove,
  onMove,
}: AssessmentStepCardProps) => {
  const intl = useIntl();
  const { move, remove } = useCardRepeaterContext();
  const pool = getFragment(AssessmentStepCardPool_Fragment, poolQuery);
  const assessmentStep = getFragment(
    AssessmentStepCardStep_Fragment,
    assessmentStepQuery,
  );
  const skillNames = unpackMaybes(assessmentStep.poolSkills).map(
    (poolSkill) =>
      poolSkill?.skill?.name?.localized ??
      intl.formatMessage(commonMessages.notAvailable),
  );
  skillNames.sort();
  const screeningQuestions = unpackMaybes(pool.screeningQuestions).sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );
  const isApplicationScreening =
    assessmentStep.type?.value === AssessmentStepType.ApplicationScreening;

  const handleMove = (from: number, to: number) => {
    move(from, to);
    onMove(from, to);
  };

  const handleRemove = async (removeIndex: number) => {
    remove(removeIndex);
    await onRemove(removeIndex);
  };

  return (
    <CardRepeater.Card
      index={index}
      onMove={handleMove} // immediately fire event
      edit={
        <AssessmentDetailsDialog
          poolSkillsQuery={unpackMaybes(pool.poolSkills)}
          initialValues={{
            id: assessmentStep.id,
            poolId: pool.id,
            typeOfAssessment: assessmentStep.type?.value,
            assessmentTitleEn: assessmentStep?.title?.en,
            assessmentTitleFr: assessmentStep?.title?.fr,
            assessedSkills: unpackMaybes(assessmentStep.poolSkills).map(
              (poolSkill) => poolSkill.id,
            ),
            screeningQuestionFieldArray: screeningQuestions.map((question) => ({
              id: null,
              screeningQuestion: {
                id: question.id,
                sortOrder: question.sortOrder,
                en: question.question?.en,
                fr: question.question?.fr,
              },
            })),
          }}
          trigger={
            <CardRepeater.Edit
              label={intl.formatMessage(formMessages.repeaterEdit, {
                index: index + 1,
              })}
            />
          }
        />
      }
      remove={
        <ConfirmationDialog
          assessmentTitle={assessmentStepDisplayName(
            assessmentStep.title?.localized,
            assessmentStep.type?.label?.localized,
            intl,
          )}
          onRemove={() => handleRemove(index)}
        />
      }
    >
      <Heading level="h4" size="h6" className="mt-0">
        {assessmentStepDisplayName(
          assessmentStep.title?.localized,
          assessmentStep.type?.label?.localized,
          intl,
        )}
      </Heading>

      {skillNames.length || isApplicationScreening ? (
        <ul className="mt-3 pl-0 text-sm text-gray-600 dark:text-gray-200">
          {isApplicationScreening && (
            <li className="inline pl-0">
              {intl.formatMessage(processMessages.educationRequirement)}
            </li>
          )}
          {skillNames.map((skillName, skillIndex) => (
            <Fragment key={skillName}>
              {skillIndex !== 0 || isApplicationScreening ? (
                <span className="mx-3" aria-hidden>
                  {UNICODE_CHAR.BULLET}
                </span>
              ) : null}
              <li className="inline pl-0">{skillName}</li>
            </Fragment>
          ))}
        </ul>
      ) : (
        <Notice.Root color="error">
          <Notice.Content>
            <p>
              {intl.formatMessage({
                defaultMessage: "This assessment is missing skills",
                id: "NROIaL",
                description:
                  "Warning message that an assessment step is missing skills",
              })}
            </p>
          </Notice.Content>
        </Notice.Root>
      )}

      {assessmentStep.type?.value ===
      AssessmentStepType.ScreeningQuestionsAtApplication ? (
        <Accordion.Root
          type="multiple"
          mode="simple"
          className="mt-3"
          size="sm"
        >
          <Accordion.Item value="one">
            <Accordion.Trigger as="h5">
              {intl.formatMessage(processMessages.screeningQuestions)}
            </Accordion.Trigger>
            <Accordion.Content>
              <Heading level="h6" className="mt-3">
                {appendLanguageName({
                  label: intl.formatMessage(commonMessages.questions),
                  lang: "en",
                  intl,
                  formatted: true,
                })}
              </Heading>
              <ol className="list-inside pl-0">
                {screeningQuestions.map((screeningQuestion) => (
                  <li key={screeningQuestion.id} className="mt-3">
                    {screeningQuestion.question?.en}
                  </li>
                ))}
              </ol>
              <Heading level="h6">
                {appendLanguageName({
                  label: intl.formatMessage(commonMessages.questions),
                  lang: "fr",
                  intl,
                  formatted: true,
                })}
              </Heading>
              <ol className="list-inside pl-0">
                {screeningQuestions.map((screeningQuestion) => (
                  <li key={screeningQuestion.id} className="mt-3">
                    {screeningQuestion.question?.fr}
                  </li>
                ))}
              </ol>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      ) : null}
    </CardRepeater.Card>
  );
};

export default AssessmentStepCard;
