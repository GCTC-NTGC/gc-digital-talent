import React, { useMemo } from "react";
import { IntlShape, useIntl } from "react-intl";

import { Pending, Link, Pill } from "@gc-digital-talent/ui";
import { getLocalizedName, useLocale } from "@gc-digital-talent/i18n";
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
  title: string;
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
  <Link href={url} color="black">
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
    return (
      <Link color="black" external href={`mailto:${email}`}>
        {email}
      </Link>
    );
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
  intl: IntlShape,
) => {
  // pull out roles associated with the (row's) team id passed in for generating searchable string
  const teamFiltered = myRoleTeams.filter(
    (roleTeam) => roleTeam.teamId && roleTeam.teamId === teamId,
  );
  const accessorString = teamFiltered
    .map((roleTeam) => getLocalizedName(roleTeam.roleName, intl))
    .join(", ");

  return accessorString;
};

const myRolesCell = (
  teamId: string,
  myRoleTeams: MyRoleTeam[],
  intl: IntlShape,
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
      {getLocalizedName(roleTeam.roleName, intl)}
    </Pill>
  ));

  return rolesPillsArray.length > 0 ? <span>{rolesPillsArray}</span> : null;
};

export const TeamTable = ({
  teams,
  myRolesAndTeams,
  title,
}: TeamTableProps) => {
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
          id: "+agJAH",
          description:
            "Label displayed for the table's My Roles column header.",
        }),
        accessor: (d) => myRolesAccessor(d.id, myRolesAndTeams, intl),
        Cell: ({ row }: TeamCell) =>
          myRolesCell(row.original.id, myRolesAndTeams, intl),
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
      title={title}
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
  if (dataMe?.me?.roleAssignments) {
    myRolesAndTeams = roleAssignmentsToRoleTeamArray(dataMe.me.roleAssignments);
  }

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
