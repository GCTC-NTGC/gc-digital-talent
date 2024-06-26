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
} from "@gc-digital-talent/graphql";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";

import poolCandidateMessages from "~/messages/poolCandidateMessages";
import { getResultsDecision } from "~/utils/poolCandidate";
import { NO_DECISION } from "~/utils/assessmentResults";

import {
  AssessmentTableRow,
  AssessmentTableRowColumn,
  AssessmentTableRowColumnProps,
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
          ? intl.formatMessage(commonMessages.screenedOut)
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
            aria-label={ariaLabel}
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
  const assessmentDecisionResult = getResultsDecision(
    assessmentStep,
    assessmentResults,
  );

  switch (assessmentDecisionResult) {
    case AssessmentDecision.Unsuccessful:
      return {
        icon: XCircleIcon,
        color: "error",
      };
    case AssessmentDecision.Hold:
      return {
        icon: PauseCircleIcon,
        color: "hold",
      };
    case NO_DECISION:
      return {
        icon: ExclamationCircleIcon,
        color: "toAssess",
      };
    case AssessmentDecision.Successful:
      return {
        icon: CheckCircleIcon,
        color: "success",
      };
    default:
      return {
        icon: ExclamationCircleIcon,
        color: "toAssess",
      };
  }
};

const columnHelper = createColumnHelper<AssessmentTableRow>();

export const buildColumn = ({
  id,
  poolCandidate,
  assessmentStep,
  intl,
  header,
}: AssessmentTableRowColumnProps): AssessmentTableRowColumn => {
  return columnHelper.accessor(
    ({ assessmentResults }) => {
      const assessmentResult = assessmentResults.find(
        (ar) => ar.assessmentStep?.id === assessmentStep.id,
      );
      return getLocalizedName(
        assessmentResult?.assessmentDecision?.label,
        intl,
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
          assessmentStep.type?.value ===
            AssessmentStepType.ApplicationScreening &&
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

        return (
          <span data-h2-visually-hidden="l-tablet(invisible)">
            {intl.formatMessage(commonMessages.notApplicable)}
          </span>
        );
      },
      meta: {
        mobileHeader: getLocalizedName(assessmentStep.type?.label, intl),
        columnDialogHeader: getLocalizedName(assessmentStep.type?.label, intl),
      },
    },
  ) as AssessmentTableRowColumn;
};
