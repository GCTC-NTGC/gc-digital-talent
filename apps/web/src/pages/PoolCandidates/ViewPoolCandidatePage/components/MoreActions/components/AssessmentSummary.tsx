import { JSX } from "react";
import { useIntl } from "react-intl";
import CheckIcon from "@heroicons/react/24/solid/CheckCircleIcon";
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";
import PauseIcon from "@heroicons/react/24/solid/PauseCircleIcon";
import { tv } from "tailwind-variants";

import {
  AssessmentDecision,
  AssessmentResultType,
  Skill,
  FinalDecisionDialogFragment as FinalDecisionDialogFragmentType,
} from "@gc-digital-talent/graphql";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import processMessages from "~/messages/processMessages";

const tableIcon = tv({
  base: "mr-3 flex size-6 py-1.5 align-bottom",
  variants: {
    color: {
      success: "text-success",
      error: "text-error",
      warning: "text-warning",
    },
  },
});

interface AssessmentSummaryProps {
  essentialSkills: Skill[];
  nonessentialSkills: Skill[];
  assessmentResults: FinalDecisionDialogFragmentType["assessmentResults"];
}

interface SkillAssessmentCalculated {
  successful: number;
  unsuccessful: number;
  hold: number;
}

const TableHeader = ({ tableTitle }: { tableTitle: string }): JSX.Element => {
  const intl = useIntl();

  return (
    <tr className="mb-3 border-b-3 border-b-black/20 dark:border-b-white/20">
      <th scope="col" className="flex py-1.5 pr-6">
        {tableTitle}
      </th>
      <th scope="col">
        <CheckIcon
          className={tableIcon({ color: "success" })}
          aria-hidden="false"
          aria-label={intl.formatMessage({
            defaultMessage: "Demonstrated",
            id: "5wKh/o",
            description:
              "Option for assessment decision when candidate has successful assessment.",
          })}
        />
      </th>
      <th scope="col">
        <XCircleIcon
          className={tableIcon({ color: "error" })}
          aria-hidden="false"
          aria-label={intl.formatMessage({
            defaultMessage: "Not demonstrated",
            id: "fcSR2I",
            description:
              "Option for assessment decision when candidate has unsuccessful assessment and been removed from the process.",
          })}
        />
      </th>
      <th scope="col">
        <PauseIcon
          className={tableIcon({ color: "warning" })}
          aria-hidden="false"
          aria-label={intl.formatMessage({
            defaultMessage: "Not demonstrated (Hold for further assessment)",
            id: "MMtY88",
            description:
              "Option for assessment decision when candidate has unsuccessful assessment but on hold.",
          })}
        />
      </th>
    </tr>
  );
};

interface TableRow {
  name: string;
  results: SkillAssessmentCalculated;
}

const TableBody = ({ data }: { data: TableRow[] }): JSX.Element => {
  return (
    <tbody>
      {data.map((row) => (
        <tr key={row.name}>
          <td className="py-1.5 pl-6">{row.name}</td>
          <td className="p-1.5 pr-0">{row.results.successful}</td>
          <td className="p-1.5 pr-0">{row.results.unsuccessful}</td>
          <td className="p-1.5 pr-0">{row.results.hold}</td>
        </tr>
      ))}
    </tbody>
  );
};

// given a skill and array of results, return the score for that skill
const skillAssessmentResultCalculator = (
  skill: Skill,
  assessmentResults: FinalDecisionDialogFragmentType["assessmentResults"],
): SkillAssessmentCalculated => {
  const unpackedAssessmentResults = unpackMaybes(assessmentResults);
  const applicableAssessmentResults = unpackedAssessmentResults.filter(
    (result) => result.poolSkill?.skill?.id === skill.id,
  );
  const successful = applicableAssessmentResults.filter(
    (result) =>
      result.assessmentDecision?.value === AssessmentDecision.Successful,
  ).length;
  const unsuccessful = applicableAssessmentResults.filter(
    (result) =>
      result.assessmentDecision?.value === AssessmentDecision.Unsuccessful,
  ).length;
  const hold = applicableAssessmentResults.filter(
    (result) => result.assessmentDecision?.value === AssessmentDecision.Hold,
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
  const assessmentResultsUnpacked = unpackMaybes(assessmentResults);

  // determine if education requirement met, should be an array of one after filtering
  let educationAssessmentResultDecision = AssessmentDecision.Hold;
  const educationAssessmentResult = assessmentResultsUnpacked.filter(
    (result) => result.assessmentResultType === AssessmentResultType.Education,
  );
  if (
    educationAssessmentResult[0] &&
    educationAssessmentResult[0].assessmentDecision?.value ===
      AssessmentDecision.Successful
  ) {
    educationAssessmentResultDecision = AssessmentDecision.Successful;
  } else if (
    educationAssessmentResult[0] &&
    educationAssessmentResult[0].assessmentDecision?.value ===
      AssessmentDecision.Unsuccessful
  ) {
    educationAssessmentResultDecision = AssessmentDecision.Unsuccessful;
  }
  const educationAssessmentRowObject: TableRow = {
    name: intl.formatMessage(processMessages.educationRequirement),
    results: {
      successful:
        educationAssessmentResultDecision === AssessmentDecision.Successful
          ? 1
          : 0,
      unsuccessful:
        educationAssessmentResultDecision === AssessmentDecision.Unsuccessful
          ? 1
          : 0,
      hold:
        educationAssessmentResultDecision === AssessmentDecision.Hold ? 1 : 0,
    },
  };

  const essentialSkillsTableData: TableRow[] = essentialSkills.map((skill) => {
    const essentialSkillCalculated = skillAssessmentResultCalculator(
      skill,
      assessmentResultsUnpacked,
    );
    return {
      name: getLocalizedName(skill.name, intl),
      results: essentialSkillCalculated,
    };
  });

  const educationEssentialSkillsTableData = [
    educationAssessmentRowObject,
    ...essentialSkillsTableData,
  ];

  const nonessentialSkillsTableData: TableRow[] = nonessentialSkills.map(
    (skill) => {
      const essentialSkillCalculated = skillAssessmentResultCalculator(
        skill,
        assessmentResultsUnpacked,
      );
      return {
        name: getLocalizedName(skill.name, intl),
        results: essentialSkillCalculated,
      };
    },
  );

  return (
    <>
      <table className="bg-gray-100 dark:bg-gray-700">
        <caption className="sr-only">
          {intl.formatMessage({
            defaultMessage: "Essential criteria",
            description: "Essential criteria heading",
            id: "Kp3Bqu",
          })}
        </caption>
        <thead>
          <TableHeader
            tableTitle={intl.formatMessage({
              defaultMessage: "Essential criteria",
              description: "Essential criteria heading",
              id: "Kp3Bqu",
            })}
          />
        </thead>
        <TableBody data={educationEssentialSkillsTableData} />
      </table>
      {nonessentialSkillsTableData.length > 0 && (
        <table className="mt-6 bg-gray-100 dark:bg-gray-700">
          <caption className="sr-only">
            {intl.formatMessage({
              defaultMessage: "Asset criteria",
              description: "Asset criteria heading",
              id: "Ldzk4k",
            })}
          </caption>
          <thead>
            <TableHeader
              tableTitle={intl.formatMessage({
                defaultMessage: "Asset criteria",
                description: "Asset criteria heading",
                id: "Ldzk4k",
              })}
            />
          </thead>
          <TableBody data={nonessentialSkillsTableData} />
        </table>
      )}
    </>
  );
};

export default AssessmentSummary;
