import React from "react";
import { useIntl } from "react-intl";
import BookmarkIcon from "@heroicons/react/24/outline/BookmarkIcon";

import {
  ArmedForcesStatus,
  AssessmentResult,
} from "@gc-digital-talent/graphql";
import { Board, Link } from "@gc-digital-talent/ui";

import { getFullNameLabel } from "~/utils/nameUtils";

import useRoutes from "../../hooks/useRoutes";
import { getDecisionInfo, sortResults } from "./utils";

interface PriorityProps {
  type: "veteran" | "entitlement";
}

const Priority = ({ type }: PriorityProps) => {
  const intl = useIntl();

  return (
    <span
      data-h2-background-color="base(black) base:dark(white)"
      data-h2-color="base(white) base:dark(black)"
      data-h2-padding="base(0 x.125)"
      data-h2-radius="base(rounded)"
      data-h2-margin-left="base(x.35)"
      data-h2-font-size="base(0.6rem)"
      data-h2-font-weight="base(700)"
      data-h2-transition="base(all .2s ease)"
    >
      {type === "veteran"
        ? intl.formatMessage({
            defaultMessage: "VA",
            id: "KXy+Ei",
            description: "Short form code representing 'veteran'",
          })
        : intl.formatMessage({
            defaultMessage: "P",
            id: "nzF0AE",
            description: "Short form code representing 'priority entitlement'",
          })}
    </span>
  );
};

interface AssessmentResultProps {
  result: AssessmentResult;
  ordinal: number;
}

const AssessmentResult = ({ result, ordinal }: AssessmentResultProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  // We should always have one, but if not, don't show anything
  if (!result.poolCandidate) return null;

  const { icon, colorStyle, name } = getDecisionInfo(
    result.assessmentDecision,
    intl,
  );
  const Icon = icon;

  const iconStyles = {
    "data-h2-height": "base(x.65)",
    "data-h2-width": "base(x.65)",
  };

  return (
    <Board.ListItem>
      <div
        data-h2-display="base(flex)"
        data-h2-align-items="base(center)"
        data-h2-gap="base(0 x.25)"
        data-h2-width="base(100%)"
      >
        <BookmarkIcon {...iconStyles} data-h2-flex-shrink="base(0)" />
        <Link
          mode="text"
          color="black"
          data-h2-flex-grow="base(1)"
          href={paths.poolCandidateApplication(result.poolCandidate.id)}
        >
          {ordinal}.{" "}
          {getFullNameLabel(
            result.poolCandidate.user.firstName,
            result.poolCandidate.user.lastName,
            intl,
          )}
        </Link>
        <span
          data-h2-flex-shrink="base(0)"
          data-h2-display="base(flex)"
          data-h2-align-items="base(center)"
          data-h2-gap="base(0 x.125)"
        >
          {result.poolCandidate.user.hasPriorityEntitlement && (
            <Priority type="entitlement" />
          )}
          {result.poolCandidate.user.armedForcesStatus ===
            ArmedForcesStatus.Veteran && <Priority type="veteran" />}
          <Icon {...iconStyles} {...colorStyle} aria-label={name} />
        </span>
      </div>
    </Board.ListItem>
  );
};

interface AssessmentResultsProps {
  results: AssessmentResult[];
}
const AssessmentResults = ({ results }: AssessmentResultsProps) => {
  const sortedResults = sortResults(results);

  return (
    <Board.List>
      {sortedResults.map((result, index) => (
        <AssessmentResult key={result.id} result={result} ordinal={index + 1} />
      ))}
    </Board.List>
  );
};

export default AssessmentResults;
