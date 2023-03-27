import React, { useMemo } from "react";
import { IntlShape, useIntl } from "react-intl";

import { Pending, Link } from "@gc-digital-talent/ui";
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

interface TeamTableProps {
  teams: Array<Team>;
  myRolesTeams: Array<MyRoleTeam>;
}

type TeamCell = Cell<Team>;

type MyRoleTeam = {
  teamId: string;
  roleName: LocalizedString;
};

const roleAssignmentsToTeamArray = (
  roleAssignments: RoleAssignment[],
): MyRoleTeam[] => {
  //
  let collection: Array<MyRoleTeam> = [];

  roleAssignments.forEach((roleAssignment) => {
    //
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

export const TeamTable = ({ teams, myRolesTeams }: TeamTableProps) => {
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
    [paths, intl, locale],
  );

  const data = useMemo(() => teams.filter(notEmpty), [teams]);
  const { initialSortBy } = useMemo(() => {
    return {
      initialSortBy: [
        {
          id: "teamName",
          desc: false,
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
    //
    myRolesAndTeams = roleAssignmentsToTeamArray(roleAssignments);
  }

  return (
    <Pending fetching={isFetching} error={errorTeam || errorMe}>
      <TeamTable teams={teams || []} myRolesTeams={myRolesAndTeams || []} />
    </Pending>
  );
};

export default TeamTableApi;
