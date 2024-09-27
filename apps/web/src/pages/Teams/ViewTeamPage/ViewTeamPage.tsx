import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";
import { useQuery } from "urql";

import { commonMessages } from "@gc-digital-talent/i18n";
import { Pending, NotFound, Link, Separator } from "@gc-digital-talent/ui";
import { Scalars, graphql } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

import ViewTeam, { ViewTeamPageFragment } from "./components/ViewTeam";

interface RouteParams {
  teamId: Scalars["ID"]["output"];
}

interface ViewTeamContentProps {
  teamQuery: ViewTeamPageFragment;
}

export const ViewTeamContent = ({ teamQuery }: ViewTeamContentProps) => {
  const intl = useIntl();
  const pageTitle = intl.formatMessage({
    defaultMessage: "Team information",
    id: "b+KdqW",
    description: "Title for team information page",
  });

  return (
    <>
      <SEO title={pageTitle} />
      <ViewTeam teamQuery={teamQuery} />
      <Separator data-h2-margin="base(x2, 0, 0, 0)" />
    </>
  );
};

const ViewTeam_Query = graphql(/* GraphQL */ `
  query ViewTeam($id: UUID!) {
    team(id: $id) {
      ...ViewTeamPage_Team
    }
  }
`);

const ViewTeamPage = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const { teamId } = useRequiredParams<RouteParams>("teamId");
  const [{ data, fetching, error }] = useQuery({
    query: ViewTeam_Query,
    variables: { id: teamId },
  });

  const { state } = useLocation();
  const navigateTo = state?.from ?? routes.teamTable();

  return (
    <AdminContentWrapper>
      <Pending fetching={fetching} error={error}>
        {data?.team ? (
          <ViewTeamContent teamQuery={data.team} />
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

export const Component = () => (
  <RequireAuth
    roles={[
      ROLE_NAME.PoolOperator,
      ROLE_NAME.CommunityManager,
      ROLE_NAME.PlatformAdmin,
    ]}
  >
    <ViewTeamPage />
  </RequireAuth>
);

Component.displayName = "AdminViewTeamPage";

export default ViewTeamPage;
