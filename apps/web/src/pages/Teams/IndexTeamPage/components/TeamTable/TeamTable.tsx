import React from "react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";

import { Pending } from "@gc-digital-talent/ui";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";

import {
  Team,
  useListTeamsQuery,
  useMeRoleAssignmentsQuery,
} from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";
import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import cells from "~/components/Table/cells";
import { normalizedText } from "~/components/Table/sortingFns";

import { MyRoleTeam } from "./types";
import {
  departmentAccessor,
  emailCell,
  myRolesAccessor,
  myRolesCell,
  roleAssignmentsToRoleTeamArray,
  viewCell,
} from "./helpers";

const columnHelper = createColumnHelper<Team>();

export interface TeamTableProps {
  teams: Array<Team>;
  myRolesAndTeams: Array<MyRoleTeam>;
  title: string;
}

export const TeamTable = ({
  teams,
  myRolesAndTeams,
  title,
}: TeamTableProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const { pathname, search, hash } = useLocation();
  const currentUrl = `${pathname}${search}${hash}`;

  const columns = [
    columnHelper.display({
      id: "actions",
      header: intl.formatMessage({
        defaultMessage: "Actions",
        id: "OxeGLu",
        description: "Title displayed for the team table actions column",
      }),
      cell: ({ row: { original: team } }) =>
        cells.actions({
          id: team.id,
          label: getLocalizedName(team.displayName, intl),
          editPathFunc: paths.teamUpdate,
        }),
    }),
    columnHelper.accessor((team) => getLocalizedName(team.displayName, intl), {
      id: "teamName",
      sortingFn: normalizedText,
      header: intl.formatMessage({
        defaultMessage: "Team",
        id: "KIWVbp",
        description: "Title displayed for the teams table team column.",
      }),
      cell: ({ row: { original: team }, getValue }) =>
        viewCell(paths.teamView(team.id), getValue(), intl, currentUrl),
      meta: {
        isRowTitle: true,
      },
    }),
    columnHelper.accessor(
      (team) => myRolesAccessor(team.id, myRolesAndTeams, intl),
      {
        id: "myRoles",
        sortingFn: normalizedText,
        header: intl.formatMessage({
          defaultMessage: "My Roles",
          id: "+agJAH",
          description:
            "Label displayed for the table's My Roles column header.",
        }),
        cell: ({ row: { original: team } }) =>
          myRolesCell(team.id, myRolesAndTeams, intl),
      },
    ),
    columnHelper.accessor((team) => departmentAccessor(team, intl), {
      id: "departments",
      sortingFn: normalizedText,
      header: intl.formatMessage({
        defaultMessage: "Department",
        id: "BDo1aH",
        description: "Title displayed for the teams table department column.",
      }),
    }),
    columnHelper.accessor("contactEmail", {
      id: "contactEmail",
      header: intl.formatMessage(commonMessages.email),
      cell: ({ getValue }) => emailCell(getValue() ?? "", intl),
    }),
  ] as ColumnDef<Team>[];

  const data = teams.filter(notEmpty);

  return (
    <Table<Team>
      caption={title}
      data={data}
      columns={columns}
      sort={{
        internal: true,
        initialState: [{ id: "myRoles", desc: true }],
      }}
      pagination={{
        internal: true,
        total: data.length,
        pageSizes: [10, 20, 50],
      }}
      search={{
        internal: true,
        label: intl.formatMessage({
          defaultMessage: "Search teams",
          id: "147mtW",
          description: "Label for the teams table search input",
        }),
      }}
      add={{
        linkProps: {
          href: paths.teamCreate(),
          label: intl.formatMessage({
            defaultMessage: "Create Team",
            id: "GtrrJ3",
            description: "Link text to create a new team in the admin portal",
          }),
          from: currentUrl,
        },
      }}
    />
  );
};

const TeamTableApi = ({ title }: { title: string }) => {
  const [{ data: dataTeam, fetching: fetchingTeam, error: errorTeam }] =
    useListTeamsQuery();
  const [{ data: dataMe, fetching: fetchingMe, error: errorMe }] =
    useMeRoleAssignmentsQuery();

  const isFetching = fetchingTeam || fetchingMe;

  const teams = dataTeam?.teams.filter(notEmpty);

  let myRolesAndTeams: MyRoleTeam[] = [];
  const roleAssignments =
    unpackMaybes(dataMe?.me?.authInfo?.roleAssignments) ?? [];
  myRolesAndTeams = roleAssignmentsToRoleTeamArray(roleAssignments);

  return (
    <Pending fetching={isFetching} error={errorTeam || errorMe}>
      <TeamTable
        teams={teams || []}
        myRolesAndTeams={myRolesAndTeams}
        title={title}
      />
    </Pending>
  );
};

export default TeamTableApi;
