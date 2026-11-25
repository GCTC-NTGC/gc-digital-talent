import OutlineCheckCircleIcon from "@heroicons/react/24/outline/CheckCircleIcon";
import OutlineExclamationTriangleIcon from "@heroicons/react/24/outline/ExclamationTriangleIcon";
import OutlinePauseCircleIcon from "@heroicons/react/24/outline/PauseCircleIcon";
import OutlineXCircleIcon from "@heroicons/react/24/outline/XCircleIcon";
import SolidCheckCircleIcon from "@heroicons/react/24/solid/CheckCircleIcon";
import SolidExclamationTriangleIcon from "@heroicons/react/24/solid/ExclamationTriangleIcon";
import SolidPauseCircleIcon from "@heroicons/react/24/solid/PauseCircleIcon";
import SolidXCircleIcon from "@heroicons/react/24/solid/XCircleIcon";
import { useIntl } from "react-intl";
import { useQuery } from "urql";

import type { CardOption, CheckboxOption } from "@gc-digital-talent/forms";
import { localizedEnumToOptions } from "@gc-digital-talent/forms";
import {
  AssessmentDecision,
  AssessmentDecisionLevel,
  AssessmentResultJustification,
  graphql,
} from "@gc-digital-talent/graphql";
import { getLocalizedEnumStringByValue } from "@gc-digital-talent/i18n";

import { NO_DECISION } from "~/utils/assessmentResults";

import OutlineEducationIcon from "./Icons/outline/EducationIcon";
import OutlineEducationWorkIcon from "./Icons/outline/EducationWorkIcon";
import OutlineOneBarIcon from "./Icons/outline/OneBarIcon";
import OutlineThreeBarsIcon from "./Icons/outline/ThreeBarsIcon";
import OutlineTwoBarsIcon from "./Icons/outline/TwoBarsIcon";
import OutlineWorkIcon from "./Icons/outline/WorkIcon";
import SolidEducationIcon from "./Icons/solid/EducationIcon";
import SolidEducationWorkIcon from "./Icons/solid/EducationWorkIcon";
import SolidOneBarIcon from "./Icons/solid/OneBarIcon";
import SolidThreeBarsIcon from "./Icons/solid/ThreeBarsIcon";
import SolidTwoBarsIcon from "./Icons/solid/TwoBarsIcon";
import SolidWorkIcon from "./Icons/solid/WorkIcon";
import type { DialogType } from "./utils";

const ScreeningOptions_Query = graphql(/* GraphQL */ `
  query ScreeningOptions {
    justifications: localizedEnumStrings(
      enumName: "AssessmentResultJustification"
    ) {
      value
      label {
        en
        fr
      }
    }
    decisions: localizedEnumStrings(enumName: "AssessmentDecision") {
      value
      label {
        en
        fr
      }
    }
    decisionLevels: localizedEnumStrings(enumName: "AssessmentDecisionLevel") {
      value
      label {
        en
        fr
      }
    }
  }
`);

const useOptions = (
  dialogType: DialogType,
): {
  assessmentDecisionItems: CardOption[];
  successfulOptions: CardOption[];
  unsuccessfulOptions: CheckboxOption[];
  fetching: boolean;
} => {
  const intl = useIntl();
  const [{ data, fetching }] = useQuery({ query: ScreeningOptions_Query });

  const assessmentDecisionItems: CardOption[] = [
    {
      label: intl.formatMessage({
        defaultMessage: "Pending second opinion",
        id: "Rp+NHA",
        description: "Pending second opinion",
      }),
      selectedIcon: SolidExclamationTriangleIcon,
      selectedIconColor: "warning",
      unselectedIcon: OutlineExclamationTriangleIcon,
      value: NO_DECISION,
    },
    {
      label: getLocalizedEnumStringByValue(
        AssessmentDecision.Successful,
        data?.decisions,
        intl,
      ),
      selectedIcon: SolidCheckCircleIcon,
      selectedIconColor: "success",
      unselectedIcon: OutlineCheckCircleIcon,
      value: AssessmentDecision.Successful,
    },
    {
      label: getLocalizedEnumStringByValue(
        AssessmentDecision.Unsuccessful,
        data?.decisions,
        intl,
      ),
      selectedIcon: SolidXCircleIcon,
      selectedIconColor: "error",
      unselectedIcon: OutlineXCircleIcon,
      value: AssessmentDecision.Unsuccessful,
    },
    {
      label: getLocalizedEnumStringByValue(
        AssessmentDecision.Hold,
        data?.decisions,
        intl,
      ),
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
            label: getLocalizedEnumStringByValue(
              AssessmentResultJustification.EducationAcceptedInformation,
              data?.justifications,
              intl,
            ),
            selectedIcon: SolidEducationIcon,
            selectedIconColor: "success",
            unselectedIcon: OutlineEducationIcon,
            value: AssessmentResultJustification.EducationAcceptedInformation,
          },
          {
            label: getLocalizedEnumStringByValue(
              AssessmentResultJustification.EducationAcceptedCombinationEducationWorkExperience,
              data?.justifications,
              intl,
            ),
            selectedIcon: SolidEducationWorkIcon,
            selectedIconColor: "success",
            unselectedIcon: OutlineEducationWorkIcon,
            value:
              AssessmentResultJustification.EducationAcceptedCombinationEducationWorkExperience,
          },
          {
            label: getLocalizedEnumStringByValue(
              AssessmentResultJustification.EducationAcceptedWorkExperienceEquivalency,
              data?.justifications,
              intl,
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
            label: getLocalizedEnumStringByValue(
              AssessmentDecisionLevel.AtRequired,
              data?.decisionLevels,
              intl,
            ),
            selectedIcon: SolidOneBarIcon,
            selectedIconColor: "success",
            unselectedIcon: OutlineOneBarIcon,
            value: AssessmentDecisionLevel.AtRequired,
          },
          {
            label: getLocalizedEnumStringByValue(
              AssessmentDecisionLevel.AboveRequired,
              data?.decisionLevels,
              intl,
            ),
            selectedIcon: SolidTwoBarsIcon,
            selectedIconColor: "success",
            unselectedIcon: OutlineTwoBarsIcon,
            value: AssessmentDecisionLevel.AboveRequired,
          },
          {
            label: getLocalizedEnumStringByValue(
              AssessmentDecisionLevel.AboveAndBeyondRequired,
              data?.decisionLevels,
              intl,
            ),
            selectedIcon: SolidThreeBarsIcon,
            selectedIconColor: "success",
            unselectedIcon: OutlineThreeBarsIcon,
            value: AssessmentDecisionLevel.AboveAndBeyondRequired,
          },
        ];

  const justifications: string[] =
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

  const unsuccessfulOptions: CheckboxOption[] = localizedEnumToOptions(
    data?.justifications?.filter((justification) =>
      justifications.includes(justification.value),
    ),
    intl,
  );

  return {
    assessmentDecisionItems,
    successfulOptions,
    unsuccessfulOptions,
    fetching,
  };
};

export default useOptions;
