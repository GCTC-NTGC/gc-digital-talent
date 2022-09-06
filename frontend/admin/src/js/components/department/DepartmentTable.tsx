import React, { useMemo } from "react";
import { useIntl } from "react-intl";
import { useLocation } from "@common/helpers/router";
import { notEmpty } from "@common/helpers/util";
import { FromArray } from "@common/types/utilityTypes";
import { getLocale } from "@common/helpers/localize";
import Pending from "@common/components/Pending";
import { DepartmentsQuery, useDepartmentsQuery } from "../../api/generated";
import Table, { ColumnsOf, tableEditButtonAccessor } from "../Table";
import { useAdminRoutes } from "../../adminRoutes";

type Data = NonNullable<FromArray<DepartmentsQuery["departments"]>>;

export const DepartmentTable: React.FC<
  DepartmentsQuery & { editUrlRoot: string }
> = ({ departments, editUrlRoot }) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useAdminRoutes();
  const columns = useMemo<ColumnsOf<Data>>(
    () => [
      {
        Header: intl.formatMessage({
          defaultMessage: "Department #",
          description:
            "Title displayed for the Department table Department # column.",
        }),
        accessor: "departmentNumber",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Name",
          description: "Title displayed for the Department table Name column.",
        }),
        accessor: (d) => d.name?.[locale],
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Edit",
          description: "Title displayed for the Department table Edit column.",
        }),
        accessor: (d) => tableEditButtonAccessor(d.id, editUrlRoot), // callback extracted to separate function to stabilize memoized component
      },
    ],
    [editUrlRoot, intl, locale],
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
          description: "Heading displayed above the Create Department form.",
        }),
      }}
    />
  );
};

export const DepartmentTableApi: React.FunctionComponent = () => {
  const [result] = useDepartmentsQuery();
  const { data, fetching, error } = result;
  const { pathname } = useLocation();

  return (
    <Pending fetching={fetching} error={error}>
      <DepartmentTable
        departments={data?.departments ?? []}
        editUrlRoot={pathname}
      />
    </Pending>
  );
};
