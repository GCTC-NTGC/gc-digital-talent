import React from "react";
import { useIntl } from "react-intl";

import { Board } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";

import { Pool } from "~/api/generated";
import applicationMessages from "~/messages/applicationMessages";

import ResultsDetails from "./ResultsDetails";
import AssessmentResults from "./AssessmentResults";
import { groupPoolCandidatesByStep } from "./utils";

export interface AssessmentStepTrackerProps {
  pool: Pool;
}

const AssessmentStepTracker = ({ pool }: AssessmentStepTrackerProps) => {
  const intl = useIntl();
  const steps = groupPoolCandidatesByStep(pool);

  return (
    <Board.Root>
      {Array.from(steps.values()).map(({ step, assessments }, index) => {
        const assessmentsWithDecision = Array.from(assessments.values());
        return (
          <Board.Column key={step.id}>
            <Board.ColumnHeader
              prefix={intl.formatMessage(applicationMessages.numberedStep, {
                stepOrdinal: index + 1,
              })}
            >
              {getLocalizedName(step.title, intl)}
            </Board.ColumnHeader>
            <ResultsDetails step={step} results={assessmentsWithDecision} />
            <AssessmentResults
              stepType={step.type}
              results={assessmentsWithDecision}
            />
          </Board.Column>
        );
      })}
    </Board.Root>
  );
};

export default AssessmentStepTracker;
