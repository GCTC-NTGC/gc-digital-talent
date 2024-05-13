import React from "react";
import { defineMessages, useIntl } from "react-intl";
import ArrowLeftCircleIcon from "@heroicons/react/20/solid/ArrowLeftCircleIcon";
import ArrowRightCircleIcon from "@heroicons/react/20/solid/ArrowRightCircleIcon";

import { Link, LinkProps } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";

import usePoolCandidateNavigation from "./usePoolCandidateNavigation";

const messages = defineMessages({
  nextCandidate: {
    defaultMessage: "Next candidate",
    id: "y1uo+J",
    description:
      "Link label to view next candidate on view pool candidate page",
  },
  previousCandidate: {
    defaultMessage: "Previous candidate",
    id: "mt4AkL",
    description:
      "Link label to view previous candidate on view pool candidate page",
  },
  backToAssessments: {
    defaultMessage: "Back to assessments tracker",
    id: "nUokX9",
    description: "Link label to return to assessment tracker",
  },
});

interface CandidateNavigationProps {
  candidateId: string;
  poolId: string;
  candidateName: string;
}

const CandidateNavigation = ({
  candidateId,
  poolId,
  candidateName,
}: CandidateNavigationProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const candidateNavigation = usePoolCandidateNavigation(candidateId);
  if (!candidateNavigation) return null;
  const {
    nextCandidate,
    previousCandidate,
    lastCandidate,
    candidateIds,
    stepName,
  } = candidateNavigation;

  const commonLinkProps: LinkProps = {
    color: "primary",
    mode: "inline",
    state: { candidateIds, stepName },
  };

  return (
    <div
      data-h2-display="base(flex)"
      data-h2-align-items="base(center)"
      data-h2-justify-content="base(space-between)"
      data-h2-gap="base(x.5)"
    >
      {previousCandidate && (
        <Link
          href={paths.poolCandidateApplication(previousCandidate)}
          icon={ArrowLeftCircleIcon}
          aria-label={intl.formatMessage(messages.previousCandidate)}
          {...commonLinkProps}
        >
          <span data-h2-visually-hidden="base(invisible)">
            {intl.formatMessage(messages.previousCandidate)}
          </span>
        </Link>
      )}
      {stepName && (
        <div
          {...(!previousCandidate
            ? { "data-h2-text-align": "base(left)" }
            : { "data-h2-text-align": "base(center)" })}
        >
          <p
            data-h2-color="base(primary.darker)"
            data-h2-font-weight="base(700)"
            data-h2-margin-bottom="base(x.25)"
          >
            {candidateName}
          </p>
          <p data-h2-color="base(black.70)" data-h2-font-size="base(caption)">
            {stepName}
          </p>
        </div>
      )}
      {nextCandidate && (
        <Link
          href={paths.poolCandidateApplication(nextCandidate)}
          icon={ArrowRightCircleIcon}
          aria-label={intl.formatMessage(messages.nextCandidate)}
          {...commonLinkProps}
          data-h2-margin-right="base(0)"
        >
          <span data-h2-visually-hidden="base(invisible)">
            {intl.formatMessage(messages.nextCandidate)}
          </span>
        </Link>
      )}
      {lastCandidate && (
        <Link
          href={paths.screeningAndEvaluation(poolId)}
          icon={ArrowLeftCircleIcon}
          aria-label={intl.formatMessage(messages.backToAssessments)}
          {...commonLinkProps}
        >
          <span data-h2-visually-hidden="base(invisible)">
            {intl.formatMessage(messages.backToAssessments)}
          </span>
        </Link>
      )}
    </div>
  );
};

export default CandidateNavigation;
