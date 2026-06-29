import { defineMessages, useIntl } from "react-intl";
import ChevronDoubleRightIcon from "@heroicons/react/16/solid/ChevronDoubleRightIcon";
import ChevronDoubleLeftIcon from "@heroicons/react/16/solid/ChevronDoubleLeftIcon";

import { Card, Link, Separator } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";
import usePoolCandidateNavigation from "~/hooks/usePoolCandidateNavigation";

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
}

const CandidateNavigation = ({ candidateId }: CandidateNavigationProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const candidateNavigation = usePoolCandidateNavigation(candidateId);
  if (!candidateNavigation) return null;

  const {
    nextCandidate,
    previousCandidate,
    hasPrevious,
    hasNext,
    navigationState,
    stepName,
  } = candidateNavigation;
  // hasPrevious/hasNext are based on position bounds (known immediately from state),
  // while previousCandidate/nextCandidate are resolved after the query completes.
  if (!hasPrevious && !hasNext) return null;

  const prevState = {
    navigationState: {
      ...navigationState,
      currentPage: Math.max(1, navigationState.currentPage - 1),
    },
    stepName,
  };

  const nextState = {
    navigationState: {
      ...navigationState,
      currentPage: navigationState.currentPage + 1,
    },
    stepName,
  };

  return (
    <Card
      space="sm"
      className="relative grid grid-cols-2 items-center justify-between gap-x-3"
    >
      <div>
        {previousCandidate && (
          <Link
            href={paths.poolCandidateApplication(previousCandidate)}
            icon={ChevronDoubleLeftIcon}
            color="primary"
            mode="inline"
            state={prevState}
            block
          >
            {intl.formatMessage(messages.previousCandidate)}
          </Link>
        )}
      </div>
      <Separator
        decorative
        orientation="vertical"
        space="none"
        className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2"
      />
      <div>
        {nextCandidate && (
          <Link
            href={paths.poolCandidateApplication(nextCandidate)}
            utilityIcon={ChevronDoubleRightIcon}
            color="primary"
            mode="inline"
            state={nextState}
            block
          >
            {intl.formatMessage(messages.nextCandidate)}
          </Link>
        )}
      </div>
    </Card>
  );
};

export default CandidateNavigation;
