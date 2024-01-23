import React from "react";
import { useIntl } from "react-intl";
import PencilSquareIcon from "@heroicons/react/24/solid/PencilSquareIcon";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";

import { Repeater } from "@gc-digital-talent/forms";
import { notEmpty } from "@gc-digital-talent/helpers";
import { formMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { Accordion, Heading, Well } from "@gc-digital-talent/ui";
import { RepeaterFieldsetProps } from "@gc-digital-talent/forms/src/components/Repeater/Repeater";
import ActionButton from "@gc-digital-talent/forms/src/components/Repeater/ActionButton";

import { AssessmentStep, AssessmentStepType, Pool } from "~/api/generated";
import processMessages from "~/messages/processMessages";

import { assessmentStepDisplayName } from "../utils";
import AssessmentDetailsDialog from "./AssessmentDetailsDialog";
import DeleteDialog from "./DeleteDialog";

type AssessmentStepFieldsetProps = {
  index: number;
  assessmentStep: AssessmentStep;
  total: number;
  fieldsetDisabled: boolean;
  pool: Pool;
  onRemove: () => void;
  onMove: (fromIndex: number, toIndex: number) => void;
  moveDisabledIndexes: RepeaterFieldsetProps["moveDisabledIndexes"];
};

const AssessmentStepFieldset = ({
  index,
  assessmentStep,
  total,
  fieldsetDisabled,
  pool,
  onRemove,
  onMove,
  moveDisabledIndexes,
}: AssessmentStepFieldsetProps) => {
  const intl = useIntl();
  const skillNames =
    assessmentStep.poolSkills
      ?.filter(notEmpty)
      .map((poolSkill) => getLocalizedName(poolSkill?.skill?.name, intl)) ?? [];
  skillNames.sort();
  const generalQuestions = pool.generalQuestions?.filter(notEmpty) ?? [];
  generalQuestions.sort((a, b) =>
    (a.sortOrder ?? Number.MAX_SAFE_INTEGER) >
    (b.sortOrder ?? Number.MAX_SAFE_INTEGER)
      ? 1
      : -1,
  );

  const editDisabled =
    assessmentStep.type === AssessmentStepType.ApplicationScreening;
  const removeDisabled =
    assessmentStep.type === AssessmentStepType.ApplicationScreening;

  return (
    <Repeater.Fieldset
      name="assessmentStepFieldArray"
      index={index}
      total={total}
      onMove={onMove} // immediately fire event
      disabled={fieldsetDisabled}
      legend={intl.formatMessage(
        {
          defaultMessage: "Assessment plan step {index}",
          id: "kZWII8",
          description: "Legend for assessment plan step fieldset",
        },
        {
          index: index + 1,
        },
      )}
      hideLegend
      editDisabled={editDisabled}
      removeDisabled={removeDisabled}
      moveDisabledIndexes={moveDisabledIndexes}
      customEditButton={
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
            generalQuestions: pool.generalQuestions?.filter(notEmpty) ?? [],
          }}
          trigger={
            <ActionButton
              aria-label={intl.formatMessage(formMessages.repeaterEdit, {
                index,
              })}
            >
              <PencilSquareIcon data-h2-width="base(x.75)" />
            </ActionButton>
          }
        />
      }
      customRemoveButton={
        <DeleteDialog
          onDelete={onRemove}
          trigger={
            <ActionButton
              aria-label={intl.formatMessage(formMessages.repeaterRemove, {
                index,
              })}
            >
              <TrashIcon data-h2-width="base(x.75)" />
            </ActionButton>
          }
        />
      }
    >
      <input type="hidden" name={`assessmentSteps.${index}.id`} />

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
                {generalQuestions.map((generalQuestion) => (
                  <li key={generalQuestion.id} data-h2-margin-top="base(x.5)">
                    {generalQuestion.question?.en}
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
                {generalQuestions.map((generalQuestion) => (
                  <li key={generalQuestion.id} data-h2-margin-top="base(x.5)">
                    {generalQuestion.question?.fr}
                  </li>
                ))}
              </ol>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      ) : null}
    </Repeater.Fieldset>
  );
};

export default AssessmentStepFieldset;
