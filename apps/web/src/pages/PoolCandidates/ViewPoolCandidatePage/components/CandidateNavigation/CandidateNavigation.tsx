import { defineMessages, useIntl } from "react-intl";
import ChevronDoubleRightIcon from "@heroicons/react/16/solid/ChevronDoubleRightIcon";
import ChevronDoubleLeftIcon from "@heroicons/react/16/solid/ChevronDoubleLeftIcon";
import { useLocation } from "react-router";

import {
  Card,
  LinkProps,
  Link,
  Separator,
  Loading,
} from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";

import usePoolCandidateNavigation, {
  NavigationState,
} from "./usePoolCandidateNavigation";

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

const commonLinkProps: Partial<LinkProps> = {
  color: "primary",
  mode: "inline",
  block: true,
};

interface LocationState {
  state?: NavigationState;
}

const CandidateNavigation = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const { state } = useLocation() as LocationState;
  const { next, prev, fetching } = usePoolCandidateNavigation(state);

  if (fetching) return <Loading inline />;

  if (!next && !prev) return null;

  return (
    <Card
      space="sm"
      className="relative grid grid-cols-2 items-center justify-between gap-x-3"
    >
      <div>
        {prev && (
          <Link
            href={paths.poolCandidateApplication(prev.id)}
            state={{ ...state, currentCursor: prev.cursor }}
            icon={ChevronDoubleLeftIcon}
            {...commonLinkProps}
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
        {next && (
          <Link
            href={paths.poolCandidateApplication(next.id)}
            state={{ ...state, currentCursor: next.cursor }}
            utilityIcon={ChevronDoubleRightIcon}
            {...commonLinkProps}
          >
            {intl.formatMessage(messages.nextCandidate)}
          </Link>
        )}
      </div>
    </Card>
  );
};

export default CandidateNavigation;
