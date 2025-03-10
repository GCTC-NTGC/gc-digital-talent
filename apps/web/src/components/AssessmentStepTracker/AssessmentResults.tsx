import { useState } from "react";
import { useIntl } from "react-intl";

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
  getDecisionInfo,
  sortResultsAndAddOrdinal,
} from "./utils";

interface PriorityProps {
  type: "veteran" | "entitlement";
}

const Priority = ({ type }: PriorityProps) => {
  const intl = useIntl();

  return (
    <span
      data-h2-align-items="base(center)"
      data-h2-display="base(inline-flex)"
      data-h2-background-color="base(black) base:dark(white)"
      data-h2-color="base(white) base:dark(black)"
      data-h2-padding="base(0 x.125)"
      data-h2-radius="base(rounded)"
      data-h2-font-weight="base(700)"
      data-h2-transition="base(all .2s ease)"
    >
      <span data-h2-line-height="base(1)" data-h2-font-size="base(0.6rem)">
        {type === "veteran"
          ? intl.formatMessage({
              defaultMessage: "VA",
              id: "KXy+Ei",
              description: "Short form code representing 'veteran'",
            })
          : intl.formatMessage({
              defaultMessage: "P",
              id: "nzF0AE",
              description:
                "Short form code representing 'priority entitlement'",
            })}
      </span>
    </span>
  );
};

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

  const { icon, colorStyle, name } = getDecisionInfo(
    result.decision,
    isApplicationStep,
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
        data-h2-padding="base(x.125 0)"
        data-h2-width="base(100%)"
        {...(isBookmarked && {
          "data-h2-radius": "base(5px)",
          "data-h2-background-color": "base(primary.lightest)",
        })}
      >
        <CandidateBookmark
          candidateQuery={
            result.poolCandidate as FragmentType<
              typeof PoolCandidate_BookmarkFragment
            >
          }
          bookmarked={isBookmarked}
          onBookmarkChange={setIsBookmarked}
        />
        <span data-h2-flex-grow="base(1)">
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
        <span
          data-h2-flex-shrink="base(0)"
          data-h2-display="base(flex)"
          data-h2-align-items="base(center)"
          data-h2-gap="base(0 x.125)"
        >
          {result.poolCandidate.user.hasPriorityEntitlement &&
            result.poolCandidate.priorityVerification !==
              ClaimVerificationResult.Rejected && (
              <Priority type="entitlement" />
            )}
          {result.poolCandidate.user.armedForcesStatus?.value ===
            ArmedForcesStatus.Veteran &&
            result.poolCandidate.veteranVerification !==
              ClaimVerificationResult.Rejected && <Priority type="veteran" />}
          <Icon {...iconStyles} {...colorStyle} aria-label={name} />
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
    <Well fontSize="caption" data-h2-margin="base(x.25)">
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
