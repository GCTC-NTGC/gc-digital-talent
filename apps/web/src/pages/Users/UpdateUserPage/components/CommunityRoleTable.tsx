import { useMemo, useCallback } from "react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useIntl } from "react-intl";

import { notEmpty, groupBy } from "@gc-digital-talent/helpers";
import { Heading } from "@gc-digital-talent/ui";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import {
  UpdateUserRolesInput,
  Role,
  Scalars,
  User,
} from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import { normalizedText } from "~/components/Table/sortingFns";
import tableMessages from "~/components/Table/tableMessages";

import {
  CommunityAssignment,
  CommunityTeamable,
  UpdateUserRolesFunc,
} from "../types";
import {
  communityActionCell,
  communityCell,
  communityRolesAccessor,
  isCommunityTeamable,
  teamRolesCell,
} from "./helpers";
import { UpdateUserDataAuthInfoType } from "../UpdateUserPage";
import AddCommunityRoleDialog from "./AddCommunityRoleDialog";

interface RoleTeamPair {
  role: Role;
  community: CommunityTeamable;
}

const columnHelper = createColumnHelper<CommunityAssignment>();

type GetRoleTeamIdFunc = (arg: RoleTeamPair) => Scalars["ID"]["output"];

interface CommunityRoleTableProps {
  user: Pick<User, "id" | "firstName" | "lastName">;
  authInfo: UpdateUserDataAuthInfoType;
  availableRoles: Role[];
  onUpdateUserRoles: UpdateUserRolesFunc;
}

const CommunityRoleTable = ({
  user,
  authInfo,
  availableRoles,
  onUpdateUserRoles,
}: CommunityRoleTableProps) => {
  const intl = useIntl();
  const routes = useRoutes();
  const { firstName, lastName, id } = user;

  const communityRoles = availableRoles.filter(
    (role) =>
      role.isTeamBased &&
      [
        "community_admin",
        "community_recruiter",
        "community_talent_coordinator",
      ].includes(role.name),
  );

  const handleEditRoles = useCallback(
    async (values: UpdateUserRolesInput) => {
      return onUpdateUserRoles(values);
    },
    [onUpdateUserRoles],
  );

  const columns = [
    columnHelper.display({
      id: "actions",
      enableHiding: false,
      header: intl.formatMessage(tableMessages.actions),
      cell: ({ row: { original: communityAssignment } }) =>
        communityActionCell(
          communityAssignment,
          { id: id, firstName: firstName, lastName: lastName },
          handleEditRoles,
          communityRoles,
        ),
    }),
    columnHelper.accessor(
      (communityAssignment) =>
        getLocalizedName(communityAssignment.community.name, intl),
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
          communityCell(
            getValue(),
            community ? routes.communityView(community.id) : "",
          ),
      },
    ),
    columnHelper.accessor(
      (communityAssignment) =>
        communityRolesAccessor(communityAssignment, intl),
      {
        id: "communityRoles",
        enableHiding: false,
        header: intl.formatMessage({
          defaultMessage: "Community roles",
          id: "B6cKp+",
          description: "Heading for updating a user's community roles",
        }),
        cell: ({ row: { original: communityAssignment } }) =>
          teamRolesCell(
            communityAssignment.roles
              .map((role) => getLocalizedName(role.displayName, intl))
              .sort((a, b) => a.localeCompare(b)),
          ),
      },
    ),
  ] as ColumnDef<CommunityAssignment>[];

  const data = useMemo(() => {
    const roleTeamPairs: RoleTeamPair[] = (authInfo?.roleAssignments ?? [])
      .map((assignment) => {
        if (
          assignment?.teamable &&
          isCommunityTeamable(assignment.teamable) &&
          assignment.role?.isTeamBased
        )
          return {
            role: assignment.role,
            community: assignment.teamable,
          };
        return null;
      })
      .filter(notEmpty);

    const pairsGroupedByCommunity = groupBy<
      Scalars["ID"]["output"],
      RoleTeamPair,
      GetRoleTeamIdFunc
    >(roleTeamPairs, (pair) => {
      return pair.community.id;
    });

    return Object.values(pairsGroupedByCommunity).map(
      (communityGroupOfPairs) => {
        return {
          community: communityGroupOfPairs[0].community,
          roles: communityGroupOfPairs.map((pair) => pair.role),
        };
      },
    );
  }, [authInfo?.roleAssignments]);

  const pageTitle = intl.formatMessage({
    defaultMessage: "Community roles",
    id: "B6cKp+",
    description: "Heading for updating a user's community roles",
  });

  return (
    <>
      <Heading data-h2-margin="base(x2, 0, x.5, 0)" level="h3" size="h4">
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
          component: (
            <AddCommunityRoleDialog
              user={user}
              authInfo={authInfo}
              communityRoles={communityRoles}
              onAddRoles={handleEditRoles}
            />
          ),
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
