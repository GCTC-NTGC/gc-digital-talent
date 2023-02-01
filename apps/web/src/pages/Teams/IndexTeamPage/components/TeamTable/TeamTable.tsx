import React, { useMemo } from "react";
import { useIntl } from "react-intl";

import useLocale from "@common/hooks/useLocale";
import { notEmpty } from "@common/helpers/util";
import Pending from "@common/components/Pending";
import fakeTeams from "@common/fakeData/fakeTeams";

// import {Team, useListTeamsQuery} from "~/api/generated"
import useRoutes from "~/hooks/useRoutes";
import Table, {
  ColumnsOf,
  tableActionsAccessor,
} from "~/components/Table/ClientManagedTable";

// TO DO: Remove after #5548
import { Department } from "~/api/generated";

type Team = {
  id: string;
  name: string;
  contactEmail: string;
  displayName: {
    en: string;
    fr: string;
  };
  departments: Department[];
};

interface TeamTableProps {
  teams: Array<Team>;
}

const mockTeams = fakeTeams();

export const TeamTable = ({ teams }: TeamTableProps) => {
  const intl = useIntl();
  const { locale } = useLocale();
  const paths = useRoutes();

  const columns = useMemo<ColumnsOf<Team>>(
    () => [
      {
        Header: intl.formatMessage({
          defaultMessage: "Actions",
          id: "OxeGLu",
          description: "Title displayed for the team table actions column",
        }),
        accessor: (d) =>
          tableActionsAccessor({
            id: d.id,
            label: d.displayName[locale],
            editPathFunc: paths.teamUpdate,
          }),
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Team",
          id: "KIWVbp",
          description: "Title displayed for the teams table team column.",
        }),
        accessor: (d) => d.displayName?.[locale],
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Department",
          id: "BDo1aH",
          description: "Title displayed for the teams table department column.",
        }),
        accessor: (d) => d.departments[0].name?.[locale],
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Email",
          id: "TREL4U",
          description: "Title displayed for the teams table email column.",
        }),
        accessor: (d) => d.contactEmail,
      },
    ],
    [paths, intl, locale],
  );

  const data = useMemo(() => teams.filter(notEmpty), [teams]);

  return (
    <Table
      data={data}
      columns={columns}
      addBtn={{
        path: paths.teamCreate(),
        label: intl.formatMessage({
          defaultMessage: "Create Team",
          id: "GtrrJ3",
          description: "Link text to create a new team in the admin portal",
        }),
      }}
    />
  );
};

const wait = (amount = 0) =>
  // Note: Just a mock for now
  // eslint-disable-next-line no-promise-executor-return
  new Promise((resolve) => setTimeout(resolve, amount));

const TeamTableApi = () => {
  // Mock API Request
  const [fetching, setFetching] = React.useState(true);
  React.useEffect(() => {
    wait(500).then(() => setFetching(false));
  }, []);

  return (
    <Pending fetching={fetching}>
      <TeamTable teams={mockTeams || []} />
    </Pending>
  );
};

export default TeamTableApi;
