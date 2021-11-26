import React, { useMemo } from "react";
import { defineMessages, IntlShape, useIntl } from "react-intl";
import commonMessages from "@common/messages/commonMessages";
import { navigate, useLocation } from "@common/helpers/router";
import { notEmpty } from "@common/helpers/util";
import { FromArray } from "@common/types/utilityTypes";
import Button from "@common/components/Button";
import { DepartmentsQuery, useDepartmentsQuery } from "../../api/generated";
import Table, { ColumnsOf } from "../Table";
import DashboardContentContainer from "../DashboardContentContainer";

const messages = defineMessages({
  columnDepartmentNumberTitle: {
    defaultMessage: "Department #",
    description:
      "Title displayed for the Department table Department # column.",
  },
  columnNameTitle: {
    defaultMessage: "Name",
    description: "Title displayed for the Department table Name column.",
  },
  columnEditTitle: {
    defaultMessage: "Edit",
    description: "Title displayed for the Department table Edit column.",
  },
});

type Data = NonNullable<FromArray<DepartmentsQuery["departments"]>>;

function editButtonAccessor(id: string, editUrlRoot: string, intl: IntlShape) {
  return (
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
  );
}

export const DepartmentTable: React.FC<
  DepartmentsQuery & { editUrlRoot: string }
> = ({ departments, editUrlRoot }) => {
  const intl = useIntl();
  const columns = useMemo<ColumnsOf<Data>>(
    () => [
      {
        Header: intl.formatMessage(messages.columnDepartmentNumberTitle),
        accessor: "departmentNumber",
      },
      {
        Header: intl.formatMessage(messages.columnNameTitle),
        accessor: (d) => d.name?.en,
      },
      {
        Header: intl.formatMessage(messages.columnEditTitle),
        accessor: (d) => editButtonAccessor(d.id, editUrlRoot, intl), // callback extracted to separate function to stabilize memoized component
      },
    ],
    [editUrlRoot, intl],
  );

  const data = useMemo(() => departments.filter(notEmpty), [departments]);

  return <Table data={data} columns={columns} />;
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
