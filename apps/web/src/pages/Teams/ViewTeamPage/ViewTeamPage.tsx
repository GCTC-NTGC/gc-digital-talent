import * as React from "react";
import { useIntl } from "react-intl";
import { BuildingOffice2Icon } from "@heroicons/react/24/outline";

import PageHeader from "@common/components/PageHeader";
import SEO from "@common/components/SEO/SEO";
import { Scalars, useViewTeamQuery } from "~/api/generated";

import { commonMessages } from "@common/messages";
import Pending from "@common/components/Pending";
import NotFound from "@common/components/NotFound";
import { useParams } from "react-router-dom";
import { ViewTeam } from "./components/ViewTeam";

type RouteParams = {
  teamId: Scalars["ID"];
};

export const ViewTeamApi = () => {
  const intl = useIntl();
  const { teamId } = useParams<RouteParams>();
  const [{ data, fetching, error }] = useViewTeamQuery({
    variables: { id: teamId || "" },
  });
  const pageTitle = intl.formatMessage({
    defaultMessage: "Team information",
    id: "SXoCma",
    description: "Page title for the view team page",
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.team ? (
        <>
          <PageHeader icon={BuildingOffice2Icon}>{pageTitle}</PageHeader>
          <p>{data.team.displayName?.en}</p>
          <ViewTeam team={data.team} />
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

  const pageTitle = intl.formatMessage({
    defaultMessage: "Team information",
    id: "SXoCma",
    description: "Page title for the view team page",
  });

  return (
    <>
      <SEO title={pageTitle} />
      <ViewTeamApi />
    </>
  );
};

export default ViewTeamPage;
