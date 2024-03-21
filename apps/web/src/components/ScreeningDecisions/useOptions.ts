import { useIntl } from "react-intl";
import OutlineExclamationTriangleIcon from "@heroicons/react/24/outline/ExclamationTriangleIcon";
import SolidExclamationTriangleIcon from "@heroicons/react/24/solid/ExclamationTriangleIcon";
import OutlineCheckCircleIcon from "@heroicons/react/24/outline/CheckCircleIcon";
import SolidCheckCircleIcon from "@heroicons/react/24/solid/CheckCircleIcon";
import OutlineXCircleIcon from "@heroicons/react/24/outline/XCircleIcon";
import SolidXCircleIcon from "@heroicons/react/24/solid/XCircleIcon";
import OutlinePauseCircleIcon from "@heroicons/react/24/outline/PauseCircleIcon";
import SolidPauseCircleIcon from "@heroicons/react/24/solid/PauseCircleIcon";

import {
  CardOption,
  CheckboxOption,
  enumToOptions,
} from "@gc-digital-talent/forms";
import {
  AssessmentDecision,
  AssessmentDecisionLevel,
  AssessmentResultJustification,
} from "@gc-digital-talent/graphql";
import {
  getAssessmentDecision,
  getAssessmentDecisionLevel,
  getAssessmentJustification,
} from "@gc-digital-talent/i18n";
import { commonMessages } from "@gc-digital-talent/i18n";

import { NO_DECISION } from "~/utils/assessmentResults";

import OutlineEducationIcon from "./Icons/outline/EducationIcon";
import SolidEducationIcon from "./Icons/solid/EducationIcon";
import OutlineEducationWorkIcon from "./Icons/outline/EducationWorkIcon";
import SolidEducationWorkIcon from "./Icons/solid/EducationWorkIcon";
import OutlineWorkIcon from "./Icons/outline/WorkIcon";
import SolidWorkIcon from "./Icons/solid/WorkIcon";
import OutlineOneBarIcon from "./Icons/outline/OneBarIcon";
import SolidOneBarIcon from "./Icons/solid/OneBarIcon";
import OutlineTwoBarsIcon from "./Icons/outline/TwoBarsIcon";
import SolidTwoBarsIcon from "./Icons/solid/TwoBarsIcon";
import OutlineThreeBarsIcon from "./Icons/outline/ThreeBarsIcon";
import SolidThreeBarsIcon from "./Icons/solid/ThreeBarsIcon";
import { DialogType } from "./useDialogType";

const useOptions = (
  dialogType: DialogType,
): {
  assessmentDecisionItems: CardOption[];
  successfulOptions: CardOption[];
  unsuccessfulOptions: CheckboxOption[];
} => {
  const intl = useIntl();

  const assessmentDecisionItems: CardOption[] = [
    {
      label: intl.formatMessage(commonMessages.notSure),
      selectedIcon: SolidExclamationTriangleIcon,
      selectedIconColor: "warning",
      unselectedIcon: OutlineExclamationTriangleIcon,
      value: NO_DECISION,
    },
    {
      label: intl.formatMessage(
        getAssessmentDecision(AssessmentDecision.Successful),
      ),
      selectedIcon: SolidCheckCircleIcon,
      selectedIconColor: "success",
      unselectedIcon: OutlineCheckCircleIcon,
      value: AssessmentDecision.Successful,
    },
    {
      label: intl.formatMessage(
        getAssessmentDecision(AssessmentDecision.Unsuccessful),
      ),
      selectedIcon: SolidXCircleIcon,
      selectedIconColor: "error",
      unselectedIcon: OutlineXCircleIcon,
      value: AssessmentDecision.Unsuccessful,
    },
    {
      label: intl.formatMessage(getAssessmentDecision(AssessmentDecision.Hold)),
      selectedIcon: SolidPauseCircleIcon,
      selectedIconColor: "warning",
      unselectedIcon: OutlinePauseCircleIcon,
      value: AssessmentDecision.Hold,
    },
  ];

  const successfulOptions: CardOption[] =
    dialogType === "EDUCATION"
      ? [
          {
            label: intl.formatMessage(
              getAssessmentJustification(
                AssessmentResultJustification.EducationAcceptedInformation,
              ),
            ),
            selectedIcon: SolidEducationIcon,
            selectedIconColor: "success",
            unselectedIcon: OutlineEducationIcon,
            value: AssessmentResultJustification.EducationAcceptedInformation,
          },
          {
            label: intl.formatMessage(
              getAssessmentJustification(
                AssessmentResultJustification.EducationAcceptedCombinationEducationWorkExperience,
              ),
            ),
            selectedIcon: SolidEducationWorkIcon,
            selectedIconColor: "success",
            unselectedIcon: OutlineEducationWorkIcon,
            value:
              AssessmentResultJustification.EducationAcceptedCombinationEducationWorkExperience,
          },
          {
            label: intl.formatMessage(
              getAssessmentJustification(
                AssessmentResultJustification.EducationAcceptedWorkExperienceEquivalency,
              ),
            ),
            selectedIcon: SolidWorkIcon,
            selectedIconColor: "success",
            unselectedIcon: OutlineWorkIcon,
            value:
              AssessmentResultJustification.EducationAcceptedWorkExperienceEquivalency,
          },
        ]
      : [
          {
            label: intl.formatMessage(
              getAssessmentDecisionLevel(AssessmentDecisionLevel.AtRequired),
            ),
            selectedIcon: SolidOneBarIcon,
            selectedIconColor: "success",
            unselectedIcon: OutlineOneBarIcon,
            value: AssessmentDecisionLevel.AtRequired,
          },
          {
            label: intl.formatMessage(
              getAssessmentDecisionLevel(AssessmentDecisionLevel.AboveRequired),
            ),
            selectedIcon: SolidTwoBarsIcon,
            selectedIconColor: "success",
            unselectedIcon: OutlineTwoBarsIcon,
            value: AssessmentDecisionLevel.AboveRequired,
          },
          {
            label: intl.formatMessage(
              getAssessmentDecisionLevel(
                AssessmentDecisionLevel.AboveAndBeyondRequired,
              ),
            ),
            selectedIcon: SolidThreeBarsIcon,
            selectedIconColor: "success",
            unselectedIcon: OutlineThreeBarsIcon,
            value: AssessmentDecisionLevel.AboveAndBeyondRequired,
          },
        ];

  const justifications =
    dialogType === "EDUCATION"
      ? [
          AssessmentResultJustification.EducationFailedNotRelevant,
          AssessmentResultJustification.EducationFailedRequirementNotMet,
          AssessmentResultJustification.FailedNotEnoughInformation,
          AssessmentResultJustification.FailedOther,
        ]
      : [
          AssessmentResultJustification.SkillFailedInsufficientlyDemonstrated,
          AssessmentResultJustification.FailedNotEnoughInformation,
          AssessmentResultJustification.FailedOther,
        ]; // list of justifications in sorted order

  const unsuccessfulOptions: CheckboxOption[] = enumToOptions(
    AssessmentResultJustification,
    justifications,
  )
    .filter(({ value }) =>
      justifications.includes(value as AssessmentResultJustification),
    )
    .map(({ value }) => ({
      value,
      label: intl.formatMessage(getAssessmentJustification(value)),
    }));

  return {
    assessmentDecisionItems,
    successfulOptions,
    unsuccessfulOptions,
  };
};

export default useOptions;
