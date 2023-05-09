import React, { useMemo } from "react";
import { useIntl } from "react-intl";

import { notEmpty } from "@gc-digital-talent/helpers";
import { getLocale } from "@gc-digital-talent/i18n";
import { Pending } from "@gc-digital-talent/ui";

import { Department, useDepartmentsQuery } from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";
import Table, {
  ColumnsOf,
  tableEditButtonAccessor,
  Cell,
} from "~/components/Table/ClientManagedTable";

type DepartmentCell = Cell<Department>;

interface DepartmentTableProps {
  departments: Array<Department>;
  title: string;
}

export const DepartmentTable = ({
  departments,
  title,
}: DepartmentTableProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();
  const columns = useMemo<ColumnsOf<Department>>(
    () => [
      {
        Header: intl.formatMessage({
          defaultMessage: "Department #",
          id: "QOvS1b",
          description:
            "Title displayed for the Department table Department # column.",
        }),
        accessor: "departmentNumber",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Name",
          id: "2wmzS1",
          description: "Title displayed for the Department table Name column.",
        }),
        accessor: (d) => d.name?.[locale],
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Edit",
          id: "hTfHUv",
          description: "Title displayed for the Department table Edit column.",
        }),
        id: "edit",
        accessor: (d) => `Edit ${d.id}`,
        disableGlobalFilter: true,
        Cell: ({ row: { original: department } }: DepartmentCell) =>
          tableEditButtonAccessor(
            department.id,
            paths.departmentTable(),
            department.name?.[locale],
          ),
      },
    ],
    [paths, intl, locale],
  );

  const data = useMemo(() => departments.filter(notEmpty), [departments]);

  return (
    <Table
      data={data}
      columns={columns}
      addBtn={{
        path: paths.departmentCreate(),
        label: intl.formatMessage({
          defaultMessage: "Create Department",
          id: "ZbpbD6",
          description: "Heading displayed above the Create Department form.",
        }),
      }}
      title={title}
    />
  );
};

const DepartmentTableApi = ({ title }: { title: string }) => {
  const [result] = useDepartmentsQuery();
  const { data, fetching, error } = result;

  const departments = data?.departments.filter(notEmpty);

  return (
    <Pending fetching={fetching} error={error}>
      <DepartmentTable departments={departments || []} title={title} />
    </Pending>
  );
};

export default DepartmentTableApi;
