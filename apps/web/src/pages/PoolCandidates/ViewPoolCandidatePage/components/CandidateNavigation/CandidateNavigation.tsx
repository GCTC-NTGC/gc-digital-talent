import React from "react";
import { useIntl } from "react-intl";
import ArrowLeftCircleIcon from "@heroicons/react/20/solid/ArrowLeftCircleIcon";
import ArrowRightCircleIcon from "@heroicons/react/20/solid/ArrowRightCircleIcon";

import { Link, LinkProps } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";

import usePoolCandidateNavigation from "./usePoolCandidateNavigation";

interface CandidateNavigationProps {
  candidateId: string;
  poolId: string;
}

const CandidateNavigation = ({
  candidateId,
  poolId,
}: CandidateNavigationProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const candidateNavigation = usePoolCandidateNavigation(candidateId);
  if (!candidateNavigation) return null;
  const { nextCandidate, previousCandidate, lastCandidate, candidateIds } =
    candidateNavigation;

  const commonLinkProps: LinkProps = {
    color: "primary",
    mode: "inline",
    state: { candidateIds },
  };

  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-gap="base(x.5 0)"
    >
      {nextCandidate && (
        <Link
          href={paths.poolCandidateApplication(nextCandidate)}
          icon={ArrowRightCircleIcon}
          {...commonLinkProps}
        >
          {intl.formatMessage({
            defaultMessage: "Next candidate",
            id: "y1uo+J",
            description:
              "Link label to view next candidate on view pool candidate page",
          })}
        </Link>
      )}
      {previousCandidate && (
        <Link
          href={paths.poolCandidateApplication(previousCandidate)}
          icon={ArrowLeftCircleIcon}
          {...commonLinkProps}
        >
          {intl.formatMessage({
            defaultMessage: "Previous candidate",
            id: "mt4AkL",
            description:
              "Link label to view previous candidate on view pool candidate page",
          })}
        </Link>
      )}
      {lastCandidate && (
        <Link
          href={paths.screeningAndEvaluation(poolId)}
          icon={ArrowLeftCircleIcon}
          {...commonLinkProps}
        >
          {intl.formatMessage({
            defaultMessage: "Back to assessments tracker",
            id: "nUokX9",
            description: "Link label to return to assessment tracker",
          })}
        </Link>
      )}
    </div>
  );
};

export default CandidateNavigation;
