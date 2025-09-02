import { createColumnHelper } from "@tanstack/react-table";
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";
import PauseCircleIcon from "@heroicons/react/24/solid/PauseCircleIcon";
import ExclamationCircleIcon from "@heroicons/react/24/solid/ExclamationCircleIcon";
import CheckCircleIcon from "@heroicons/react/24/solid/CheckCircleIcon";
import { IntlShape } from "react-intl";
import { tv } from "tailwind-variants";
import { ReactNode } from "react";

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
  ColumnStatus,
} from "./types";
import ScreeningDecisionDialog, {
  ScreeningDecisionDialogProps,
} from "../ScreeningDecisions/ScreeningDecisionDialog";

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

interface BuildColumnArgs {
  id: string;
  header: ReactNode;
  altHeader: ReactNode;
  intl: IntlShape;
  dialogProps: ScreeningDecisionDialogProps;
}

export const buildColumn = ({
  id,
  intl,
  header,
  altHeader,
  dialogProps,
}: BuildColumnArgs): AssessmentTableRowColumn => {
  return columnHelper.accessor(
    ({ assessmentResults }) => {
      const assessmentResult = unpackMaybes(assessmentResults).find(
        (ar) => ar.assessmentStep?.id === dialogProps.stepId,
      );
      return getLocalizedName(
        assessmentResult?.assessmentDecision?.label,
        intl,
      );
    },
    {
      id,
      header: () => header,
      cell: ({ row: { original } }) => {
        if (!original || !dialogProps) {
          return (
            <span className="sm:sr-only">
              {intl.formatMessage(commonMessages.notApplicable)}
            </span>
          );
        }

        return (
          <ScreeningDecisionDialog
            {...dialogProps}
            poolSkillId={original.poolSkill?.id}
          />
        );
      },
      meta: {
        mobileHeader: altHeader,
        columnDialogHeader: altHeader,
      },
    },
  ) as AssessmentTableRowColumn;
};
