import React, { useMemo } from "react";
import { defineMessages, IntlShape, useIntl } from "react-intl";
import { Button } from "@common/components/Button";
import { navigate, useLocation } from "@common/helpers/router";
import { notEmpty } from "@common/helpers/util";
import { commonMessages } from "@common/messages";
import { FromArray } from "@common/types/utilityTypes";
import {
  GetClassificationsQuery,
  useGetClassificationsQuery,
} from "../../api/generated";
import DashboardContentContainer from "../DashboardContentContainer";
import Table, { ColumnsOf } from "../Table";

const messages = defineMessages({
  columnIdTitle: {
    defaultMessage: "ID",
    description: "Title displayed on the Classification table ID column.",
  },
  columnNameTitle: {
    defaultMessage: "Name",
    description: "Title displayed for the Classification table Name column.",
  },
  columnGroupTitle: {
    defaultMessage: "Group",
    description: "Title displayed for the Classification table Group column.",
  },
  columnLevelTitle: {
    defaultMessage: "Level",
    description: "Title displayed for the Classification table Level column.",
  },
  columnMinimumSalaryTitle: {
    defaultMessage: "Minimum Salary",
    description:
      "Title displayed for the Classification table Minimum Salary column.",
  },
  columnMaximumSalaryTitle: {
    defaultMessage: "Maximum Salary",
    description:
      "Title displayed for the Classification table Maximum Salary column.",
  },
  columnEditTitle: {
    defaultMessage: "Edit",
    description: "Title displayed for the Classification table Edit column.",
  },
});

type Data = NonNullable<FromArray<GetClassificationsQuery["classifications"]>>;

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

export const ClassificationTable: React.FC<
  GetClassificationsQuery & { editUrlRoot: string }
> = ({ classifications, editUrlRoot }) => {
  const intl = useIntl();
  const columns = useMemo<ColumnsOf<Data>>(
    () => [
      {
        Header: intl.formatMessage(messages.columnIdTitle),
        accessor: "id",
      },
      {
        Header: intl.formatMessage(messages.columnNameTitle),
        accessor: (d) => d.name?.en,
      },
      {
        Header: intl.formatMessage(messages.columnGroupTitle),
        accessor: "group",
      },
      {
        Header: intl.formatMessage(messages.columnLevelTitle),
        accessor: "level",
      },
      {
        Header: intl.formatMessage(messages.columnMinimumSalaryTitle),
        accessor: "minSalary",
      },
      {
        Header: intl.formatMessage(messages.columnMaximumSalaryTitle),
        accessor: "maxSalary",
      },
      {
        Header: intl.formatMessage(messages.columnEditTitle),
        accessor: (d) => editButtonAccessor(d.id, editUrlRoot, intl), // callback extracted to separate function to stabilize memoized component
      },
    ],
    [editUrlRoot, intl],
  );

  const memoizedData = useMemo(
    () => classifications.filter(notEmpty),
    [classifications],
  );

  return (
    <Table
      data={memoizedData}
      columns={columns}
      hiddenCols={["minSalary", "maxSalary"]}
    />
  );
};

export const ClassificationTableApi: React.FunctionComponent = () => {
  const intl = useIntl();
  const [result] = useGetClassificationsQuery();
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
    <ClassificationTable
      classifications={data?.classifications ?? []}
      editUrlRoot={pathname}
    />
  );
};
