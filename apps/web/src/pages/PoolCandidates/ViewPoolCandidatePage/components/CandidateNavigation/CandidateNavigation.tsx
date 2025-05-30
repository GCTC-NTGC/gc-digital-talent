import { defineMessages, useIntl } from "react-intl";
import ArrowLeftCircleIcon from "@heroicons/react/20/solid/ArrowLeftCircleIcon";
import ArrowRightCircleIcon from "@heroicons/react/20/solid/ArrowRightCircleIcon";

import { IconLink, IconLinkProps, Link } from "@gc-digital-talent/ui";

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
  candidateName: string;
}

const CandidateNavigation = ({
  candidateId,
  candidateName,
}: CandidateNavigationProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const candidateNavigation = usePoolCandidateNavigation(candidateId);
  if (!candidateNavigation) return null;
  const { nextCandidate, previousCandidate, candidateIds, stepName } =
    candidateNavigation;

  const commonLinkProps: Partial<IconLinkProps> = {
    color: "secondary",
    className: "flex",
    state: { candidateIds, stepName },
  };

  return (
    <div
      data-h2-display="base(grid)"
      data-h2-align-items="base(center)"
      data-h2-grid-template-columns="base(x1 auto x1)"
      data-h2-gap="base(x.5)"
    >
      {previousCandidate && (
        <IconLink
          href={paths.poolCandidateApplication(previousCandidate)}
          icon={ArrowLeftCircleIcon}
          label={intl.formatMessage(messages.previousCandidate)}
          {...commonLinkProps}
        />
      )}
      <div data-h2-text-align="base(center)" data-h2-grid-column="base(2)">
        <p data-h2-color="base(primary.darker)" data-h2-font-weight="base(700)">
          {candidateName}
        </p>
        {stepName && (
          <p
            data-h2-color="base(black.70)"
            data-h2-font-size="base(caption)"
            data-h2-margin-top="base(x.25)"
          >
            {stepName}
          </p>
        )}
      </div>
      {nextCandidate && (
        <IconLink
          href={paths.poolCandidateApplication(nextCandidate)}
          icon={ArrowRightCircleIcon}
          label={intl.formatMessage(messages.nextCandidate)}
          {...commonLinkProps}
        />
      )}
    </div>
  );
};

export default CandidateNavigation;
