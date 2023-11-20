import React from "react";
import { IntlShape } from "react-intl";

import { AssessmentStep, Pool } from "@gc-digital-talent/graphql";
import { Pill } from "@gc-digital-talent/ui";
import {
  commonMessages,
  getAssessmentStepType,
  getLocale,
} from "@gc-digital-talent/i18n";

import poolMessages from "~/messages/poolMessages";
import { getAssessmentPlanStatus } from "~/validators/pool/assessmentPlan";

export const getAssessmentPlanStatusPill = (
  pool: Pool,
  intl: IntlShape,
): React.ReactNode => {
  const assessmentPlanStatus = getAssessmentPlanStatus(pool);
  switch (assessmentPlanStatus) {
    case "complete":
      return (
        <Pill bold mode="outline" color="success">
          {intl.formatMessage(poolMessages.complete)}
        </Pill>
      );
    case "incomplete":
      return (
        <Pill bold mode="outline" color="error">
          {intl.formatMessage(poolMessages.incomplete)}
        </Pill>
      );
    case "submitted":
      return (
        <Pill bold mode="outline" color="black">
          {intl.formatMessage(poolMessages.submitted)}
        </Pill>
      );
    default:
      return null;
  }
};

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
