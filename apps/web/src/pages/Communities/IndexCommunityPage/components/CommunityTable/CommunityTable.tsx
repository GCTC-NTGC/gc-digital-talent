import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useIntl } from "react-intl";
import { useLocation } from "react-router";
import { useQuery } from "urql";

import { Pending } from "@gc-digital-talent/ui";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import {
  FragmentType,
  getFragment,
  graphql,
  CommunityTable_CommunityFragment as CommunityTableCommunityFragmentType,
} from "@gc-digital-talent/graphql";
import { hasRole, ROLE_NAME, useAuthorization } from "@gc-digital-talent/auth";

import useRoutes from "~/hooks/useRoutes";
import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import { normalizedText } from "~/components/Table/sortingFns";
import adminMessages from "~/messages/adminMessages";

import { MyRoleTeam } from "./types";
import {
  myRolesAccessor,
  myRolesCell,
  roleAssignmentsToRoleTeamArray,
  viewCell,
} from "./helpers";

const columnHelper = createColumnHelper<CommunityTableCommunityFragmentType>();

export const CommunityTable_CommunityFragment = graphql(/* GraphQL */ `
  fragment CommunityTable_Community on Community {
    id
    name {
      en
      fr
    }
  }
`);

type CommunityTableFragment = FragmentType<
  typeof CommunityTable_CommunityFragment
>[];

interface CommunityTableProps {
  communitiesQuery: CommunityTableFragment;
  myRolesAndTeams: MyRoleTeam[];
  title: string;
}

export const CommunityTable = ({
  communitiesQuery,
  myRolesAndTeams,
  title,
}: CommunityTableProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const { pathname, search, hash } = useLocation();
  const currentUrl = `${pathname}${search}${hash}`;

  const columns = [
    columnHelper.accessor(
      (community) => getLocalizedName(community.name, intl),
      {
        id: "communityName",
        sortingFn: normalizedText,
        header: intl.formatMessage(commonMessages.name),
        cell: ({ row: { original: community }, getValue }) =>
          viewCell(
            paths.communityView(community.id),
            getValue(),
            intl,
            currentUrl,
          ),
        meta: {
          isRowTitle: true,
        },
      },
    ),
    columnHelper.accessor(
      (community) => myRolesAccessor(community.id, myRolesAndTeams, intl),
      {
        id: "myRoles",
        sortingFn: normalizedText,
        header: intl.formatMessage({
          defaultMessage: "My roles",
          id: "iEIzSc",
          description: "Label displayed for the table column header My roles",
        }),
        cell: ({ row: { original: community } }) =>
          myRolesCell(community.id, myRolesAndTeams, intl),
      },
    ),
  ] as ColumnDef<CommunityTableCommunityFragmentType>[];

  const data = communitiesQuery
    .map((abc) => getFragment(CommunityTable_CommunityFragment, abc))
    .filter(notEmpty);

  const { roleAssignments } = useAuthorization();
  const canCreateMembers = hasRole([ROLE_NAME.PlatformAdmin], roleAssignments);

  return (
    <Table<CommunityTableCommunityFragmentType>
      caption={title}
      data={data}
      columns={columns}
      sort={{
        internal: true,
        initialState: [{ id: "communityName", desc: true }],
      }}
      pagination={{
        internal: true,
        total: data.length,
        pageSizes: [10, 20, 50],
      }}
      search={{
        internal: true,
        label: intl.formatMessage(adminMessages.searchByKeyword),
      }}
      {...(canCreateMembers
        ? {
            add: {
              linkProps: {
                href: paths.communityCreate(),
                label: intl.formatMessage({
                  defaultMessage: "Create community",
                  id: "PrTwov",
                  description: "Text to create a community (action)",
                }),
                from: currentUrl,
              },
            },
            nullMessage: {
              description: intl.formatMessage({
                defaultMessage:
                  'Use the "Create community" button to get started.',
                id: "Cu+CH3",
                description: "Instructions for adding a community item",
              }),
            },
          }
        : undefined)}
    />
  );
};

const CommunityTableData_Query = graphql(/* GraphQL */ `
  query CommunityTableData {
    communities {
      ...CommunityTable_Community
    }

    me {
      authInfo {
        id
        roleAssignments {
          ...CommunityRoleAssignment
        }
      }
    }
  }
`);

const CommunityTableApi = ({ title }: { title: string }) => {
  const [{ data, fetching, error }] = useQuery({
    query: CommunityTableData_Query,
  });

  const communitiesQuery = unpackMaybes(data?.communities);

  let myRolesAndTeams: MyRoleTeam[] = [];
  const roleAssignments = unpackMaybes(data?.me?.authInfo?.roleAssignments);
  myRolesAndTeams = roleAssignmentsToRoleTeamArray(roleAssignments);

  return (
    <Pending fetching={fetching} error={error}>
      <CommunityTable
        communitiesQuery={communitiesQuery}
        myRolesAndTeams={myRolesAndTeams}
        title={title}
      />
    </Pending>
  );
};

export default CommunityTableApi;
