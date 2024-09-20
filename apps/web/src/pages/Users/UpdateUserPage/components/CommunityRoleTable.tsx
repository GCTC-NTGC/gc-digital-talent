import { useMemo, useCallback } from "react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useIntl } from "react-intl";

import { notEmpty, groupBy } from "@gc-digital-talent/helpers";
import { Heading } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import {
  UpdateUserRolesInput,
  Role,
  Scalars,
  User,
} from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import { normalizedText } from "~/components/Table/sortingFns";
import adminMessages from "~/messages/adminMessages";
import tableMessages from "~/components/Table/tableMessages";

import {
  CommunityAssignment,
  CommunityPickedFields,
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
  community: CommunityPickedFields;
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
      ["community_admin", "community_recruiter"].includes(role.name),
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
        id: "team",
        sortingFn: normalizedText,
        header: intl.formatMessage(adminMessages.team),
        cell: ({
          row: {
            original: { community },
          },
          getValue,
        }) =>
          communityCell(
            getValue(),
            community ? routes.teamView(community.id) : "",
          ),
      },
    ),
    columnHelper.accessor(
      (communityAssignment) =>
        communityRolesAccessor(communityAssignment, intl),
      {
        id: "membershipRoles",
        header: intl.formatMessage({
          defaultMessage: "Membership Roles",
          id: "GjaLl7",
          description:
            "Title displayed for the role table display roles column",
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
      .filter((roleAssignment) => isCommunityTeamable(roleAssignment?.teamable)) // filter for community teamable
      .map((assignment) => {
        if (
          assignment?.teamable &&
          isCommunityTeamable(assignment.teamable) && // type coercion
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
      <Heading level="h3" size="h4">
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
              availableRoles={communityRoles}
              onAddRoles={handleEditRoles}
            />
          ),
        }}
        nullMessage={{
          description: intl.formatMessage({
            defaultMessage:
              'Use the "Add new membership" button to get started.',
            id: "/pbxol",
            description: "Instructions for adding team membership to a user.",
          }),
        }}
      />
    </>
  );
};

export default CommunityRoleTable;
