import React from "react";
import { IntlShape, useIntl } from "react-intl";
import { Team } from "~/api/generated";

interface ViewTeamProps {
  team: Team;
}

export const ViewTeam = ({ team }: ViewTeamProps) => {
  const intl = useIntl();

  return <p />;
};

export default ViewTeam;
