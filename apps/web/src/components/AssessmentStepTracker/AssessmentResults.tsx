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
  AssessmentDecision,
} from "@gc-digital-talent/graphql";

import { getFullNameLabel } from "~/utils/nameUtils";
import { NO_DECISION } from "~/utils/assessmentResults";

import CandidateBookmark, {
  PoolCandidate_BookmarkFragment,
} from "../CandidateBookmark/CandidateBookmark";
import useRoutes from "../../hooks/useRoutes";
import {
  CandidateAssessmentResult,
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
  slots: {
    base: "flex w-full items-center gap-x-1.5 py-0.75",
    icon: "size-4 text-warning",
  },
  variants: {
    isBookmarked: {
      true: {
        base: "rounded bg-secondary-100 dark:bg-secondary-700",
      },
    },
    decision: {
      [NO_DECISION]: {
        icon: "text-warning",
      },
      [AssessmentDecision.Hold]: {
        icon: "text-primary",
      },
      [AssessmentDecision.Unsuccessful]: {
        icon: "text-error",
      },
      [AssessmentDecision.Successful]: {
        icon: "text-success",
      },
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
  const { base, icon: iconStyles } = assessmentResult({
    isBookmarked,
    decision: result.decision,
  });

  return (
    <Board.ListItem>
      <div className={base()}>
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
            {result.ordinal}
            {/* eslint-disable-next-line formatjs/no-literal-string-in-jsx */}
            {". "}
            {getFullNameLabel(
              result.poolCandidate.user.firstName,
              result.poolCandidate.user.lastName,
              intl,
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
            className={iconStyles()}
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
