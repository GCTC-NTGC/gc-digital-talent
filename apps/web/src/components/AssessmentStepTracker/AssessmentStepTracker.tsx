import React from "react";
import { useIntl } from "react-intl";

import { Pool } from "@gc-digital-talent/graphql";
import { Board } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";

import { getFullNameLabel } from "~/utils/nameUtils";
import applicationMessages from "~/messages/applicationMessages";

import { groupPoolCandidatesByStep } from "./utils";

interface AssessmentStepTrackerProps {
  pool: Pool;
}

const AssessmentStepTracker = ({ pool }: AssessmentStepTrackerProps) => {
  const intl = useIntl();

  const groupedCandidates = groupPoolCandidatesByStep(pool);

  return (
    <Board.Root>
      {groupedCandidates.map(({ step, candidates }, index) => (
        <Board.Column key={step.id}>
          <Board.ColumnHeader
            prefix={intl.formatMessage(applicationMessages.numberedStep, {
              stepOrdinal: index + 1,
            })}
          >
            {getLocalizedName(step.title, intl)}
          </Board.ColumnHeader>
          <Board.List>
            {candidates.map((candidate) => (
              <Board.ListItem key={candidate.id}>
                {getFullNameLabel(
                  candidate.user.firstName,
                  candidate.user.lastName,
                  intl,
                )}
              </Board.ListItem>
            ))}
          </Board.List>
        </Board.Column>
      ))}
    </Board.Root>
  );
};

export default AssessmentStepTracker;
