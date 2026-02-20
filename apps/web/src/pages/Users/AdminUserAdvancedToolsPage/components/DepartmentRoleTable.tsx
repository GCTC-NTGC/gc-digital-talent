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

import AddDepartmentRoleDialog from "./AddDepartmentRoleDialog";
import {
  DepartmentAssignment,
  getRoleTableFragments,
  isDepartmentTeamable,
  roleCell,
  RoleTableProps,
} from "../utils";
import RemoveDepartmentRoleDialog from "./RemoveDepartmentRoleDialog";
import EditDepartmentRoleDialog from "./EditDepartmentRoleDialog";

const columnHelper = createColumnHelper<DepartmentAssignment>();

const DepartmentRoleTable = ({ query, optionsQuery }: RoleTableProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const { user } = getRoleTableFragments({ query, optionsQuery });

  const columns = [
    columnHelper.display({
      id: "actions",
      enableHiding: false,
      header: intl.formatMessage(tableMessages.actions),
      cell: ({ row: { original: departmentAssignment } }) => (
        <div className="flex gap-1.5">
          <EditDepartmentRoleDialog
            {...{ query, optionsQuery }}
            assignment={departmentAssignment}
          />
          <RemoveDepartmentRoleDialog query={query} {...departmentAssignment} />
        </div>
      ),
    }),
    columnHelper.accessor(
      (departmentAssignment) =>
        departmentAssignment.department?.departmentName?.localized ?? "",
      {
        id: "name",
        enableHiding: false,
        sortingFn: normalizedText,
        header: intl.formatMessage(commonMessages.name),
        cell: ({
          row: {
            original: { department },
          },
          getValue,
        }) =>
          department ? (
            <Link
              href={paths.departmentView(department.id)}
              className="font-bold"
            >
              {getValue()}
            </Link>
          ) : null,
      },
    ),
    columnHelper.accessor(
      (departmentAssignment) =>
        unpackMaybes(departmentAssignment.roles)
          .sort(sortAlphaBy((role) => role.displayName?.localized))
          .map((role) => role.displayName?.localized ?? "")
          .join(", "),
      {
        id: "departmentRoles",
        enableHiding: false,
        header: intl.formatMessage({
          defaultMessage: "Department roles",
          id: "3XvHVf",
          description: "Heading for updating a user's department roles",
        }),
        cell: ({ getValue }) => roleCell(getValue().split(", ")),
      },
    ),
  ] as ColumnDef<DepartmentAssignment>[];

  const data = useMemo(() => {
    const roleAssignments = unpackMaybes(user.authInfo?.roleAssignments);
    type RoleAssignment = (typeof roleAssignments)[number];

    function isDepartmentRoleAssignment(
      assignment: RoleAssignment,
    ): assignment is RoleAssignment & {
      role: NonNullable<RoleAssignment["role"]>;
      teamable: Extract<
        RoleAssignment["teamable"],
        { __typename: "Department" }
      >;
    } {
      return !!assignment.role && isDepartmentTeamable(assignment.teamable);
    }

    const roleTeamPairs = roleAssignments
      .filter(isDepartmentRoleAssignment)
      .map((assignment) => ({
        role: assignment.role,
        department: assignment.teamable,
      }));

    const pairsGroupedByDepartment = groupBy(roleTeamPairs, (pair) => {
      return pair.department.id;
    });

    return Object.values(pairsGroupedByDepartment).map((pairs) => ({
      department: pairs[0].department,
      roles: pairs.map((pair) => pair.role),
    }));
  }, [user.authInfo?.roleAssignments]);

  const pageTitle = intl.formatMessage({
    defaultMessage: "Department roles",
    id: "3XvHVf",
    description: "Heading for updating a user's department roles",
  });

  return (
    <>
      <Heading level="h3" size="h4" className="font-bold">
        {pageTitle}
      </Heading>
      <Table<DepartmentAssignment>
        caption={pageTitle}
        data={data}
        columns={columns}
        urlSync={false}
        search={{
          internal: true,
          label: intl.formatMessage({
            defaultMessage: "Search department based roles",
            id: "bNc3Zd",
            description: "Label for the department roles table search input",
          }),
        }}
        sort={{
          internal: true,
        }}
        add={{
          component: <AddDepartmentRoleDialog {...{ query, optionsQuery }} />,
        }}
        nullMessage={{
          description: intl.formatMessage({
            defaultMessage:
              'Use the "Add department role" button to get started.',
            id: "rUNQVc",
            description:
              "Instructions for adding department membership to a user.",
          }),
        }}
      />
    </>
  );
};

export default DepartmentRoleTable;
