import XCircleIcon from "@heroicons/react/20/solid/XCircleIcon";
import CheckCircleIcon from "@heroicons/react/20/solid/CheckCircleIcon";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { ReactNode } from "react";
import { IntlShape, useIntl } from "react-intl";
import { tv } from "tailwind-variants";

import { ROLE_NAME } from "@gc-digital-talent/auth";
import { Heading } from "@gc-digital-talent/ui";

import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";

import { messages } from "./messages";

export interface RolePermissionRow {
  permission: string;
  [ROLE_NAME.ProcessOperator]: boolean;
  [ROLE_NAME.CommunityRecruiter]: boolean;
  [ROLE_NAME.CommunityTalentCoordinator]: boolean;
  [ROLE_NAME.CommunityAdmin]: boolean;
}

interface RolesAndPermissionsTableProps {
  data: RolePermissionRow[];
  title: ReactNode;
}

const columnHelper = createColumnHelper<RolePermissionRow>();

const boolCheck = tv({
  base: "size-4.5 shrink-0",
  variants: {
    checked: {
      true: "text-success dark:text-success-200",
      false: "text-error dark:text-error-200",
    },
  },
});

const cell = (value: boolean, intl: IntlShape) => {
  const Icon = value ? CheckCircleIcon : XCircleIcon;

  return (
    <Icon
      className={boolCheck({ checked: value })}
      aria-hidden="false"
      aria-label={
        value
          ? intl.formatMessage({
              defaultMessage: "Allowed",
              id: "pgbkdx",
              description:
                "Indication a specific permission is allowed for a specific role",
            })
          : intl.formatMessage({
              defaultMessage: "Not allowed",
              id: "YxDod9",
              description:
                "Indication a specific permission is not allowed for a specific role",
            })
      }
    />
  );
};

const RolesAndPermissionsTable = ({
  data,
  title,
}: RolesAndPermissionsTableProps) => {
  const intl = useIntl();

  const columns = [
    columnHelper.accessor("permission", {
      id: "permissions",
      header: intl.formatMessage({
        defaultMessage: "Permissions",
        id: "PBNcYK",
        description: "Header for permissions column in table",
      }),
      enableHiding: false,
    }),
    columnHelper.accessor(ROLE_NAME.ProcessOperator, {
      id: ROLE_NAME.ProcessOperator,
      header: intl.formatMessage(messages.processOperator),
      cell: ({ getValue }) => cell(getValue(), intl),
      enableHiding: false,
    }),
    columnHelper.accessor(ROLE_NAME.CommunityRecruiter, {
      id: ROLE_NAME.CommunityRecruiter,
      header: intl.formatMessage(messages.communityRecruiter),
      cell: ({ getValue }) => cell(getValue(), intl),
      enableHiding: false,
    }),
    columnHelper.accessor(ROLE_NAME.CommunityTalentCoordinator, {
      id: ROLE_NAME.CommunityTalentCoordinator,
      header: intl.formatMessage(messages.communityTalentCoordinator),
      cell: ({ getValue }) => cell(getValue(), intl),
      enableHiding: false,
    }),
    columnHelper.accessor(ROLE_NAME.CommunityAdmin, {
      id: ROLE_NAME.CommunityAdmin,
      header: intl.formatMessage(messages.communityAdmin),
      cell: ({ getValue }) => cell(getValue(), intl),
      enableHiding: false,
    }),
  ] as ColumnDef<RolePermissionRow>[];

  return (
    <>
      <Heading level="h3" size="h4" className="font-bold">
        {title}
      </Heading>
      <Table<RolePermissionRow> caption={title} data={data} columns={columns} />
    </>
  );
};

export default RolesAndPermissionsTable;
