import React from "react";
import { useIntl } from "react-intl";

import { Board } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";

import { Pool } from "~/api/generated";
import applicationMessages from "~/messages/applicationMessages";

import ResultsDetails from "./ResultsDetails";
import AssessmentResults from "./AssessmentResults";
import { groupResultsByCandidate } from "./utils";

export interface AssessmentStepTrackerProps {
  pool: Pool;
}

const AssessmentStepTracker = ({ pool }: AssessmentStepTrackerProps) => {
  const intl = useIntl();

  return (
    <Board.Root>
      {pool.assessmentSteps?.filter(notEmpty).map((step, index) => {
        const groupedResults = groupResultsByCandidate(
          step.assessmentResults?.filter(notEmpty) ?? [],
        );
        return (
          <Board.Column key={step.id}>
            <Board.ColumnHeader
              prefix={intl.formatMessage(applicationMessages.numberedStep, {
                stepOrdinal: index + 1,
              })}
            >
              {getLocalizedName(step.title, intl)}
            </Board.ColumnHeader>
            <ResultsDetails step={step} results={groupedResults} />
            <AssessmentResults stepType={step.type} results={groupedResults} />
          </Board.Column>
        );
      })}
    </Board.Root>
  );
};

export default AssessmentStepTracker;
