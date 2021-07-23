import React, { useMemo } from "react";
import { defineMessages, useIntl } from "react-intl";
import {
  GetClassificationsQuery,
  useGetClassificationsQuery,
} from "../../api/generated";
import { notEmpty } from "../../helpers/util";
import { FromArray } from "../../types/utilityTypes";
import commonMessages from "../commonMessages";
import Table, { ColumnsOf } from "../Table";

const messages = defineMessages({
  columnIdTitle: {
    id: "classificationTable.column.idTitle",
    defaultMessage: "ID",
    description: "Title displayed on the Classification table ID column.",
  },
  columnNameTitle: {
    id: "classificationTable.column.nameTitle",
    defaultMessage: "Name",
    description: "Title displayed for the Classification table Name column.",
  },
  columnGroupTitle: {
    id: "classificationTable.column.groupTitle",
    defaultMessage: "Group",
    description: "Title displayed for the Classification table Group column.",
  },
  columnLevelTitle: {
    id: "classificationTable.column.levelTitle",
    defaultMessage: "Level",
    description: "Title displayed for the Classification table Level column.",
  },
  columnMinimumSalaryTitle: {
    id: "classificationTable.column.minimumSalaryTitle",
    defaultMessage: "Minimum Salary",
    description:
      "Title displayed for the Classification table Minimum Salary column.",
  },
  columnMaximumSalaryTitle: {
    id: "classificationTable.column.maximumSalaryTitle",
    defaultMessage: "Maximum Salary",
    description:
      "Title displayed for the Classification table Maximum Salary column.",
  },
});

type Data = NonNullable<FromArray<GetClassificationsQuery["classifications"]>>;

export const ClassificationTable: React.FC<GetClassificationsQuery> = ({
  classifications,
}) => {
  const intl = useIntl();
  const columns = useMemo<ColumnsOf<Data>>(
    () => [
      {
        Header: intl.formatMessage(messages.columnIdTitle),
        accessor: "id",
      },
      {
        Header: intl.formatMessage(messages.columnNameTitle),
        id: "name",
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
    ],
    [intl],
  );

  const memoizedData = useMemo(
    () => classifications.filter(notEmpty),
    [classifications],
  );

  return (
    <>
      <Table
        data={memoizedData}
        columns={columns}
        hiddenCols={["minSalary", "maxSalary"]}
      />
    </>
  );
};

export const ClassificationTableApi: React.FunctionComponent = () => {
  const intl = useIntl();
  const [result] = useGetClassificationsQuery();
  const { data, fetching, error } = result;

  if (fetching) return <p>{intl.formatMessage(commonMessages.loadingTitle)}</p>;
  if (error)
    return (
      <p>
        {intl.formatMessage(commonMessages.loadingError)} {error.message}
      </p>
    );

  return <ClassificationTable classifications={data?.classifications ?? []} />;
};
