import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";
import { useQuery } from "urql";

import { Pending } from "@gc-digital-talent/ui";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import {
  FragmentType,
  getFragment,
  graphql,
  TeamTable_TeamFragment as TeamTableTeamFragmentType,
} from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import cells from "~/components/Table/cells";
import { normalizedText } from "~/components/Table/sortingFns";
import adminMessages from "~/messages/adminMessages";

import { MyRoleTeam } from "./types";
import {
  departmentAccessor,
  emailCell,
  myRolesAccessor,
  myRolesCell,
  roleAssignmentsToRoleTeamArray,
  viewCell,
} from "./helpers";

const columnHelper = createColumnHelper<TeamTableTeamFragmentType>();

export const TeamTable_TeamFragment = graphql(/* GraphQL */ `
  fragment TeamTable_Team on Team {
    id
    contactEmail
    name
    displayName {
      en
      fr
    }
    departments {
      id
      name {
        en
        fr
      }
    }
  }
`);

type TeamTableFragment = FragmentType<typeof TeamTable_TeamFragment>[];

export interface TeamTableProps {
  teamsQuery: TeamTableFragment;
  myRolesAndTeams: Array<MyRoleTeam>;
  title: string;
}

export const TeamTable = ({
  teamsQuery,
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
      header: intl.formatMessage(adminMessages.team),
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
      header: intl.formatMessage(commonMessages.department),
    }),
    columnHelper.accessor("contactEmail", {
      id: "contactEmail",
      header: intl.formatMessage(commonMessages.email),
      cell: ({ getValue }) => emailCell(getValue() ?? "", intl),
    }),
  ] as ColumnDef<TeamTableTeamFragmentType>[];

  const data = teamsQuery
    .map((abc) => getFragment(TeamTable_TeamFragment, abc))
    .filter(notEmpty);

  return (
    <Table<TeamTableTeamFragmentType>
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
      nullMessage={{
        description: intl.formatMessage({
          defaultMessage: 'Use the "Create Team" button to get started.',
          id: "+zSc5y",
          description: "Instructions for adding a team item.",
        }),
      }}
    />
  );
};

const TeamTableData_Query = graphql(/* GraphQL */ `
  query TeamTableData {
    teams {
      ...TeamTable_Team
    }

    me {
      authInfo {
        id
        roleAssignments {
          id
          role {
            id
            name
            displayName {
              en
              fr
            }
            isTeamBased
          }
          team {
            id
            name
          }
        }
      }
    }
  }
`);

const TeamTableApi = ({ title }: { title: string }) => {
  const [{ data, fetching, error }] = useQuery({ query: TeamTableData_Query });

  const teamsQuery = unpackMaybes(data?.teams);

  let myRolesAndTeams: MyRoleTeam[] = [];
  const roleAssignments = unpackMaybes(data?.me?.authInfo?.roleAssignments);
  myRolesAndTeams = roleAssignmentsToRoleTeamArray(roleAssignments);

  return (
    <Pending fetching={fetching} error={error}>
      <TeamTable
        teamsQuery={teamsQuery}
        myRolesAndTeams={myRolesAndTeams}
        title={title}
      />
    </Pending>
  );
};

export default TeamTableApi;
