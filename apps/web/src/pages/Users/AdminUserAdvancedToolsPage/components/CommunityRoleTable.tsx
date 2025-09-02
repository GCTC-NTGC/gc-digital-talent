import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useIntl } from "react-intl";
import { useMemo } from "react";

import { groupBy, unpackMaybes, sortAlphaBy } from "@gc-digital-talent/helpers";
import { Heading, Link } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import useRoutes from "~/hooks/useRoutes";
import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import { normalizedText } from "~/components/Table/sortingFns";
import tableMessages from "~/components/Table/tableMessages";

import AddCommunityRoleDialog from "./AddCommunityRoleDialog";
import {
  CommunityAssignment,
  getRoleTableFragments,
  isCommunityTeamable,
  roleCell,
  RoleTableProps,
} from "../utils";
import RemoveCommunityRoleDialog from "./RemoveCommunityRoleDialog";
import EditCommunityRoleDialog from "./EditCommunityRoleDialog";

const columnHelper = createColumnHelper<CommunityAssignment>();

const CommunityRoleTable = ({ query, optionsQuery }: RoleTableProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const { user } = getRoleTableFragments({ query, optionsQuery });

  const columns = [
    columnHelper.display({
      id: "actions",
      enableHiding: false,
      header: intl.formatMessage(tableMessages.actions),
      cell: ({ row: { original: communityAssignment } }) => (
        <div className="flex gap-1.5">
          <EditCommunityRoleDialog
            {...{ query, optionsQuery }}
            assignment={communityAssignment}
          />
          <RemoveCommunityRoleDialog query={query} {...communityAssignment} />
        </div>
      ),
    }),
    columnHelper.accessor(
      (communityAssignment) =>
        communityAssignment.community.name?.localized ?? "",
      {
        id: "name",
        enableHiding: false,
        sortingFn: normalizedText,
        header: intl.formatMessage(commonMessages.name),
        cell: ({
          row: {
            original: { community },
          },
          getValue,
        }) =>
          community ? (
            <Link
              href={paths.communityView(community.id)}
              className="font-bold"
            >
              {getValue()}
            </Link>
          ) : null,
      },
    ),
    columnHelper.accessor(
      (communityAssignment) =>
        unpackMaybes(communityAssignment.roles)
          .sort(sortAlphaBy((role) => role.displayName?.localized))
          .map((role) => role.displayName?.localized ?? "")
          .join(", "),
      {
        id: "communityRoles",
        enableHiding: false,
        header: intl.formatMessage({
          defaultMessage: "Community roles",
          id: "B6cKp+",
          description: "Heading for updating a user's community roles",
        }),
        cell: ({ getValue }) => roleCell(getValue().split(", ")),
      },
    ),
  ] as ColumnDef<CommunityAssignment>[];

  const data = useMemo(() => {
    const roleAssignments = unpackMaybes(user.authInfo?.roleAssignments);
    type RoleAssignment = (typeof roleAssignments)[number];

    function isCommunityRoleAssignment(
      assignment: RoleAssignment,
    ): assignment is RoleAssignment & {
      role: NonNullable<RoleAssignment["role"]>;
      teamable: Extract<
        RoleAssignment["teamable"],
        { __typename: "Community" }
      >;
    } {
      return !!assignment.role && isCommunityTeamable(assignment.teamable);
    }

    const roleTeamPairs = roleAssignments
      .filter(isCommunityRoleAssignment)
      .map((assignment) => ({
        role: assignment.role,
        community: assignment.teamable,
      }));

    const pairsGroupedByCommunity = groupBy(roleTeamPairs, (pair) => {
      return pair.community.id;
    });

    return Object.values(pairsGroupedByCommunity).map((pairs) => ({
      community: pairs[0].community,
      roles: pairs.map((pair) => pair.role),
    }));
  }, [user.authInfo?.roleAssignments]);

  const pageTitle = intl.formatMessage({
    defaultMessage: "Community roles",
    id: "B6cKp+",
    description: "Heading for updating a user's community roles",
  });

  return (
    <>
      <Heading level="h3" size="h4" className="font-bold">
        {pageTitle}
      </Heading>
      <Table<CommunityAssignment>
        caption={pageTitle}
        data={data}
        columns={columns}
        urlSync={false}
        search={{
          internal: true,
          label: intl.formatMessage({
            defaultMessage: "Search community based roles",
            id: "ryeKXV",
            description: "Label for the community roles table search input",
          }),
        }}
        sort={{
          internal: true,
        }}
        add={{
          component: <AddCommunityRoleDialog {...{ query, optionsQuery }} />,
        }}
        nullMessage={{
          description: intl.formatMessage({
            defaultMessage:
              'Use the "Add community role" button to get started.',
            id: "MxmB1v",
            description:
              "Instructions for adding community membership to a user.",
          }),
        }}
      />
    </>
  );
};

export default CommunityRoleTable;
