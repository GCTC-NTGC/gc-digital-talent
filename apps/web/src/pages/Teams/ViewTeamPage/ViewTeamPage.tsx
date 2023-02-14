import * as React from "react";
import { useIntl } from "react-intl";
import { BuildingOffice2Icon } from "@heroicons/react/24/outline";
import { Scalars, useViewTeamQuery } from "~/api/generated";
import { useParams } from "react-router-dom";
import PageHeader from "@common/components/PageHeader";
import SEO from "@common/components/SEO/SEO";
import { commonMessages } from "@common/messages";
import Pending from "@common/components/Pending";
import NotFound from "@common/components/NotFound";
import Link from "@common/components/Link";
import useRoutes from "~/hooks/useRoutes";
import Heading from "@common/components/Heading";
import useLocale from "@common/hooks/useLocale";
import { ViewTeam } from "./components/ViewTeam";

type RouteParams = {
  teamId: Scalars["ID"];
};

interface ViewTeamApiProps {
  pageTitle: string;
}

export const ViewTeamApi = ({ pageTitle }: ViewTeamApiProps) => {
  const intl = useIntl();
  const { locale } = useLocale();
  const { teamId } = useParams<RouteParams>();
  const [{ data, fetching, error }] = useViewTeamQuery({
    variables: { id: teamId || "" },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.team ? (
        <>
          <PageHeader icon={BuildingOffice2Icon}>{pageTitle}</PageHeader>
          <Heading size="h4" level="h4" data-h2-margin-left="base(x3)">
            {data.team.displayName?.[locale]}
          </Heading>
          <hr
            data-h2-margin="base(x2, 0, 0, 0)"
            data-h2-height="base(1px)"
            data-h2-background-color="base(dt-gray)"
            data-h2-border="base(none)"
          />
          <ViewTeam team={data.team} />
          <hr
            data-h2-margin="base(x2, 0, 0, 0)"
            data-h2-height="base(1px)"
            data-h2-background-color="base(dt-gray)"
            data-h2-border="base(none)"
          />
        </>
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
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
  );
};

const ViewTeamPage = () => {
  const intl = useIntl();
  const paths = useRoutes();

  const pageTitle = intl.formatMessage({
    defaultMessage: "Team information",
    id: "SXoCma",
    description: "Page title for the view team page",
  });

  return (
    <>
      <SEO title={pageTitle} />
      <ViewTeamApi pageTitle={pageTitle} />
      <p data-h2-margin="base(x2, 0, 0, 0)">
        <Link
          type="button"
          mode="solid"
          color="secondary"
          href={paths.teamTable()}
        >
          {intl.formatMessage({
            defaultMessage: "Back to teams",
            id: "LocjmN",
            description: "Button text to return to the table of teams page",
          })}
        </Link>
      </p>
    </>
  );
};

export default ViewTeamPage;
