import { defineMessages, useIntl } from "react-intl";
import ArrowLeftCircleIcon from "@heroicons/react/20/solid/ArrowLeftCircleIcon";
import ArrowRightCircleIcon from "@heroicons/react/20/solid/ArrowRightCircleIcon";

import { IconLink, IconLinkProps } from "@gc-digital-talent/ui";

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
    size: "lg",
    className: "flex shrink-0",
    state: { candidateIds, stepName },
  };

  return (
    <div className="grid grid-cols-[1.5rem_auto_1.5rem] items-center gap-3">
      {previousCandidate && (
        <IconLink
          href={paths.poolCandidateApplication(previousCandidate)}
          icon={ArrowLeftCircleIcon}
          label={intl.formatMessage(messages.previousCandidate)}
          {...commonLinkProps}
        />
      )}
      <div className="col-start-2 text-center">
        <p className="font-bold text-secondary-500 dark:text-secondary-200">
          {candidateName}
        </p>
        {stepName && (
          <p className="mt-1.5 text-sm text-black/70 dark:text-white/70">
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
