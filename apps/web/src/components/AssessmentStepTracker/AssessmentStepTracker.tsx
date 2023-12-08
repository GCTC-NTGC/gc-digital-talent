import React from "react";
import { useIntl } from "react-intl";

import { Board } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";

import { Pool } from "~/api/generated";
import applicationMessages from "~/messages/applicationMessages";

import ResultsDetails from "./ResultsDetails";
import AssessmentResults from "./AssessmentResults";

interface AssessmentStepTrackerProps {
  pool: Pool;
}

const AssessmentStepTracker = ({ pool }: AssessmentStepTrackerProps) => {
  const intl = useIntl();

  return (
    <Board.Root>
      {pool.assessmentSteps?.filter(notEmpty).map((step, index) => (
        <Board.Column key={step.id}>
          <Board.ColumnHeader
            prefix={intl.formatMessage(applicationMessages.numberedStep, {
              stepOrdinal: index + 1,
            })}
          >
            {getLocalizedName(step.title, intl)}
          </Board.ColumnHeader>
          <ResultsDetails step={step} />
          <AssessmentResults
            stepType={step.type}
            results={step.assessmentResults?.filter(notEmpty) ?? []}
          />
        </Board.Column>
      ))}
    </Board.Root>
  );
};

export default AssessmentStepTracker;
