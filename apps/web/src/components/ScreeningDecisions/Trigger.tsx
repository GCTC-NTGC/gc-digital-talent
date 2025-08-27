import { useIntl } from "react-intl";
import { ReactNode } from "react";

import {
  AssessmentDecision,
  FragmentType,
  getFragment,
  graphql,
  PoolSkillType,
  SkillCategory,
} from "@gc-digital-talent/graphql";
import { Button, ButtonProps, Dialog } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import poolCandidateMessages from "~/messages/poolCandidateMessages";

import { DialogType } from "./useDialogType";
import { DIALOG_TYPE } from "./utils";

const ScreeningTriggerResult_Fragment = graphql(/** GraphQL */ `
  fragment ScreeningTriggerResult on AssessmentResult {
    assessmentDecision {
      value
      label {
        localized
      }
    }
    assessmentDecisionLevel {
      label {
        localized
      }
    }
  }
`);

const ScreeningTriggerPoolSkill_Fragment = graphql(/** GraphQL */ `
  fragment ScreeningTriggerPoolSkill on PoolSkill {
    type {
      value
    }
    skill {
      category {
        value
      }
    }
  }
`);

const decisionColours = new Map<
  AssessmentDecision | null,
  ButtonProps["color"]
>([
  [null, "black"],
  [AssessmentDecision.Successful, "success"],
  [AssessmentDecision.Hold, "warning"],
  [AssessmentDecision.Unsuccessful, "error"],
]);

interface TriggerProps {
  resultQuery?: FragmentType<typeof ScreeningTriggerResult_Fragment>;
  poolSkillquery?: FragmentType<typeof ScreeningTriggerPoolSkill_Fragment>;
  experienceAttached?: boolean;
  dialogType?: DialogType;
}

export const Trigger = ({
  resultQuery,
  poolSkillquery,
  experienceAttached,
  dialogType,
}: TriggerProps) => {
  const intl = useIntl();
  const result = getFragment(ScreeningTriggerResult_Fragment, resultQuery);
  const poolSkill = getFragment(
    ScreeningTriggerPoolSkill_Fragment,
    poolSkillquery,
  );
  let color: ButtonProps["color"] = "warning";
  let label: ReactNode = intl.formatMessage(poolCandidateMessages.toAssess);

  if (result) {
    label = !result?.assessmentDecision?.value
      ? intl.formatMessage(commonMessages.pendingSecondOpinion)
      : result?.assessmentDecision.label.localized;
    color =
      decisionColours.get(result.assessmentDecision?.value ?? null) ?? "black";
  } else {
    if (
      poolSkill?.type?.value === PoolSkillType.Nonessential &&
      (!experienceAttached ||
        poolSkill.skill?.category.value === SkillCategory.Behavioural)
    ) {
      label = intl.formatMessage(poolCandidateMessages.unclaimed);
      color = "black";
    }
  }

  return (
    <Dialog.Trigger>
      <Button
        type="button"
        mode="inline"
        color={color}
        className="text-left font-normal"
      >
        {label}
        {result?.assessmentDecision?.value === AssessmentDecision.Successful &&
          dialogType !== DIALOG_TYPE.Education &&
          result.assessmentDecisionLevel?.label?.localized && (
            <span className="block text-gray-600 no-underline dark:text-gray-200">
              {result.assessmentDecisionLevel.label.localized}
            </span>
          )}
      </Button>
    </Dialog.Trigger>
  );
};
