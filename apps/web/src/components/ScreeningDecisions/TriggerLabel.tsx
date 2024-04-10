import * as React from "react";
import { useIntl } from "react-intl";

import {
  AssessmentDecision,
  PoolSkill,
  PoolSkillType,
} from "@gc-digital-talent/graphql";
import {
  commonMessages,
  getAssessmentDecisionLevel,
  getTableAssessmentDecision,
} from "@gc-digital-talent/i18n";

import poolCandidateMessages from "~/messages/poolCandidateMessages";

import { FormValues } from "./utils";

interface TriggerLabelProps {
  poolSkill?: PoolSkill;
  educationRequirement?: boolean;
  hasBeenAssessed: boolean;
  values?: FormValues;
}

const TriggerLabel = ({
  poolSkill,
  educationRequirement,
  hasBeenAssessed,
  values,
}: TriggerLabelProps) => {
  const intl = useIntl();
  if (!hasBeenAssessed) {
    return poolSkill?.type === PoolSkillType.Nonessential
      ? intl.formatMessage(poolCandidateMessages.unclaimed)
      : intl.formatMessage(poolCandidateMessages.toAssess);
  }

  return values?.assessmentDecision === "noDecision" ? (
    <>{intl.formatMessage(commonMessages.notSure)}</>
  ) : (
    <>
      {intl.formatMessage(
        values?.assessmentDecision
          ? getTableAssessmentDecision(values.assessmentDecision)
          : commonMessages.notFound,
      )}
      {values?.assessmentDecision === AssessmentDecision.Successful &&
      !educationRequirement ? (
        <span
          data-h2-color="base(gray.darker)"
          data-h2-text-decoration="base(none)"
          data-h2-display="base(block)"
        >
          {intl.formatMessage(
            values?.assessmentDecisionLevel
              ? getAssessmentDecisionLevel(values.assessmentDecisionLevel)
              : commonMessages.notFound,
          )}
        </span>
      ) : null}
    </>
  );
};

export default TriggerLabel;
