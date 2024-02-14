import React from "react";
import { createColumnHelper } from "@tanstack/react-table";
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";
import PauseCircleIcon from "@heroicons/react/24/solid/PauseCircleIcon";
import ExclamationCircleIcon from "@heroicons/react/24/solid/ExclamationCircleIcon";
import CheckCircleIcon from "@heroicons/react/24/solid/CheckCircleIcon";
import { IntlShape } from "react-intl";

import {
  AssessmentDecision,
  AssessmentResult,
  AssessmentStep,
  AssessmentStepType,
  PoolSkillType,
} from "@gc-digital-talent/graphql";
import { getAssessmentDecision } from "@gc-digital-talent/i18n/src/messages/localizedConstants";
import { commonMessages } from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";

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
  secondary: {
    "data-h2-color": "base(secondary)",
  },
  quaternary: {
    "data-h2-color": "base(quaternary)",
  },
  success: {
    "data-h2-color": "base(success)",
  },
  gray: {
    "data-h2-color": "base(gray)",
  },
};

export const columnHeader = (header: string, status: ColumnStatus) => {
  const Icon = status.icon;

  return (
    <p
      data-h2-display="base(flex)"
      data-h2-align-content="base(center)"
      data-h2-gap="base(x.5)"
    >
      {Icon && (
        <Icon
          role="img"
          title={status.ariaLabel}
          aria-hidden="false"
          {...iconColorMap[status.color]}
          data-h2-width="base(x1)"
          data-h2-height="base(x1)"
        />
      )}
      <span>{header}</span>
    </p>
  );
};

export const columnStatus = (
  assessmentStep: AssessmentStep,
  assessmentResults: AssessmentResult[],
  intl: IntlShape,
): ColumnStatus => {
  const { type } = assessmentStep;
  // Grab all assessment results from assessment step that have an essential pool skill
  const allEssentialAssessmentResultsOfStep =
    assessmentResults?.filter(
      (ar) =>
        ar?.assessmentStep?.id === assessmentStep.id &&
        ar?.poolSkill?.type === PoolSkillType.Essential,
    ) || [];

  // If at least one result has an assessmentDecision === UNSUCCESSFUL, then set to error icon.
  const unsuccessfulResults = allEssentialAssessmentResultsOfStep.filter(
    (ar) => ar?.assessmentDecision === AssessmentDecision.Unsuccessful,
  );

  if (unsuccessfulResults.length > 0)
    return {
      icon: XCircleIcon,
      color: "error",
      ariaLabel:
        type === AssessmentStepType.ApplicationScreening ||
        type === AssessmentStepType.ScreeningQuestionsAtApplication
          ? intl.formatMessage({
              defaultMessage: "Screened Out",
              id: "0ywybu",
              description:
                "Aria Label for error icon on assessment result table",
            })
          : intl.formatMessage({
              defaultMessage: "Unsuccessful",
              id: "YWs5Uw",
              description:
                "Aria Label for error icon on assessment result table",
            }),
    };

  // If at least one result has the assessmentDecision === HOLD, then set to warning icon.
  const holdResults = allEssentialAssessmentResultsOfStep.filter(
    (ar) => ar?.assessmentDecision === AssessmentDecision.Hold,
  );
  if (holdResults.length > 0)
    return {
      icon: PauseCircleIcon,
      color: "secondary",
      ariaLabel: intl.formatMessage({
        defaultMessage: "Hold for assessment",
        id: "otE152",
        description: "Aria Label for pause icon on assessment result table",
      }),
    };

  // First get all essential pool skills from the assessment step.
  // Then, check if the assessmentStep has any pool skills that have not been assessed (no assessment result with a matching pool skill).
  const { poolSkills } = assessmentStep;
  const essentialPoolSkills = assessmentStep.poolSkills
    ? poolSkills?.filter(
        (poolSkill) => poolSkill?.type === PoolSkillType.Essential,
      )
    : [];
  const haveBeenAssessed =
    assessmentStep.poolSkills
      ?.filter(notEmpty)
      ?.filter(
        (poolSkill) =>
          poolSkill.id ===
          assessmentResults.find((ar) => ar.poolSkill?.id === poolSkill.id)
            ?.poolSkill?.id,
      ) || [];

  if (haveBeenAssessed?.length !== essentialPoolSkills?.length)
    return {
      icon: ExclamationCircleIcon,
      color: "quaternary",
      ariaLabel: intl.formatMessage({
        defaultMessage: "To assess",
        id: "JmmTl/",
        description: "Aria Label for alert icon on assessment result table",
      }),
    };

  // If all the results have the assessmentDecision === SUCCESSFUL, then set to success icon.
  const allResults = allEssentialAssessmentResultsOfStep.filter(
    (ar) => ar?.assessmentDecision === AssessmentDecision.Successful,
  );

  if (allResults.length === allEssentialAssessmentResultsOfStep.length)
    return {
      icon: CheckCircleIcon,
      color: "success",
      ariaLabel:
        type === AssessmentStepType.ApplicationScreening ||
        type === AssessmentStepType.ScreeningQuestionsAtApplication
          ? intl.formatMessage({
              defaultMessage: "Screened In",
              id: "fIb32U",
              description:
                "Aria Label for success icon on assessment result table",
            })
          : intl.formatMessage({
              defaultMessage: "Successful",
              id: "+R27gm",
              description:
                "Aria Label for success icon on assessment result table",
            }),
    };

  return {
    icon: null,
    color: "gray",
    ariaLabel: intl.formatMessage(commonMessages.notApplicable),
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
      cell: ({ row: { original } }) => {
        // Check if an assessmentResult exists on the assessment step
        const assessmentResult = original.assessmentResults.find(
          (ar) => ar.assessmentStep?.id === assessmentStep.id,
        );

        // Check if pool skill is not associated with the assessment step
        const isEducationRequirement =
          original.poolSkill === null || original.poolSkill === undefined;

        if (
          isEducationRequirement &&
          assessmentStep.type === AssessmentStepType.ApplicationScreening
        )
          return cells.jsx(
            <Dialog
              assessmentStep={assessmentStep}
              assessmentResult={assessmentResult}
              poolCandidate={poolCandidate}
              educationRequirement
            />,
          );

        // Check if pool skill is not associated with the assessment step
        const hasPoolSkill = assessmentStep.poolSkills?.find(
          (poolSkill) => poolSkill?.id === original.poolSkill?.id,
        );

        if (!hasPoolSkill) return null;

        if (assessmentResult)
          return cells.jsx(
            <Dialog
              assessmentStep={assessmentStep}
              assessmentResult={assessmentResult}
              poolCandidate={poolCandidate}
            />,
          );

        // Check if the assessment step has a poolSkill that is not attached to any assessmentResults yet.
        const hasBeenAssessed = assessmentStep.poolSkills
          ?.filter(notEmpty)
          ?.some(
            (poolSkill) =>
              poolSkill.id ===
              original.assessmentResults.find(
                (ar) => ar.poolSkill?.id === poolSkill.id,
              )?.poolSkill?.id,
          );

        if (!hasBeenAssessed)
          return cells.jsx(
            <Dialog
              assessmentStep={assessmentStep}
              poolCandidate={poolCandidate}
              poolSkillToAssess={original.poolSkill}
            />,
          );

        return null; // otherwise return null
      },
    },
  ) as AssessmentStepResultColumn;
};
