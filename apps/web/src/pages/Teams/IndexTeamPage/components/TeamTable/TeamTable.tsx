import React, { useMemo } from "react";
import { IntlShape, useIntl } from "react-intl";

import { Pending, Link, Pill } from "@gc-digital-talent/ui";
import { useLocale } from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";

import {
  LocalizedString,
  Maybe,
  Team,
  useListTeamsQuery,
  useMeRoleAssignmentsQuery,
} from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";
import Table, {
  ColumnsOf,
  tableActionsAccessor,
  Cell,
} from "~/components/Table/ClientManagedTable";
import { RoleAssignment } from "@gc-digital-talent/graphql";

export interface TeamTableProps {
  teams: Array<Team>;
  myRolesAndTeams: Array<MyRoleTeam>;
}

type TeamCell = Cell<Team>;

export type MyRoleTeam = {
  teamId: string;
  roleName: LocalizedString;
};

// given an array of RoleAssignments
// generate an array of MyRoleTeam objects for team-based roles, filtering out individual roles and empty
// the returned array functions like a map
export const roleAssignmentsToRoleTeamArray = (
  roleAssignments: RoleAssignment[],
): MyRoleTeam[] => {
  let collection: Array<MyRoleTeam> = [];

  roleAssignments.forEach((roleAssignment) => {
    if (
      roleAssignment?.role &&
      roleAssignment.role.isTeamBased &&
      roleAssignment?.team &&
      roleAssignment.role.displayName
    ) {
      const newTeam: MyRoleTeam = {
        teamId: roleAssignment.team.id,
        roleName: roleAssignment.role.displayName,
      };

      collection = [newTeam, ...collection];
    }
  });

  return collection;
};

const viewAccessor = (url: string, label: Maybe<string>, intl: IntlShape) => (
  <Link href={url} type="link">
    {label ||
      intl.formatMessage({
        defaultMessage: "No name provided",
        id: "L9Ked5",
        description: "Fallback for team display name value",
      })}
  </Link>
);

const emailLinkAccessor = (email: Maybe<string>, intl: IntlShape) => {
  if (email) {
    return <a href={`mailto:${email}`}>{email}</a>;
  }
  return (
    <span data-h2-font-style="base(italic)">
      {intl.formatMessage({
        defaultMessage: "No email provided",
        id: "1JCjTP",
        description: "Fallback for email value",
      })}
    </span>
  );
};

const myRolesAccessor = (
  teamId: string,
  myRoleTeams: MyRoleTeam[],
  locale: "en" | "fr",
) => {
  // pull out roles associated with the (row's) team id passed in for generating searchable string
  const teamFiltered = myRoleTeams.filter(
    (roleTeam) => roleTeam.teamId && roleTeam.teamId === teamId,
  );

  let accessorString = "";

  if (teamFiltered.length > 0) {
    teamFiltered.forEach((roleTeam) => {
      accessorString = `${accessorString} ${roleTeam.roleName[locale]}`;
    });
  }

  return accessorString;
};

const myRolesCell = (
  teamId: string,
  myRoleTeams: MyRoleTeam[],
  locale: "en" | "fr",
) => {
  // pull out roles associated with the (row's) team id passed in for generating UI elements
  const teamFiltered = myRoleTeams.filter(
    (roleTeam) => roleTeam.teamId && roleTeam.teamId === teamId,
  );

  const rolesPillsArray = teamFiltered.map((roleTeam) => (
    <Pill
      color="primary"
      mode="outline"
      key={`${teamId}-${roleTeam.roleName.en}`}
    >
      {roleTeam.roleName[locale]}
    </Pill>
  ));

  return rolesPillsArray.length > 0 ? <span>{rolesPillsArray}</span> : null;
};

export const TeamTable = ({ teams, myRolesAndTeams }: TeamTableProps) => {
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
            label: d?.displayName ? d.displayName[locale] : d.name,
            editPathFunc: paths.teamUpdate,
          }),
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Team",
          id: "KIWVbp",
          description: "Title displayed for the teams table team column.",
        }),
        accessor: (d) => (d?.displayName ? d.displayName[locale] : d.name),
        Cell: ({ row, value }: TeamCell) =>
          viewAccessor(paths.teamView(row.original.id), value, intl),
        id: "teamName",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "My Roles",
          id: "aBNNL3",
          description: "Title displayed for the teams table my roles column.",
        }),
        accessor: (d) => myRolesAccessor(d.id, myRolesAndTeams, locale),
        Cell: ({ row }: TeamCell) =>
          myRolesCell(row.original.id, myRolesAndTeams, locale),
        id: "myRoles",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Department",
          id: "BDo1aH",
          description: "Title displayed for the teams table department column.",
        }),
        accessor: (d) =>
          d.departments?.length
            ? d.departments
                .map((department) =>
                  department?.name ? department.name[locale] : undefined,
                )
                .filter(notEmpty)
                .join(", ")
            : "",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Email",
          id: "TREL4U",
          description: "Title displayed for the teams table email column.",
        }),
        accessor: (d) => d.contactEmail,
        Cell: ({ value }: TeamCell) => emailLinkAccessor(value, intl),
      },
    ],
    [paths, intl, locale, myRolesAndTeams],
  );

  const data = useMemo(() => teams.filter(notEmpty), [teams]);
  const { initialSortBy } = useMemo(() => {
    return {
      initialSortBy: [
        {
          id: "myRoles",
          desc: true,
        },
      ],
    };
  }, []);

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
      initialSortBy={initialSortBy}
    />
  );
};

const TeamTableApi = () => {
  const [{ data: dataTeam, fetching: fetchingTeam, error: errorTeam }] =
    useListTeamsQuery();
  const [{ data: dataMe, fetching: fetchingMe, error: errorMe }] =
    useMeRoleAssignmentsQuery();

  const isFetching = fetchingTeam === true || fetchingMe === true;

  const teams = dataTeam?.teams.filter(notEmpty);

  const roleAssignments =
    dataMe?.me && dataMe.me?.roleAssignments ? dataMe.me.roleAssignments : null;

  let myRolesAndTeams: MyRoleTeam[] = [];
  if (roleAssignments && roleAssignments.length > 0) {
    myRolesAndTeams = roleAssignmentsToRoleTeamArray(roleAssignments);
  }

  return (
    <Pending fetching={isFetching} error={errorTeam || errorMe}>
      <TeamTable teams={teams || []} myRolesAndTeams={myRolesAndTeams} />
    </Pending>
  );
};

export default TeamTableApi;
