import React from "react";
import { UseFieldArrayMove, UseFieldArrayRemove } from "react-hook-form";
import { useIntl } from "react-intl";

import { Repeater } from "@gc-digital-talent/forms";
import { AssessmentStep, Pool } from "@gc-digital-talent/graphql";
import { notEmpty } from "@gc-digital-talent/helpers";
import { getLocalizedName } from "@gc-digital-talent/i18n";

import { assessmentStepDisplayName } from "../utils";
import AssessmentDetailsDialog from "./AssessmentDetailsDialog";

type AssessmentStepFieldsetProps = {
  index: number;
  assessmentStep: AssessmentStep;
  total: number;
  disabled: boolean;
  pool: Pool;
  onRemove: UseFieldArrayRemove;
  onMove: UseFieldArrayMove;
};

const AssessmentStepFieldset = ({
  index,
  assessmentStep,
  total,
  disabled,
  pool,
  onRemove,
  onMove,
}: AssessmentStepFieldsetProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const skillNames =
    assessmentStep.poolSkills
      ?.filter(notEmpty)
      .map((poolSkill) => getLocalizedName(poolSkill?.skill?.name, intl)) ?? [];
  skillNames.sort();

  return (
    <Repeater.Fieldset
      name="assessmentStepFieldArray"
      index={index}
      total={total}
      onMove={onMove}
      onRemove={onRemove}
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
      onEdit={() => setIsOpen(true)}
    >
      <input type="hidden" name={`assessmentSteps.${index}.id`} />

      <p>{assessmentStepDisplayName(assessmentStep, intl)}</p>

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
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        // no good way to associate edit button in repeater fieldset with dialog
      />
    </Repeater.Fieldset>
  );
};

export default AssessmentStepFieldset;
