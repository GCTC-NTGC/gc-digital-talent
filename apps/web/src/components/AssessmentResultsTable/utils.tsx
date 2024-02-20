import React from "react";
import { createColumnHelper } from "@tanstack/react-table";
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";
import PauseCircleIcon from "@heroicons/react/24/solid/PauseCircleIcon";
import ExclamationCircleIcon from "@heroicons/react/24/solid/ExclamationCircleIcon";
import CheckCircleIcon from "@heroicons/react/24/solid/CheckCircleIcon";
import { IntlShape } from "react-intl";
import QuestionMarkCircleIcon from "@heroicons/react/24/solid/QuestionMarkCircleIcon";

import {
  AssessmentDecision,
  AssessmentResult,
  AssessmentResultType,
  AssessmentStep,
  AssessmentStepType,
  PoolSkillType,
} from "@gc-digital-talent/graphql";
import { getAssessmentDecision } from "@gc-digital-talent/i18n/src/messages/localizedConstants";
import { commonMessages } from "@gc-digital-talent/i18n";

import poolCandidateMessages from "~/messages/poolCandidateMessages";

import {
  AssessmentStepResult,
  AssessmentStepResultColumn,
  AssessmentStepResultColumnProps,
  ColumnStatus,
  StatusColor,
} from "./types";
import cells from "../Table/cells";
import Dialog from "../ScreeningDecisions/ScreeningDecisionDialog";

const iconColorMap: Record<StatusColor, Record<string, string>> = {
  error: {
    "data-h2-color": "base(error)",
  },
  hold: {
    "data-h2-color": "base(secondary)",
  },
  toAssess: {
    "data-h2-color": "base(quaternary)",
  },
  success: {
    "data-h2-color": "base(success)",
  },
  gray: {
    "data-h2-color": "base(gray)",
  },
};

export const columnHeader = (
  header: string,
  status: ColumnStatus,
  type: AssessmentStepType | null,
  intl: IntlShape,
) => {
  const Icon = status.icon;
  let ariaLabel;
  switch (status.color) {
    case "error":
      ariaLabel =
        type === AssessmentStepType.ApplicationScreening ||
        type === AssessmentStepType.ScreeningQuestionsAtApplication
          ? intl.formatMessage(poolCandidateMessages.screenedOut)
          : intl.formatMessage(poolCandidateMessages.unsuccessful);
      break;
    case "hold":
      ariaLabel = intl.formatMessage(poolCandidateMessages.holdForAssessment);
      break;
    case "toAssess":
      ariaLabel = intl.formatMessage(poolCandidateMessages.toAssess);
      break;
    case "success":
      ariaLabel =
        type === AssessmentStepType.ApplicationScreening ||
        type === AssessmentStepType.ScreeningQuestionsAtApplication
          ? intl.formatMessage(poolCandidateMessages.screenedIn)
          : intl.formatMessage(poolCandidateMessages.successful);
      break;
    default:
      ariaLabel = intl.formatMessage(commonMessages.notApplicable);
      break;
  }

  return (
    <span data-h2-display="base(inline)">
      <span
        data-h2-display="base(flex)"
        data-h2-align-content="base(center)"
        data-h2-gap="base(x.25)"
      >
        {Icon && (
          <Icon
            role="img"
            title={ariaLabel}
            aria-hidden="false"
            {...iconColorMap[status.color]}
            data-h2-display="p-tablet(inline-block)"
            data-h2-vertical-align="base(middle)"
            data-h2-height="base(auto)"
            data-h2-flex-shrink="base(0)"
            data-h2-width="base(x.85)"
          />
        )}
        {header}
      </span>
    </span>
  );
};

export const columnStatus = (
  assessmentStep: AssessmentStep,
  assessmentResults?: AssessmentResult[],
): ColumnStatus => {
  const educationResult = assessmentResults?.find(
    (assessmentResult) =>
      assessmentResult.assessmentResultType ===
        AssessmentResultType.Education &&
      assessmentStep.type === AssessmentStepType.ApplicationScreening,
  );

  // Grab assessment results of step with essential pool skills, and add education result
  const essentialAssessmentResults =
    assessmentResults?.filter(
      (ar) =>
        ar?.assessmentStep?.id === assessmentStep.id &&
        ar?.poolSkill?.type === PoolSkillType.Essential,
    ) || [];

  const allAssessmentResults = educationResult
    ? [educationResult, ...essentialAssessmentResults]
    : essentialAssessmentResults;

  // If at least one result has an assessmentDecision === UNSUCCESSFUL, then set to error status.
  const unsuccessfulResults = allAssessmentResults.filter(
    (assessmentResult) =>
      assessmentResult?.assessmentDecision === AssessmentDecision.Unsuccessful,
  );
  if (unsuccessfulResults.length > 0)
    return {
      icon: XCircleIcon,
      color: "error",
    };

  // If at least one result has the assessmentDecision === HOLD, then set to hold status.
  const holdResults = allAssessmentResults.filter(
    (assessmentResult) =>
      assessmentResult?.assessmentDecision === AssessmentDecision.Hold,
  );
  if (holdResults.length > 0)
    return {
      icon: PauseCircleIcon,
      color: "hold",
    };

  // If at least one result hasn't been assessed, then set to toAssess status
  const hasBeenAssessed = allAssessmentResults.find(
    (assessmentResult) =>
      assessmentStep.poolSkills?.find(
        (poolSkill) => poolSkill?.id === assessmentResult?.poolSkill?.id,
      ),
  );

  if (!hasBeenAssessed) {
    return {
      icon: ExclamationCircleIcon,
      color: "toAssess",
    };
  }

  // If all the results have the assessmentDecision === SUCCESSFUL, then set to success icon.
  const allResults = allAssessmentResults.filter(
    (ar) => ar?.assessmentDecision === AssessmentDecision.Successful,
  );
  if (allResults.length === allAssessmentResults.length)
    return {
      icon: CheckCircleIcon,
      color: "success",
    };

  return {
    icon: QuestionMarkCircleIcon,
    color: "gray",
  };
};

const columnHelper = createColumnHelper<AssessmentStepResult>();

export const buildColumn = ({
  id,
  poolCandidate,
  assessmentStep,
  intl,
  header,
}: AssessmentStepResultColumnProps): AssessmentStepResultColumn => {
  return columnHelper.accessor(
    ({ assessmentResults }) => {
      const assessmentResult = assessmentResults.find(
        (ar) => ar.assessmentStep?.id === assessmentStep.id,
      );
      return intl.formatMessage(
        assessmentResult?.assessmentDecision
          ? getAssessmentDecision(assessmentResult?.assessmentDecision)
          : commonMessages.notFound,
      );
    },
    {
      id,
      header: () => header,
      cell: ({
        row: {
          original: { poolSkill, assessmentResults },
        },
      }) => {
        // Check if the pool skill (row) is associated with the assessment step (column)
        const isEducationRequirement =
          assessmentStep.type === AssessmentStepType.ApplicationScreening &&
          (poolSkill === undefined || poolSkill === null);

        // Check if an assessmentResult already exists on the assessment step, if show update dialog
        // Additionally, checks if it's the  education requirement cell
        const assessmentResult = assessmentResults.find(
          (ar) => ar.assessmentStep?.id === assessmentStep.id,
        );
        if (assessmentResult || isEducationRequirement) {
          return cells.jsx(
            <Dialog
              assessmentStep={assessmentStep}
              assessmentResult={assessmentResult}
              poolCandidate={poolCandidate}
              educationRequirement={isEducationRequirement}
            />,
          );
        }

        // Does assessment step have the pool skill (or education requirement), if not return null
        const hasPoolSkill = assessmentStep.poolSkills?.find(
          (ps) => ps?.id === poolSkill?.id,
        );
        if (hasPoolSkill) {
          return cells.jsx(
            <Dialog
              assessmentStep={assessmentStep}
              poolCandidate={poolCandidate}
              poolSkillToAssess={poolSkill}
            />,
          );
        }
        return null;
      },
      meta: {
        hideMobileHeader: true,
      },
    },
  ) as AssessmentStepResultColumn;
};
