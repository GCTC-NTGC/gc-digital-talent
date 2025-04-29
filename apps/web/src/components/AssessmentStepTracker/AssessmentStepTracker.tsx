import { ReactNode, useState } from "react";
import { useIntl } from "react-intl";
import { SubmitHandler } from "react-hook-form";

import { Board, Link, Well } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";

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
  generateStepName,
  transformPoolCandidateSearchInputToFormValues,
} from "./utils";
import Filters from "./Filters";
import SpinnerIcon from "../SpinnerIcon/SpinnerIcon";
import AssessmentResultsFilterDialog from "./AssessmentResultsFilterDialog";
import { FormValues } from "./types";

const talentPlacementLink = (chunks: ReactNode, href: string) => (
  <Link href={href}>{chunks}</Link>
);

export const AssessmentStepTracker_CandidateFragment = graphql(/* GraphQL */ `
  fragment AssessmentStepTracker_Candidate on PoolCandidate {
    id
    isBookmarked
    priorityVerification
    veteranVerification
    status {
      value
      label {
        en
        fr
      }
    }
    user {
      id
      firstName
      lastName
      armedForcesStatus {
        value
        label {
          en
          fr
        }
      }
      hasPriorityEntitlement
    }
    assessmentStatus {
      currentStep
      assessmentStepStatuses {
        decision
        step
      }
    }
  }
`);

export const AssessmentStepTracker_PoolFragment = graphql(/* GraphQL */ `
  fragment AssessmentStepTracker_Pool on Pool {
    id
    assessmentSteps {
      id
      title {
        en
        fr
      }
      type {
        value
        label {
          en
          fr
        }
      }
      sortOrder
    }
  }
`);

export interface AssessmentStepTrackerProps {
  poolQuery?: FragmentType<typeof AssessmentStepTracker_PoolFragment>;
  candidateQuery?: FragmentType<
    typeof AssessmentStepTracker_CandidateFragment
  >[];
  fetching: boolean;
  onSubmitDialog: SubmitHandler<FormValues>;
}

const AssessmentStepTracker = ({
  poolQuery,
  candidateQuery,
  fetching,
  onSubmitDialog,
}: AssessmentStepTrackerProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const [filters, setFilters] = useState<ResultFilters>(defaultFilters);
  const pool = getFragment(AssessmentStepTracker_PoolFragment, poolQuery);
  const steps = unpackMaybes(pool?.assessmentSteps);
  const poolCandidates = getFragment(
    AssessmentStepTracker_CandidateFragment,
    candidateQuery,
  );
  const candidates = unpackMaybes(poolCandidates ? [...poolCandidates] : []);
  // to handle partially completed processes, filter out candidates assessed and disqualified pre-RoD
  const filteredCandidates = filterAlreadyDisqualified(candidates);
  const groupedSteps = groupPoolCandidatesByStep(steps, filteredCandidates);
  const filteredSteps = filterResults(filters, groupedSteps);

  return (
    <>
      <div
        data-h2-display="base(flex)"
        data-h2-align-items="base(flex-end)"
        data-h2-gap="base(x.5)"
        data-h2-margin-bottom="base(x1) l-tablet(x.25)"
        data-h2-justify-content="base(flex-start)"
        data-h2-font-size="base(caption)"
        data-h2-flex-wrap="base(wrap)"
      >
        <Filters onFiltersChange={setFilters} />
        <div data-h2-width="base(100%) l-tablet(auto)" data-h2-order="base(0)">
          <AssessmentResultsFilterDialog
            onSubmit={onSubmitDialog}
            resetValues={transformPoolCandidateSearchInputToFormValues(
              undefined,
              pool?.id ?? "",
            )}
          />
        </div>
      </div>
      {steps.length ? (
        <Board.Root>
          {filteredSteps.map(({ step, resultCounts, results }, index) => {
            const stepName = generateStepName(
              { type: step.type, title: step.title },
              intl,
            );
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
                <ResultsDetails
                  {...{
                    step: { type: step.type, title: step.title },
                    resultCounts,
                    filters,
                  }}
                />
                {fetching ? (
                  <Well fontSize="caption" data-h2-margin="base(x.5)">
                    <div
                      data-h2-display="base(flex)"
                      data-h2-align-items="base(center)"
                    >
                      <SpinnerIcon data-h2-width="base(x.75)" />
                      <span>{intl.formatMessage(commonMessages.loading)}</span>
                    </div>
                  </Well>
                ) : (
                  <AssessmentResults
                    stepType={step.type?.value}
                    stepName={
                      stepNumber +
                      intl.formatMessage(commonMessages.dividingColon) +
                      stepName
                    }
                    {...{ results }}
                  />
                )}
              </Board.Column>
            );
          })}
        </Board.Root>
      ) : (
        <Well>
          <p>
            {/* eslint-disable-next-line formatjs/no-literal-string-in-jsx */}
            {intl.formatMessage(processMessages.noAssessmentPlan)}{" "}
            {intl.formatMessage(processMessages.viewTalentPlacement, {
              a: (chunks: ReactNode) =>
                talentPlacementLink(
                  chunks,
                  paths.poolCandidateTable(pool?.id ?? ""),
                ),
            })}
          </p>
        </Well>
      )}
    </>
  );
};

export default AssessmentStepTracker;
