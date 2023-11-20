import React from "react";
import { useIntl } from "react-intl";

import {
  AssessmentDecision,
  AssessmentResult,
} from "@gc-digital-talent/graphql";
import { Board } from "@gc-digital-talent/ui";

import { getFullNameLabel } from "~/utils/nameUtils";

interface AssessmentResultsProps {
  results: AssessmentResult[];
}

const statusOrder: AssessmentDecision[] = [
  AssessmentDecision.NotSure,
  AssessmentDecision.Successful,
  AssessmentDecision.Unsuccessful,
];

const AssessmentResults = ({ results }: AssessmentResultsProps) => {
  const intl = useIntl();

  const sortedResults = results.sort((resultA, resultB) => {
    return (
      statusOrder.indexOf(
        resultA.assessmentDecision ?? AssessmentDecision.NotSure,
      ) -
      statusOrder.indexOf(
        resultB.assessmentDecision ?? AssessmentDecision.NotSure,
      )
    );
  });

  return (
    <Board.List>
      {sortedResults.map((result) => (
        <Board.ListItem key={result.id}>
          {getFullNameLabel(
            result.poolCandidate?.user.firstName,
            result.poolCandidate?.user.lastName,
            intl,
          )}
        </Board.ListItem>
      ))}
    </Board.List>
  );
};

export default AssessmentResults;
