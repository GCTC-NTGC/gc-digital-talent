import React from "react";
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

import { AssessmentStep, AssessmentStepType, Pool } from "~/api/generated";
import processMessages from "~/messages/processMessages";

import { assessmentStepDisplayName } from "../utils";
import AssessmentDetailsDialog from "./AssessmentDetailsDialog";

type AssessmentStepCardProps = {
  index: number;
  assessmentStep: AssessmentStep;
  pool: Pool;
  onRemove: (index: number) => void;
  onMove: (fromIndex: number, toIndex: number) => void;
};

const AssessmentStepCard = ({
  index,
  assessmentStep,
  pool,
  onRemove,
  onMove,
}: AssessmentStepCardProps) => {
  const intl = useIntl();
  const { move, remove } = useCardRepeaterContext();
  const skillNames = unpackMaybes(assessmentStep.poolSkills).map((poolSkill) =>
    getLocalizedName(poolSkill?.skill?.name, intl),
  );
  skillNames.sort();
  const screeningQuestions = sortBy(
    unpackMaybes(pool.screeningQuestions),
    (question) => question.sortOrder,
  );

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
      onRemove={handleRemove}
      edit={
        <AssessmentDetailsDialog
          allPoolSkills={pool.poolSkills?.filter(notEmpty) ?? []}
          initialValues={{
            id: assessmentStep.id,
            poolId: pool.id,
            typeOfAssessment: assessmentStep.type,
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
              aria-label={intl.formatMessage(formMessages.repeaterEdit, {
                index,
              })}
            />
          }
        />
      }
    >
      <Heading level="h4" size="h6" data-h2-margin-top="base(0)">
        {assessmentStepDisplayName(assessmentStep, intl)}
      </Heading>

      {skillNames.length ||
      assessmentStep.type ===
        AssessmentStepType.ScreeningQuestionsAtApplication ? (
        <ul
          data-h2-color="base(black.light)"
          data-h2-font-size="base(caption)"
          data-h2-padding-left="base(0)"
          data-h2-margin-top="base(x.5)"
        >
          {skillNames.map((skillName, skillIndex) => (
            <React.Fragment key={skillName}>
              {skillIndex !== 0 ? (
                <span data-h2-margin="base(0 x.5)" aria-hidden>
                  •
                </span>
              ) : null}
              <li data-h2-padding-left="base(0)" data-h2-display="base(inline)">
                {skillName}
              </li>
            </React.Fragment>
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

      {assessmentStep.type ===
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
