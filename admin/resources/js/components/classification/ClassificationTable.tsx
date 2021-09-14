import React, { useMemo } from "react";
import { defineMessages, useIntl } from "react-intl";
import { Button } from "@common/components";
import {
  navigate,
  useLocation,
  notEmpty,
} from "@common/helpers";
import { commonMessages } from "@common/messages";
import {
  GetClassificationsQuery,
  useGetClassificationsQuery,
} from "../../api/generated";
import { FromArray } from "../../types/utilityTypes";
import DashboardContentContainer from "../DashboardContentContainer";
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
  columnEditTitle: {
    id: "classificationTable.column.editTitle",
    defaultMessage: "Edit",
    description: "Title displayed for the Classification table Edit column.",
  },
});

type Data = NonNullable<FromArray<GetClassificationsQuery["classifications"]>>;

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
