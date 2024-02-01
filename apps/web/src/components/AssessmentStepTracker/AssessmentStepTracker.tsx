import React from "react";
import { useIntl } from "react-intl";

import { Board } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";

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
  const steps = unpackMaybes(pool.assessmentSteps);
  const candidates = unpackMaybes(pool.poolCandidates);
  const groupedSteps = groupPoolCandidatesByStep(steps, candidates);

  return (
    <Board.Root>
      {groupedSteps.map(({ step, resultCounts, results }, index) => (
        <Board.Column key={step.id}>
          <Board.ColumnHeader
            prefix={intl.formatMessage(applicationMessages.numberedStep, {
              stepOrdinal: index + 1,
            })}
          >
            {getLocalizedName(step.title, intl)}
          </Board.ColumnHeader>
          <ResultsDetails {...{ resultCounts, step }} />
          <AssessmentResults stepType={step.type} {...{ results }} />
        </Board.Column>
      ))}
    </Board.Root>
  );
};

export default AssessmentStepTracker;
