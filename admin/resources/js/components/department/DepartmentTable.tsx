import React, { useMemo } from "react";
import { defineMessages, useIntl } from "react-intl";
import commonMessages from "../commonMessages";
import { DepartmentsQuery, useDepartmentsQuery } from "../../api/generated";
import { navigate, useLocation } from "../../helpers/router";
import { notEmpty } from "../../helpers/util";
import { FromArray } from "../../types/utilityTypes";
import Button from "../H2Components/Button";
import Table, { ColumnsOf } from "../Table";
import DashboardContentContainer from "../DashboardContentContainer";

const messages = defineMessages({
  columnDepartmentNumberTitle: {
    id: "departmentTable.column.departmentNumber",
    defaultMessage: "Department #",
    description:
      "Title displayed for the Department table Department # column.",
  },
  columnNameTitle: {
    id: "departmentTable.column.nameTitle",
    defaultMessage: "Name",
    description: "Title displayed for the Department table Name column.",
  },
  columnEditTitle: {
    id: "departmentTable.column.editTitle",
    defaultMessage: "Edit",
    description: "Title displayed for the Department table Edit column.",
  },
});

type Data = NonNullable<FromArray<DepartmentsQuery["departments"]>>;

export const DepartmentTable: React.FC<
  DepartmentsQuery & { editUrlRoot: string }
> = ({ departments, editUrlRoot }) => {
  const intl = useIntl();
  const columns = useMemo<ColumnsOf<Data>>(
    () => [
      {
        Header: intl.formatMessage(messages.columnDepartmentNumberTitle),
        accessor: "department_number",
      },
      {
        Header: intl.formatMessage(messages.columnNameTitle),
        id: "name",
        accessor: (d) => d.name?.en,
      },
      {
        Header: intl.formatMessage(messages.columnEditTitle),
        id: "edit",
        accessor: ({ id }) => (
          <Button
            color="primary"
            mode="inline"
            onClick={(event) => {
              event.preventDefault();
              navigate(`${editUrlRoot}/${id}/edit`);
            }}
          >
            {intl.formatMessage(messages.columnEditTitle)}
          </Button>
        ),
      },
    ],
    [editUrlRoot, intl],
  );

  const data = useMemo(() => departments.filter(notEmpty), [departments]);

  return (
    <>
      <Table data={data} columns={columns} />
    </>
  );
};

export const DepartmentTableApi: React.FunctionComponent = () => {
  const intl = useIntl();
  const [result] = useDepartmentsQuery();
  const { data, fetching, error } = result;
  const { pathname } = useLocation();

  if (fetching)
    return (
      <DashboardContentContainer>
        <p>{intl.formatMessage(commonMessages.loadingTitle)}</p>
      </DashboardContentContainer>
    );
  if (error)
    return (
      <DashboardContentContainer>
        <p>
          {intl.formatMessage(commonMessages.loadingError)} {error.message}
        </p>
      </DashboardContentContainer>
    );

  return (
    <DepartmentTable
      departments={data?.departments ?? []}
      editUrlRoot={pathname}
    />
  );
};
