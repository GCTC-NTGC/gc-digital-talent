import { Fragment } from "react";
import { useIntl } from "react-intl";
import sortBy from "lodash/sortBy";

import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import { formMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import {
  Accordion,
  CardRepeater,
  Heading,
  Well,
  useCardRepeaterContext,
} from "@gc-digital-talent/ui";
import {
  AssessmentStep,
  AssessmentStepType,
  FragmentType,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";

import processMessages from "~/messages/processMessages";

import { assessmentStepDisplayName } from "../utils";
import AssessmentDetailsDialog from "./AssessmentDetailsDialog";

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

interface AssessmentStepCardProps {
  index: number;
  assessmentStep: Pick<AssessmentStep, "id" | "type" | "title" | "poolSkills">;
  poolQuery: FragmentType<typeof AssessmentStepCardPool_Fragment>;
  onRemove: (index: number) => void;
  onMove: (fromIndex: number, toIndex: number) => void;
}

const AssessmentStepCard = ({
  index,
  assessmentStep,
  poolQuery,
  onRemove,
  onMove,
}: AssessmentStepCardProps) => {
  const intl = useIntl();
  const { move, remove } = useCardRepeaterContext();
  const pool = getFragment(AssessmentStepCardPool_Fragment, poolQuery);
  const skillNames = unpackMaybes(assessmentStep.poolSkills).map((poolSkill) =>
    getLocalizedName(poolSkill?.skill?.name, intl),
  );
  skillNames.sort();
  const screeningQuestions = sortBy(
    unpackMaybes(pool.screeningQuestions),
    (question) => question.sortOrder,
  );
  const isApplicationScreening =
    assessmentStep.type?.value === AssessmentStepType.ApplicationScreening;

  const handleMove = (from: number, to: number) => {
    move(from, to);
    onMove(from, to);
  };

  const handleRemove = (removeIndex: number) => {
    remove(removeIndex);
    onRemove(removeIndex);
  };

  return (
    <CardRepeater.Card
      index={index}
      onMove={handleMove} // immediately fire event
      edit={
        <AssessmentDetailsDialog
          poolSkillsQuery={pool.poolSkills?.filter(notEmpty) ?? []}
          initialValues={{
            id: assessmentStep.id,
            poolId: pool.id,
            typeOfAssessment: assessmentStep.type?.value,
            assessmentTitleEn: assessmentStep?.title?.en,
            assessmentTitleFr: assessmentStep?.title?.fr,
            assessedSkills:
              assessmentStep?.poolSkills
                ?.map((poolSkill) => poolSkill?.id)
                ?.filter(notEmpty) ?? [],
            screeningQuestions: pool.screeningQuestions?.filter(notEmpty) ?? [],
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
        <CardRepeater.Remove
          onClick={() => handleRemove(index)}
          label={intl.formatMessage(formMessages.repeaterRemove, {
            index: index + 1,
          })}
        />
      }
    >
      <Heading level="h4" size="h6" data-h2-margin-top="base(0)">
        {assessmentStepDisplayName(
          { type: assessmentStep.type, title: assessmentStep.title },
          intl,
        )}
      </Heading>

      {skillNames.length || isApplicationScreening ? (
        <ul
          data-h2-color="base(black.light)"
          data-h2-font-size="base(caption)"
          data-h2-padding-left="base(0)"
          data-h2-margin-top="base(x.5)"
        >
          {isApplicationScreening && (
            <li data-h2-padding-left="base(0)" data-h2-display="base(inline)">
              {intl.formatMessage(processMessages.educationRequirement)}
            </li>
          )}
          {skillNames.map((skillName, skillIndex) => (
            <Fragment key={skillName}>
              {skillIndex !== 0 || isApplicationScreening ? (
                // eslint-disable-next-line formatjs/no-literal-string-in-jsx
                <span data-h2-margin="base(0 x.5)" aria-hidden>
                  &bull;
                </span>
              ) : null}
              <li data-h2-padding-left="base(0)" data-h2-display="base(inline)">
                {skillName}
              </li>
            </Fragment>
          ))}
        </ul>
      ) : (
        <Well color="error">
          <p>
            {intl.formatMessage({
              defaultMessage: "This assessment is missing skills",
              id: "NROIaL",
              description:
                "Warning message that an assessment step is missing skills",
            })}
          </p>
        </Well>
      )}

      {assessmentStep.type?.value ===
      AssessmentStepType.ScreeningQuestionsAtApplication ? (
        <Accordion.Root
          type="multiple"
          mode="simple"
          data-h2-margin-top="base(x.5)"
          size="sm"
        >
          <Accordion.Item value="one">
            <Accordion.Trigger as="h5">
              {intl.formatMessage(processMessages.screeningQuestions)}
            </Accordion.Trigger>
            <Accordion.Content>
              <Heading
                level="h6"
                data-h2-font-size="base(copy)"
                data-h2-margin-top="base(x.5)"
              >
                {intl.formatMessage({
                  defaultMessage: "Questions in English",
                  id: "9cLJwl",
                  description:
                    "Description for a list of questions in the English language",
                })}
              </Heading>
              <ol
                data-h2-padding-left="base(0)"
                data-h2-list-style-position="base(inside)"
              >
                {screeningQuestions.map((screeningQuestion) => (
                  <li key={screeningQuestion.id} data-h2-margin-top="base(x.5)">
                    {screeningQuestion.question?.en}
                  </li>
                ))}
              </ol>
              <Heading level="h6" data-h2-font-size="base(copy)">
                {intl.formatMessage({
                  defaultMessage: "Questions in French",
                  id: "OyMDr3",
                  description:
                    "Description for a list of questions in the French language",
                })}
              </Heading>
              <ol
                data-h2-padding-left="base(0)"
                data-h2-list-style-position="base(inside)"
              >
                {screeningQuestions.map((screeningQuestion) => (
                  <li key={screeningQuestion.id} data-h2-margin-top="base(x.5)">
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
