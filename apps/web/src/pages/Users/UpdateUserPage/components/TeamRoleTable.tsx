import React, { useMemo } from "react";
import { useIntl } from "react-intl";

import { notEmpty } from "@gc-digital-talent/helpers";
import { Heading, Pill } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";

import Table, { ColumnsOf, Cell } from "~/components/Table/ClientManagedTable";
import {
  Role,
  RoleAssignment,
  UpdateUserAsAdminInput,
  User,
} from "~/api/generated";

import AddTeamRoleDialog from "./AddTeamRoleDialog";
import RemoveIndividualRoleDialog from "./RemoveIndividualRoleDialog";
import { UpdateUserFunc } from "../types";

const roleAssignmentCell = (displayName: string) => {
  return (
    <Pill color="neutral" mode="solid">
      {displayName}
    </Pill>
  );
};

const actionCell = (
  roleAssignment: RoleAssignment,
  user: User,
  onUpdateUser: UpdateUserFunc,
) => (
  <RemoveIndividualRoleDialog
    // We expect this to never be undefined, so coerce.
    role={roleAssignment.role as Role}
    user={user}
    onUpdateUser={onUpdateUser}
  />
);

type RoleAssignmentCell = Cell<RoleAssignment>;

interface TeamRoleTableProps {
  user: User;
  availableRoles: Array<Role>;
  onUpdateUser: UpdateUserFunc;
}

export const TeamRoleTable = ({
  user,
  availableRoles,
  onUpdateUser,
}: TeamRoleTableProps) => {
  const intl = useIntl();

  const columns = useMemo<ColumnsOf<RoleAssignment>>(
    () => [
      {
        Header: intl.formatMessage({
          defaultMessage: "Actions",
          id: "S8ra2P",
          description: "Title displayed for the role table actions column",
        }),
        accessor: (ra) => `Actions ${ra.role?.id}`,
        disableGlobalFilter: true,
        Cell: ({ row: { original: roleAssignment } }: RoleAssignmentCell) =>
          actionCell(roleAssignment, user, onUpdateUser),
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Team",
          id: "3IZ3mN",
          description: "Title displayed for the role table display team column",
        }),
        accessor: (roleAssignment) =>
          getLocalizedName(roleAssignment.team?.displayName, intl),
        Cell: ({ row: { original: roleAssignment } }: RoleAssignmentCell) =>
          roleAssignmentCell(
            getLocalizedName(roleAssignment.team?.displayName, intl),
          ),
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Role",
          id: "uBmoxQ",
          description: "Title displayed for the role table display name column",
        }),
        accessor: (roleAssignment) =>
          getLocalizedName(roleAssignment.role?.displayName, intl),
        Cell: ({ row: { original: roleAssignment } }: RoleAssignmentCell) =>
          roleAssignmentCell(
            getLocalizedName(roleAssignment.role?.displayName, intl),
          ),
      },
    ],
    [intl, onUpdateUser, user],
  );

  const data = useMemo(() => {
    const roleAssignments = user.roleAssignments
      ?.filter(notEmpty)
      .filter((assignment) => assignment.role?.isTeamBased);
    return roleAssignments || [];
  }, [user.roleAssignments]);

  const handleAddRoles = async (values: UpdateUserAsAdminInput) => {
    return onUpdateUser(user.id, values);
  };

  return (
    <>
      <Heading level="h3" size="h4">
        {intl.formatMessage({
          defaultMessage: "Team roles",
          id: "2kXthI",
          description: "Heading for updating a users team roles",
        })}
      </Heading>
      <Table
        data={data}
        columns={columns}
        addDialog={
          <AddTeamRoleDialog
            user={user}
            availableRoles={availableRoles}
            onAddRoles={handleAddRoles}
          />
        }
      />
    </>
  );
};

export default TeamRoleTable;
