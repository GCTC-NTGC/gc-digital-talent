import * as React from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";

import { commonMessages } from "@gc-digital-talent/i18n";
import { Pending, NotFound, Link, Separator } from "@gc-digital-talent/ui";

import SEO from "~/components/SEO/SEO";
import { Scalars, Team, useViewTeamQuery } from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";

import ViewTeam from "./components/ViewTeam";

type RouteParams = {
  teamId: Scalars["ID"];
};

interface ViewTeamContentProps {
  team: Team;
}

export const ViewTeamContent = ({ team }: ViewTeamContentProps) => {
  const intl = useIntl();
  const pageTitle = intl.formatMessage({
    defaultMessage: "Team information",
    id: "b+KdqW",
    description: "Title for team information page",
  });

  return (
    <>
      <SEO title={pageTitle} />
      <ViewTeam team={team} />
      <Separator
        decorative
        data-h2-margin="base(x2, 0, 0, 0)"
        data-h2-height="base(1px)"
        data-h2-background-color="base(black.2)"
        data-h2-border="base(none)"
      />
    </>
  );
};

const ViewTeamPage = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const { teamId } = useRequiredParams<RouteParams>("teamId");
  const [{ data, fetching, error }] = useViewTeamQuery({
    variables: { id: teamId },
  });

  const { state } = useLocation();
  const navigateTo = state?.from ?? routes.teamTable();

  return (
    <AdminContentWrapper>
      <Pending fetching={fetching} error={error}>
        {data?.team ? (
          <ViewTeamContent team={data.team} />
        ) : (
          <NotFound
            headingMessage={intl.formatMessage(commonMessages.notFound)}
          >
            <p>
              {intl.formatMessage(
                {
                  defaultMessage: "Team {teamId} not found.",
                  id: "VJYI6K",
                  description: "Message displayed for team not found.",
                },
                { teamId },
              )}
            </p>
          </NotFound>
        )}
      </Pending>
      <p data-h2-margin="base(x2, 0, 0, 0)">
        <Link mode="solid" color="secondary" href={navigateTo}>
          {intl.formatMessage({
            defaultMessage: "Back to teams",
            id: "LocjmN",
            description: "Button text to return to the table of teams page",
          })}
        </Link>
      </p>
    </AdminContentWrapper>
  );
};

export default ViewTeamPage;
