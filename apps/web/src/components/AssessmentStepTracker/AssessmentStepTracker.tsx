import React from "react";
import { useIntl } from "react-intl";

import { Board } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { Pool } from "@gc-digital-talent/graphql";

import applicationMessages from "~/messages/applicationMessages";

import ResultsDetails from "./ResultsDetails";
import AssessmentResults from "./AssessmentResults";
import {
  ResultFilters,
  filterResults,
  groupPoolCandidatesByStep,
  defaultFilters,
} from "./utils";
import Filters from "./Filters";

export interface AssessmentStepTrackerProps {
  pool: Pool;
}

const AssessmentStepTracker = ({ pool }: AssessmentStepTrackerProps) => {
  const intl = useIntl();
  const [filters, setFilters] = React.useState<ResultFilters>(defaultFilters);
  const steps = unpackMaybes(pool.assessmentSteps);
  const candidates = unpackMaybes(pool.poolCandidates);
  const groupedSteps = groupPoolCandidatesByStep(steps, candidates);

  const filteredSteps = React.useMemo(() => {
    return filterResults(filters, groupedSteps);
  }, [groupedSteps, filters]);

  return (
    <>
      <Filters onFiltersChange={setFilters} />
      <Board.Root>
        {filteredSteps.map(({ step, resultCounts, results }, index) => (
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
    </>
  );
};

export default AssessmentStepTracker;
