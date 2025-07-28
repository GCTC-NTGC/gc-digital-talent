import { useState } from "react";
import { useIntl } from "react-intl";
import { tv } from "tailwind-variants";

import { Board, Link, Well } from "@gc-digital-talent/ui";
import {
  Maybe,
  Scalars,
  ArmedForcesStatus,
  AssessmentStepType,
  FragmentType,
  ClaimVerificationResult,
} from "@gc-digital-talent/graphql";

import { getFullNameLabel } from "~/utils/nameUtils";

import CandidateBookmark, {
  PoolCandidate_BookmarkFragment,
} from "../CandidateBookmark/CandidateBookmark";
import useRoutes from "../../hooks/useRoutes";
import {
  CandidateAssessmentResult,
  decisionIcon,
  getDecisionInfo,
  sortResultsAndAddOrdinal,
} from "./utils";

interface PriorityProps {
  type: "veteran" | "entitlement";
}

const Priority = ({ type }: PriorityProps) => {
  const intl = useIntl();

  return (
    <span className="inline-flex items-center rounded-md bg-black px-0.75 text-2xs font-bold text-white">
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

const assessmentResult = tv({
  base: "flex w-full items-center gap-x-1.5 py-0.75",
  variants: {
    isBookmarked: {
      true: "rounded-md bg-secondary-100 dark:bg-secondary-700",
    },
  },
});

interface AssessmentResultProps {
  result: CandidateAssessmentResult & { ordinal: number };
  isApplicationStep: boolean;
  stepName: string;
  candidateIds: Scalars["UUID"]["output"][];
}

const AssessmentResult = ({
  result,
  isApplicationStep,
  candidateIds,
  stepName,
}: AssessmentResultProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const [isBookmarked, setIsBookmarked] = useState<boolean>(
    result.poolCandidate?.isBookmarked ?? false,
  );

  // We should always have one, but if not, don't show anything
  if (!result.poolCandidate) return null;

  const { icon, name } = getDecisionInfo(
    result.decision,
    isApplicationStep,
    intl,
  );
  const Icon = icon;

  return (
    <Board.ListItem>
      <div className={assessmentResult({ isBookmarked })}>
        <CandidateBookmark
          candidateQuery={
            result.poolCandidate as FragmentType<
              typeof PoolCandidate_BookmarkFragment
            >
          }
          bookmarked={isBookmarked}
          onBookmarkChange={setIsBookmarked}
        />
        <span className="grow">
          <Link
            mode="text"
            color="black"
            href={paths.poolCandidateApplication(result.poolCandidate.id)}
            state={{ candidateIds, stepName }}
          >
            {intl.formatMessage(
              {
                defaultMessage: "{ordinal}. {label}",
                id: "fPGs32",
                description: "Formatted ordinal and label",
              },
              {
                ordinal: result.ordinal,
                label: getFullNameLabel(
                  result.poolCandidate.user.firstName,
                  result.poolCandidate.user.lastName,
                  intl,
                ),
              },
            )}
          </Link>
        </span>
        <span className="flex shrink-0 items-center gap-x-0.75">
          {result.poolCandidate.user.hasPriorityEntitlement &&
            result.poolCandidate.priorityVerification !==
              ClaimVerificationResult.Rejected && (
              <Priority type="entitlement" />
            )}
          {result.poolCandidate.user.armedForcesStatus?.value ===
            ArmedForcesStatus.Veteran &&
            result.poolCandidate.veteranVerification !==
              ClaimVerificationResult.Rejected && <Priority type="veteran" />}
          <Icon
            className={decisionIcon({ decision: result.decision })}
            aria-hidden="false"
            aria-label={name}
          />
        </span>
      </div>
    </Board.ListItem>
  );
};

interface AssessmentResultsProps {
  results: CandidateAssessmentResult[];
  stepType?: Maybe<AssessmentStepType>;
  stepName: string;
}

const AssessmentResults = ({
  results,
  stepType,
  stepName,
}: AssessmentResultsProps) => {
  const intl = useIntl();
  const sortedResults = sortResultsAndAddOrdinal(results);
  const candidateIds = sortedResults.map((result) => result.poolCandidate.id);
  const isApplicationStep =
    stepType === AssessmentStepType.ApplicationScreening;

  return sortedResults.length ? (
    <Board.List>
      {sortedResults.map((result) => (
        <AssessmentResult
          candidateIds={candidateIds}
          key={result.poolCandidate.id}
          result={{ ...result }}
          stepName={stepName}
          isApplicationStep={isApplicationStep}
        />
      ))}
    </Board.List>
  ) : (
    <Well fontSize="caption" className="m-3">
      <p>
        {intl.formatMessage({
          defaultMessage: "There are no candidate results in this step.",
          id: "BCBPYT",
          description:
            "Message displayed when no candidates are being assessed in a step",
        })}
      </p>
    </Well>
  );
};

export default AssessmentResults;
