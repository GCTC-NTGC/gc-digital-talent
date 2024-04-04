import React from "react";
import { IntlShape, useIntl } from "react-intl";

import { Board, Link, Well } from "@gc-digital-talent/ui";
import {
  commonMessages,
  getAssessmentStepType,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { AssessmentStep, Pool } from "@gc-digital-talent/graphql";

import applicationMessages from "~/messages/applicationMessages";
import useRoutes from "~/hooks/useRoutes";
import processMessages from "~/messages/processMessages";

import ResultsDetails from "./ResultsDetails";
import AssessmentResults from "./AssessmentResults";
import {
  ResultFilters,
  filterResults,
  groupPoolCandidatesByStep,
  defaultFilters,
  filterAlreadyDisqualified,
} from "./utils";
import Filters from "./Filters";

const talentPlacementLink = (chunks: React.ReactNode, href: string) => (
  <Link href={href}>{chunks}</Link>
);
export interface AssessmentStepTrackerProps {
  pool: Pool;
}

const generateStepName = (step: AssessmentStep, intl: IntlShape): string => {
  // check if title exists in LocalizedString object, then return empty string if not for a truthy check
  const titleLocalized = getLocalizedName(step.title, intl, true);
  if (titleLocalized) {
    return titleLocalized;
  }
  if (step.type) {
    return intl.formatMessage(getAssessmentStepType(step.type));
  }
  return intl.formatMessage(commonMessages.notAvailable);
};

const AssessmentStepTracker = ({ pool }: AssessmentStepTrackerProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const [filters, setFilters] = React.useState<ResultFilters>(defaultFilters);
  const steps = unpackMaybes(pool.assessmentSteps);
  const candidates = unpackMaybes(pool.poolCandidates);
  // to handle partially completed processes, filter out candidates assessed and disqualified pre-RoD
  const filteredCandidates = filterAlreadyDisqualified(candidates);
  const groupedSteps = groupPoolCandidatesByStep(steps, filteredCandidates);
  const filteredSteps = filterResults(filters, groupedSteps);

  return (
    <>
      <Filters onFiltersChange={setFilters} />
      {steps.length ? (
        <Board.Root>
          {filteredSteps.map(({ step, resultCounts, results }, index) => {
            const stepName = generateStepName(step, intl);
            const stepNumber = intl.formatMessage(
              applicationMessages.numberedStep,
              {
                stepOrdinal: index + 1,
              },
            );

            return (
              <Board.Column key={step.id}>
                <Board.ColumnHeader prefix={stepNumber}>
                  {stepName}
                </Board.ColumnHeader>
                <ResultsDetails {...{ resultCounts, step, filters }} />
                <AssessmentResults
                  stepType={step.type}
                  stepName={
                    stepNumber +
                    intl.formatMessage(commonMessages.dividingColon) +
                    stepName
                  }
                  {...{ results }}
                />
              </Board.Column>
            );
          })}
        </Board.Root>
      ) : (
        <Well>
          <p>
            {intl.formatMessage(processMessages.noAssessmentPlan)}{" "}
            {intl.formatMessage(processMessages.viewTalentPlacement, {
              a: (chunks: React.ReactNode) =>
                talentPlacementLink(chunks, paths.poolCandidateTable(pool.id)),
            })}
          </p>
        </Well>
      )}
    </>
  );
};

export default AssessmentStepTracker;
