import React, { useMemo } from "react";
import { useIntl } from "react-intl";
import { notEmpty } from "@common/helpers/util";
import { useLocation } from "@common/helpers/router";
import { commonMessages } from "@common/messages";
import { FromArray } from "@common/types/utilityTypes";
import { getLocale } from "@common/helpers/localize";
import {
  GetPoolCandidateSearchRequestsQuery,
  useGetPoolCandidateSearchRequestsQuery,
} from "../../api/generated";
import Table, { ColumnsOf } from "../Table";
import DashboardContentContainer from "../DashboardContentContainer";
import { poolCandidateTablePath } from "../../adminRoutes";
import { tableEditButtonAccessor } from "../TableEditButton";

type Data = NonNullable<
  FromArray<GetPoolCandidateSearchRequestsQuery["poolCandidateSearchRequests"]>
>;

export const SearchRequestTable: React.FunctionComponent<
  GetPoolCandidateSearchRequestsQuery & { editUrlRoot: string }
> = ({ poolCandidateSearchRequests, editUrlRoot }) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  const columns = useMemo<ColumnsOf<Data>>(
    () => [
      {
        Header: intl.formatMessage({
          defaultMessage: "ID",
          description: "Title displayed on the search request table id column.",
        }),
        accessor: "id",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Date Received",
          description:
            "Title displayed on the search request table requested date column.",
        }),
        accessor: "requestedDate",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Status",
          description:
            "Title displayed on the search request table status column.",
        }),
        accessor: "status",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Manager",
          description:
            "Title displayed on the search request table manager column.",
        }),
        accessor: "fullName",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Department",
          description:
            "Title displayed on the search request table department column.",
        }),
        accessor: ({ department }) => department?.name?.[locale],
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Email",
          description:
            "Title displayed on the search request table email column.",
        }),
        accessor: "email",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Job Title",
          description:
            "Title displayed on the search request table job title column.",
        }),
        accessor: "jobTitle",
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Pool",
          description:
            "Title displayed on the search request table pool column.",
        }),
        accessor: ({ poolCandidateFilter }) =>
          poolCandidateFilter.pools?.map(
            (pool) =>
              pool && (
                <a key={pool.id} href={poolCandidateTablePath(pool.id)}>
                  {pool.name?.[locale]}
                </a>
              ),
          ),
      },
      {
        Header: intl.formatMessage({
          defaultMessage: "Edit",
          description:
            "Title displayed for the search request table edit column.",
        }),
        accessor: ({ id }) => tableEditButtonAccessor(id, editUrlRoot),
      },
    ],
    [intl, locale, editUrlRoot],
  );

  const memoizedData = useMemo(
    () => poolCandidateSearchRequests.filter(notEmpty),
    [poolCandidateSearchRequests],
  );

  return <Table data={memoizedData} columns={columns} hiddenCols={["id"]} />;
};

export const SearchRequestTableApi: React.FunctionComponent = () => {
  const intl = useIntl();
  const [result] = useGetPoolCandidateSearchRequestsQuery();
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
          {intl.formatMessage(commonMessages.loadingError)}
          {error.message}
        </p>
      </DashboardContentContainer>
    );

  return (
    <SearchRequestTable
      poolCandidateSearchRequests={data?.poolCandidateSearchRequests ?? []}
      editUrlRoot={pathname}
    />
  );
};
