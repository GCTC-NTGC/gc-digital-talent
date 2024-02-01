import React from "react";
import { useIntl } from "react-intl";

import {
  CardBasic,
  Heading,
  ScrollToLink,
  Separator,
} from "@gc-digital-talent/ui";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { assertUnreachable } from "@gc-digital-talent/helpers/src/utils/util";

import { AssessmentStep, PoolSkill } from "~/api/generated";
import StatusItem, { Status } from "~/components/StatusItem/StatusItem";

import { PAGE_SECTION_ID } from "../navigation";
import {
  ASSESSMENT_STEPS_FEW_STEPS,
  ASSESSMENT_STEPS_MANY_STEPS,
} from "../constants";

export interface SkillsQuickSummaryProps {
  poolSkills: Array<PoolSkill>;
  assessmentSteps: Array<AssessmentStep>;
}

const SkillsQuickSummary = ({
  poolSkills,
  assessmentSteps,
}: SkillsQuickSummaryProps) => {
  const intl = useIntl();
  const titleId = React.useId();

  // count how many assessment steps there are for a given pool skill
  const assessmentStepCount = (poolSkill: PoolSkill): number => {
    return assessmentSteps.filter(
      (assessmentStep) =>
        assessmentStep.poolSkills?.some(
          (assessmentStepPoolSkill) =>
            assessmentStepPoolSkill?.id === poolSkill.id,
        ),
    ).length;
  };

  // Turn a status to a localized message
  const statusToMessage = (status: Status): string => {
    switch (status) {
      case "success":
        return intl.formatMessage(commonMessages.success);
      case "warning":
        return intl.formatMessage(commonMessages.warning);
      case "error":
        return intl.formatMessage(commonMessages.error);
      default:
        return assertUnreachable(status);
    }
  };

  // grand total validation
  const grandTotalStatus: Status =
    assessmentSteps.length <= ASSESSMENT_STEPS_FEW_STEPS ||
    assessmentSteps.length >= ASSESSMENT_STEPS_MANY_STEPS
      ? "warning"
      : "success";

  return (
    <aside aria-labelledby={titleId}>
      <CardBasic>
        <Heading
          id={titleId}
          level="h3"
          size="h6"
          data-h2-margin="base(0, 0, x.5, 0)"
        >
          {intl.formatMessage({
            defaultMessage: "Skills quick summary",
            id: "RSx3Ni",
            description: "Title for skills quick summary sidebar",
          })}
        </Heading>
        <div data-h2-margin="base(x.5 0)">
          <StatusItem
            title={intl.formatMessage({
              defaultMessage: "Total assessment count",
              id: "wfnbFR",
              description: "Grand total for skills quick summary sidebar",
            })}
            itemCount={assessmentSteps.length}
            status={grandTotalStatus}
            hiddenContextPrefix={statusToMessage(grandTotalStatus)}
          />
        </div>
        {poolSkills.map((poolSkill) => {
          const stepCount = assessmentStepCount(poolSkill);
          const status = stepCount > 0 ? "success" : "error";
          return (
            <StatusItem
              key={poolSkill.id}
              title={getLocalizedName(poolSkill.skill?.name, intl)}
              itemCount={stepCount}
              status={status}
              hiddenContextPrefix={statusToMessage(status)}
            />
          );
        })}
        <Separator
          orientation="horizontal"
          decorative
          data-h2-background-color="base(gray)"
          data-h2-margin="base(x1, 0, x1, 0)"
        />

        <ScrollToLink to={PAGE_SECTION_ID.SKILL_SUMMARY}>
          {intl.formatMessage({
            defaultMessage: "View full summary",
            id: "8di/ke",
            description: "Link title to view the full skill summary section",
          })}
        </ScrollToLink>
      </CardBasic>
    </aside>
  );
};

export default SkillsQuickSummary;
