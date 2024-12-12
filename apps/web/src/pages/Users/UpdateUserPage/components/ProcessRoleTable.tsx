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

import { PoolAssignment, PoolTeamable, UpdateUserRolesFunc } from "../types";
import {
  isPoolTeamable,
  processActionCell,
  processCell,
  processRolesAccessor,
  teamRolesCell,
} from "./helpers";
import { UpdateUserDataAuthInfoType } from "../UpdateUserPage";
import AddProcessRoleDialog from "./AddProcessRoleDialog";

interface RoleTeamPair {
  role: Role;
  pool: PoolTeamable;
}

const columnHelper = createColumnHelper<PoolAssignment>();

type GetRoleTeamIdFunc = (arg: RoleTeamPair) => Scalars["ID"]["output"];

interface ProcessRoleTableProps {
  user: Pick<User, "id" | "firstName" | "lastName">;
  authInfo: UpdateUserDataAuthInfoType;
  availableRoles: Role[];
  onUpdateUserRoles: UpdateUserRolesFunc;
}

const ProcessRoleTable = ({
  user,
  authInfo,
  availableRoles,
  onUpdateUserRoles,
}: ProcessRoleTableProps) => {
  const intl = useIntl();
  const routes = useRoutes();
  const { firstName, lastName, id } = user;

  const processRoles = availableRoles.filter(
    (role) => role.isTeamBased && ["process_operator"].includes(role.name),
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
      cell: ({ row: { original: poolAssignment } }) =>
        processActionCell(
          poolAssignment,
          { id: id, firstName: firstName, lastName: lastName },
          handleEditRoles,
          processRoles,
        ),
    }),
    columnHelper.accessor(
      (poolAssignment) => getLocalizedName(poolAssignment.pool.name, intl),
      {
        id: "name",
        enableHiding: false,
        sortingFn: normalizedText,
        header: intl.formatMessage(commonMessages.name),
        cell: ({
          row: {
            original: { pool },
          },
          getValue,
        }) => processCell(getValue(), pool ? routes.poolView(pool.id) : ""),
      },
    ),
    columnHelper.accessor(
      (poolAssignment) => processRolesAccessor(poolAssignment, intl),
      {
        id: "processRoles",
        enableHiding: false,
        header: intl.formatMessage({
          defaultMessage: "Process roles",
          id: "eGqjYh",
          description: "Heading for updating a user's process roles",
        }),
        cell: ({ row: { original: poolAssignment } }) =>
          teamRolesCell(
            poolAssignment.roles
              .map((role) => getLocalizedName(role.displayName, intl))
              .sort((a, b) => a.localeCompare(b)),
          ),
      },
    ),
  ] as ColumnDef<PoolAssignment>[];

  const data = useMemo(() => {
    const roleTeamPairs: RoleTeamPair[] = (authInfo?.roleAssignments ?? [])
      .map((assignment) => {
        if (
          assignment?.teamable &&
          isPoolTeamable(assignment.teamable) &&
          assignment.role?.isTeamBased
        )
          return {
            role: assignment.role,
            pool: assignment.teamable,
          };
        return null;
      })
      .filter(notEmpty);

    const pairsGroupedByPool = groupBy<
      Scalars["ID"]["output"],
      RoleTeamPair,
      GetRoleTeamIdFunc
    >(roleTeamPairs, (pair) => {
      return pair.pool.id;
    });

    return Object.values(pairsGroupedByPool).map((poolGroupOfPairs) => {
      return {
        pool: poolGroupOfPairs[0].pool,
        roles: poolGroupOfPairs.map((pair) => pair.role),
      };
    });
  }, [authInfo?.roleAssignments]);

  const pageTitle = intl.formatMessage({
    defaultMessage: "Process roles",
    id: "eGqjYh",
    description: "Heading for updating a user's process roles",
  });

  return (
    <>
      <Heading data-h2-margin="base(x2, 0, x.5, 0)" level="h3" size="h4">
        {pageTitle}
      </Heading>
      <Table<PoolAssignment>
        caption={pageTitle}
        data={data}
        columns={columns}
        urlSync={false}
        search={{
          internal: true,
          label: intl.formatMessage({
            defaultMessage: "Search process based roles",
            id: "DbWxZl",
            description: "Label for the process roles table search input",
          }),
        }}
        sort={{
          internal: true,
        }}
        add={{
          component: (
            <AddProcessRoleDialog
              user={user}
              authInfo={authInfo}
              processRoles={processRoles}
              onAddRoles={handleEditRoles}
            />
          ),
        }}
        nullMessage={{
          description: intl.formatMessage({
            defaultMessage: 'Use the "Add process role" button to get started.',
            id: "JCZlxS",
            description:
              "Instructions for adding process membership to a user.",
          }),
        }}
      />
    </>
  );
};

export default ProcessRoleTable;
