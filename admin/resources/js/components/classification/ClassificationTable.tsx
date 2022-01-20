import React, { useMemo } from "react";
import { useIntl } from "react-intl";
import { useLocation } from "@common/helpers/router";
import { notEmpty } from "@common/helpers/util";
import { commonMessages } from "@common/messages";
import { FromArray } from "@common/types/utilityTypes";
import { getLocale } from "@common/helpers/localize";
import {
  GetClassificationsQuery,
  useGetClassificationsQuery,
} from "../../api/generated";
import DashboardContentContainer from "../DashboardContentContainer";
import Table, { ColumnsOf } from "../Table";
import { tableEditButtonAccessor } from "../TableEditButton";

type Data = NonNullable<FromArray<GetClassificationsQuery["classifications"]>>;

export const ClassificationTable: React.FC<
  GetClassificationsQuery & { editUrlRoot: string }
> = ({ classifications, editUrlRoot }) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const columns = useMemo<ColumnsOf<Data>>(
    () => [
      {
        Header: intl.formatMessage({
          defaultMessage: "ID",
          description: "Title displayed on the Classification table ID column.",
        }),
        accessor: "id",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Name",
          description:
            "Title displayed for the Classification table Name column.",
        }),
        accessor: (d) => d.name?.[locale],
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Group",
          description:
            "Title displayed for the Classification table Group column.",
        }),
        accessor: "group",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Level",
          description:
            "Title displayed for the Classification table Level column.",
        }),
        accessor: "level",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Minimum Salary",
          description:
            "Title displayed for the Classification table Minimum Salary column.",
        }),
        accessor: "minSalary",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Maximum Salary",
          description:
            "Title displayed for the Classification table Maximum Salary column.",
        }),
        accessor: "maxSalary",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Edit",
          description:
            "Title displayed for the Classification table Edit column.",
        }),
        accessor: (d) => tableEditButtonAccessor(d.id, editUrlRoot), // callback extracted to separate function to stabilize memoized component
      },
    ],
    [editUrlRoot, intl, locale],
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
