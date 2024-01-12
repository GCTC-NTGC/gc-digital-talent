import React from "react";
import { useIntl } from "react-intl";
import CheckIcon from "@heroicons/react/24/solid/CheckCircleIcon";
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";
import PauseIcon from "@heroicons/react/24/solid/PauseCircleIcon";

import {
  AssessmentDecision,
  AssessmentResult,
  AssessmentResultType,
  Skill,
} from "@gc-digital-talent/graphql";
import { getLocalizedName } from "@gc-digital-talent/i18n";

interface AssessmentSummaryProps {
  essentialSkills: Skill[];
  nonessentialSkills: Skill[];
  assessmentResults: AssessmentResult[];
}

type SkillAssessmentCalculated = {
  successful: number;
  unsuccessful: number;
  hold: number;
};

const skillAssessmentResultCalculator = (
  skill: Skill,
  assessmentResults: AssessmentResult[],
): SkillAssessmentCalculated => {
  const applicableAssessmentResults = assessmentResults.filter(
    (result) => result.poolSkill?.skill?.id === skill.id,
  );
  const successful = applicableAssessmentResults.filter(
    (result) => result.assessmentDecision === AssessmentDecision.Successful,
  ).length;
  const unsuccessful = applicableAssessmentResults.filter(
    (result) => result.assessmentDecision === AssessmentDecision.Unsuccessful,
  ).length;
  const hold = applicableAssessmentResults.filter(
    (result) => result.assessmentDecision === AssessmentDecision.Hold,
  ).length;
  return {
    successful,
    unsuccessful,
    hold,
  };
};

const AssessmentSummary = ({
  essentialSkills,
  nonessentialSkills,
  assessmentResults,
}: AssessmentSummaryProps) => {
  const intl = useIntl();

  // determine if education requirement met, should be an array of one after filtering
  let educationAssessmentResultDecision = AssessmentDecision.Hold;
  const educationAssessmentResult = assessmentResults.filter(
    (result) => result.assessmentResultType === AssessmentResultType.Education,
  );
  if (
    educationAssessmentResult[0] &&
    educationAssessmentResult[0].assessmentDecision ===
      AssessmentDecision.Successful
  ) {
    educationAssessmentResultDecision = AssessmentDecision.Successful;
  } else if (
    educationAssessmentResult[0] &&
    educationAssessmentResult[0].assessmentDecision ===
      AssessmentDecision.Unsuccessful
  ) {
    educationAssessmentResultDecision = AssessmentDecision.Unsuccessful;
  }

  // for each skill, given the assessment results array, compute the results and generate table data
  const generateSkillTableData = (
    skill: Skill,
    skillAssessmentCalculated: SkillAssessmentCalculated,
  ): JSX.Element => {
    return (
      <tr key={skill.id}>
        <td data-h2-padding="base(x.25 0 x.25 x1)">
          {getLocalizedName(skill.name, intl)}
        </td>
        <td data-h2-padding="base(x.25 0 x.25 x.25)">
          {skillAssessmentCalculated.successful}
        </td>
        <td data-h2-padding="base(x.25 0 x.25 x.25)">
          {skillAssessmentCalculated.unsuccessful}
        </td>
        <td data-h2-padding="base(x.25 0 x.25 x.25)">
          {skillAssessmentCalculated.hold}
        </td>
      </tr>
    );
  };

  const essentialSkillsTableData = essentialSkills.map((skill) => {
    const essentialSkillCalculated = skillAssessmentResultCalculator(
      skill,
      assessmentResults,
    );
    return generateSkillTableData(skill, essentialSkillCalculated);
  });
  const nonessentialSkillsTableData = nonessentialSkills.map((skill) => {
    const nonessentialSkillCalculated = skillAssessmentResultCalculator(
      skill,
      assessmentResults,
    );
    return generateSkillTableData(skill, nonessentialSkillCalculated);
  });

  // generate the table header for the two tables that is mostly the same
  const generateTableHeader = (tableTitle: string) => {
    return (
      <tr
        data-h2-border-bottom="base(3px solid black.20)"
        data-h2-margin-bottom="base(x.5)"
      >
        <th
          scope="col"
          data-h2-padding="base(x.25 0 x.25 x1)"
          data-h2-display="base(flex)"
        >
          {tableTitle}
        </th>
        <th scope="col">
          <CheckIcon
            data-h2-width="base(x1)"
            data-h2-display="base(flex)"
            data-h2-vertical-align="base(bottom)"
            data-h2-margin="base(0, x.5, 0, 0)"
            data-h2-padding="base(x.25 0)"
            data-h2-color="base(success)"
          />
        </th>
        <th scope="col">
          <XCircleIcon
            data-h2-width="base(x1)"
            data-h2-display="base(flex)"
            data-h2-vertical-align="base(bottom)"
            data-h2-margin="base(0, x.5, 0, 0)"
            data-h2-padding="base(x.25 0)"
            data-h2-color="base(error)"
          />
        </th>
        <th scope="col">
          <PauseIcon
            data-h2-width="base(x1)"
            data-h2-display="base(flex)"
            data-h2-vertical-align="base(bottom)"
            data-h2-margin="base(0, x.5, 0, 0)"
            data-h2-padding="base(x.25 0)"
            data-h2-color="base(warning)"
          />
        </th>
      </tr>
    );
  };

  const essentialCriteriaHeader = generateTableHeader(
    intl.formatMessage({
      defaultMessage: "Essential criteria",
      description: "Essential criteria heading",
      id: "Kp3Bqu",
    }),
  );

  const assetCriteriaHeader = generateTableHeader(
    intl.formatMessage({
      defaultMessage: "Asset criteria",
      description: "Asset criteria heading",
      id: "Ldzk4k",
    }),
  );

  return (
    <>
      <table data-h2-background="base(background)">
        <thead>{essentialCriteriaHeader}</thead>
        <tbody>
          <tr>
            <td data-h2-padding="base(x.25 0 x.25 x1)">
              <p>
                {intl.formatMessage({
                  defaultMessage: "Education requirement",
                  id: "/zx1kX",
                  description: "Education requirement section header.",
                })}
              </p>
            </td>
            <td data-h2-padding="base(x.25 0 x.25 x.25)">
              {educationAssessmentResultDecision ===
              AssessmentDecision.Successful
                ? "1"
                : "0"}
            </td>
            <td data-h2-padding="base(x.25 0 x.25 x.25)">
              {educationAssessmentResultDecision ===
              AssessmentDecision.Unsuccessful
                ? "1"
                : "0"}
            </td>
            <td data-h2-padding="base(x.25 0 x.25 x.25)">
              {educationAssessmentResultDecision === AssessmentDecision.Hold
                ? "1"
                : "0"}
            </td>
          </tr>
          {essentialSkillsTableData}
        </tbody>
      </table>
      {nonessentialSkillsTableData.length > 0 && (
        <table
          data-h2-margin-top="base(x1)"
          data-h2-background="base(background)"
        >
          <thead>{assetCriteriaHeader}</thead>
          <tbody>{nonessentialSkillsTableData}</tbody>
        </table>
      )}
    </>
  );
};

export default AssessmentSummary;
