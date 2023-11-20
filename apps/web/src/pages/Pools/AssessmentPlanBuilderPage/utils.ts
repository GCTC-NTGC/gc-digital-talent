/* eslint-disable import/prefer-default-export */
import { IntlShape } from "react-intl";

import { AssessmentStep } from "@gc-digital-talent/graphql";
import {
  commonMessages,
  getAssessmentStepType,
  getLocale,
} from "@gc-digital-talent/i18n";

export const assessmentStepDisplayName = (
  assessmentStep: AssessmentStep,
  intl: IntlShape,
): string => {
  const locale = getLocale(intl);
  // don't want "N/A" from getLocalizedName
  const localizedTitle = assessmentStep?.title
    ? assessmentStep.title[locale]
    : null;
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
