/* eslint-disable import/prefer-default-export */
import React from "react";
import { IntlShape } from "react-intl";

import { Pool } from "@gc-digital-talent/graphql";
import { Pill } from "@gc-digital-talent/ui";

import poolMessages from "~/messages/poolMessages";
import { deriveAssessmentPlanStatus } from "~/validators/pool/assessmentPlan";

export const getAssessmentPlanStatusPill = (
  pool: Pool,
  intl: IntlShape,
): React.ReactNode => {
  const assessmentPlanStatus = deriveAssessmentPlanStatus(pool);
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
