/* eslint-disable import/prefer-default-export */
import { IntlShape } from "react-intl";

import {
  commonMessages,
  getAssessmentStepType,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import { AssessmentStep, PoolSkill } from "@gc-digital-talent/graphql";

export const assessmentStepDisplayName = (
  assessmentStep: AssessmentStep,
  intl: IntlShape,
): string => {
  const localizedTitle = getLocalizedName(assessmentStep?.title, intl, true);
  if (localizedTitle && assessmentStep.type) {
    return `${localizedTitle} (${intl.formatMessage(
      getAssessmentStepType(assessmentStep.type),
    )})`;
  }

  if (!localizedTitle && assessmentStep.type) {
    return intl.formatMessage(getAssessmentStepType(assessmentStep.type));
  }

  if (localizedTitle && !assessmentStep.type) {
    return localizedTitle;
  }

  return intl.formatMessage(commonMessages.notAvailable);
};

export const poolSkillToOption = (poolSkill: PoolSkill, intl: IntlShape) => ({
  value: poolSkill.id,
  label: poolSkill?.skill?.name
    ? getLocalizedName(poolSkill.skill.name, intl)
    : intl.formatMessage(commonMessages.nameNotLoaded),
});
