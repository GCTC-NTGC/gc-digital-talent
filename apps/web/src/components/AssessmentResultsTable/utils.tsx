import { createColumnHelper } from "@tanstack/react-table";
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";
import PauseCircleIcon from "@heroicons/react/24/solid/PauseCircleIcon";
import ExclamationCircleIcon from "@heroicons/react/24/solid/ExclamationCircleIcon";
import CheckCircleIcon from "@heroicons/react/24/solid/CheckCircleIcon";
import { IntlShape } from "react-intl";
import { tv } from "tailwind-variants";

import {
  AssessmentDecision,
  AssessmentResultStatus,
  AssessmentStep,
  AssessmentStepType,
  Maybe,
} from "@gc-digital-talent/graphql";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import poolCandidateMessages from "~/messages/poolCandidateMessages";
import { NO_DECISION } from "~/utils/assessmentResults";

import {
  AssessmentTableRow,
  AssessmentTableRowColumn,
  AssessmentTableRowColumnProps,
  ColumnStatus,
} from "./types";
import cells from "../Table/cells";
import Dialog from "../ScreeningDecisions/ScreeningDecisionDialog";

const iconStyles = tv({
  base: "h-auto w-5 shrink-0 align-middle xs:inline-block",
  variants: {
    status: {
      error: "text-error",
      hold: "text-primary",
      toAssess: "text-warning",
      success: "text-success",
      gray: "text-gray",
    },
  },
});

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
    <span className="inline">
      <span className="flex content-center gap-1.5">
        {Icon && (
          <Icon
            aria-label={ariaLabel}
            aria-hidden="false"
            className={iconStyles({ status: status.color })}
          />
        )}
        {header}
      </span>
    </span>
  );
};

export const columnStatus = (
  assessmentStep: Pick<AssessmentStep, "id">,
  assessmentStatus?: Maybe<AssessmentResultStatus>,
): ColumnStatus => {
  const assessmentDecisionResult =
    assessmentStatus?.assessmentStepStatuses?.find(
      (stepStatus) => stepStatus?.step === assessmentStep.id,
    )?.decision ?? NO_DECISION;

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
  experiences,
  assessmentStep,
  intl,
  header,
}: AssessmentTableRowColumnProps): AssessmentTableRowColumn => {
  return columnHelper.accessor(
    ({ assessmentResults }) => {
      const assessmentResult = unpackMaybes(assessmentResults).find(
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
        const assessmentResult = unpackMaybes(assessmentResults).find(
          (ar) => ar.assessmentStep?.id === assessmentStep.id,
        );
        if (assessmentResult || isEducationRequirement) {
          return cells.jsx(
            <Dialog
              assessmentStep={{
                id: assessmentStep.id,
                type: assessmentStep.type,
                title: assessmentStep.title,
              }}
              assessmentResult={
                assessmentResult
                  ? {
                      id: assessmentResult.id,
                      poolSkill: assessmentResult.poolSkill,
                      justifications: assessmentResult.justifications,
                      assessmentDecision: assessmentResult.assessmentDecision,
                      assessmentDecisionLevel:
                        assessmentResult.assessmentDecisionLevel,
                      skillDecisionNotes: assessmentResult.skillDecisionNotes,
                    }
                  : null
              }
              experiences={experiences}
              poolCandidate={{
                id: poolCandidate.id,
                profileSnapshot: String(poolCandidate.profileSnapshot),
                screeningQuestionResponses:
                  poolCandidate.screeningQuestionResponses,
                educationRequirementOption:
                  poolCandidate.educationRequirementOption,
                educationRequirementExperiences:
                  poolCandidate.educationRequirementExperiences,
                pool: {
                  classification: poolCandidate.pool.classification,
                  publishingGroup: poolCandidate.pool.publishingGroup,
                },
              }}
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
              assessmentStep={{
                id: assessmentStep.id,
                type: assessmentStep.type,
                title: assessmentStep.title,
              }}
              assessmentResult={assessmentResult} // always undefined
              experiences={experiences}
              poolCandidate={{
                id: poolCandidate.id,
                profileSnapshot: String(poolCandidate.profileSnapshot),
                screeningQuestionResponses:
                  poolCandidate.screeningQuestionResponses,
                pool: {
                  classification: poolCandidate.pool.classification,
                  publishingGroup: poolCandidate.pool.publishingGroup,
                },
              }}
              poolSkillToAssess={poolSkill}
            />,
          );
        }

        return (
          <span className="sm:sr-only">
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
