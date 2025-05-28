import { defineMessages, useIntl } from "react-intl";
import ChevronDoubleLeftIcon from "@heroicons/react/20/solid/ChevronDoubleLeftIcon";
import ChevronDoubleRightIcon from "@heroicons/react/20/solid/ChevronDoubleRightIcon";

import { Card, Link, LinkProps, Separator } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";

import useNominationNavigation from "./useNominationNavigation";

interface RouteParams extends Record<string, string> {
  eventId: string;
  talentNominationGroupId: string;
}

const messages = defineMessages({
  nextNomination: {
    defaultMessage: "Next nomination",
    id: "7+jEIT",
    description: "Link label to view next nomination page",
  },
  previousNomination: {
    defaultMessage: "Previous nomination",
    id: "M0rL3I",
    description: "Link label to view previous nomination page",
  },
  backToAssessments: {
    defaultMessage: "Back to nominations",
    id: "TzlRpv",
    description: "Link label to return to assessment tracker",
  },
});

const NominationNavigation = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const { eventId, talentNominationGroupId } = useRequiredParams<RouteParams>([
    "eventId",
    "talentNominationGroupId",
  ]);
  const nominationNavigation = useNominationNavigation(talentNominationGroupId);
  if (!nominationNavigation) return null;
  const { nextNomination, previousNomination, nominationIds } =
    nominationNavigation;

  const commonLinkProps: LinkProps = {
    color: "secondary",
    mode: "inline",
    block: true,
    state: { nominationIds },
    "data-h2-padding": "base(x.75 0)",
  };

  return (
    <Card
      data-h2-display="base(grid)"
      data-h2-align-items="base(center)"
      data-h2-grid-template-columns="base(1fr auto 1fr)"
      data-h2-padding="base(0)"
    >
      <span data-h2-flex-shrink="base(0)">
        {previousNomination && (
          <Link
            href={paths.talentNominationGroup(eventId, previousNomination)}
            icon={ChevronDoubleLeftIcon}
            aria-label={intl.formatMessage(messages.previousNomination)}
            {...commonLinkProps}
          >
            {intl.formatMessage({
              defaultMessage: "Previous",
              id: "Qhl5J9",
              description: "Link text to navigate to the previous item",
            })}
          </Link>
        )}
      </span>
      <Separator
        orientation="vertical"
        space="none"
        decorative
        data-h2-flex-shrink="base(1)"
      />
      <span data-h2-flex-shrink="base(0)">
        {nextNomination && (
          <Link
            href={paths.talentNominationGroup(eventId, nextNomination)}
            utilityIcon={ChevronDoubleRightIcon}
            aria-label={intl.formatMessage(messages.nextNomination)}
            {...commonLinkProps}
          >
            {intl.formatMessage({
              defaultMessage: "Next",
              id: "FuuXpa",
              description: "Link text to navigate to the next item",
            })}
          </Link>
        )}
      </span>
    </Card>
  );
};

export default NominationNavigation;
