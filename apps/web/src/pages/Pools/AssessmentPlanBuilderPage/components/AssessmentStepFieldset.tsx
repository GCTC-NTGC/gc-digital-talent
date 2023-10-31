import React from "react";
import { useIntl } from "react-intl";

import { Repeater } from "@gc-digital-talent/forms";
import {
  AssessmentStep,
  AssessmentStepType,
  Pool,
} from "@gc-digital-talent/graphql";
import { notEmpty } from "@gc-digital-talent/helpers";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import { Accordion, Heading, Well } from "@gc-digital-talent/ui";

import { assessmentStepDisplayName } from "../utils";
import AssessmentDetailsDialog from "./AssessmentDetailsDialog";
import DeleteDialog from "./DeleteDialog";

type AssessmentStepFieldsetProps = {
  index: number;
  assessmentStep: AssessmentStep;
  total: number;
  formDisabled: boolean;
  pool: Pool;
  onRemove: () => void;
  onMove: (fromIndex: number, toIndex: number) => void;
};

const AssessmentStepFieldset = ({
  index,
  assessmentStep,
  total,
  formDisabled,
  pool,
  onRemove,
  onMove,
}: AssessmentStepFieldsetProps) => {
  const intl = useIntl();
  const [isEditOpen, setIsEditOpen] = React.useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState<boolean>(false);
  const skillNames =
    assessmentStep.poolSkills
      ?.filter(notEmpty)
      .map((poolSkill) => getLocalizedName(poolSkill?.skill?.name, intl)) ?? [];
  skillNames.sort();
  const screeningQuestions = pool.screeningQuestions?.filter(notEmpty) ?? [];
  screeningQuestions.sort((a, b) =>
    (a.sortOrder ?? Number.MAX_SAFE_INTEGER) >
    (b.sortOrder ?? Number.MAX_SAFE_INTEGER)
      ? 1
      : -1,
  );

  const disabled =
    formDisabled ||
    assessmentStep.type === AssessmentStepType.ApplicationScreening;

  return (
    <Repeater.Fieldset
      name="assessmentStepFieldArray"
      index={index}
      total={total}
      onMove={onMove} // immediately fire event
      onRemove={() => setIsDeleteOpen(true)} // confirm through dialog before firing event
      disabled={disabled}
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
      onEdit={() => setIsEditOpen(true)}
    >
      <input type="hidden" name={`assessmentSteps.${index}.id`} />

      <Heading level="h4" size="h6" data-h2-margin-top="base(0)">
        {assessmentStepDisplayName(assessmentStep, intl)}
      </Heading>

      {skillNames.length ? (
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
        >
          <Accordion.Item value="one">
            <Accordion.Header headingAs="h5" data-h2-font-size="base(h6)">
              <Accordion.Trigger data-h2-font-weight="base(700)">
                {intl.formatMessage({
                  defaultMessage: "Screening questions",
                  id: "V62J5w",
                  description:
                    "title of 'screening questions' section of the assessment builder",
                })}
              </Accordion.Trigger>
            </Accordion.Header>
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

      <AssessmentDetailsDialog
        allPoolSkills={pool.poolSkills?.filter(notEmpty) ?? []}
        initialValues={{
          id: assessmentStep.id,
          poolId: pool.id,
          sortOrder: assessmentStep.sortOrder,
          typeOfAssessment: assessmentStep.type,
          assessmentTitleEn: assessmentStep?.title?.en,
          assessmentTitleFr: assessmentStep?.title?.fr,
          assessedSkills:
            assessmentStep?.poolSkills
              ?.map((poolSkill) => poolSkill?.id)
              ?.filter(notEmpty) ?? [],
          screeningQuestions: pool.screeningQuestions?.filter(notEmpty) ?? [],
        }}
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        // no good way to associate edit button in repeater fieldset with dialog
      />

      <DeleteDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        onDelete={onRemove}
      />
    </Repeater.Fieldset>
  );
};

export default AssessmentStepFieldset;
